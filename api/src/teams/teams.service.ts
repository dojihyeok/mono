import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CareerBand,
  IndustryType,
  Prisma,
  TeamAvailabilityStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterTeamDto } from './dto/register-team.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

// 반장 → 팀 일괄 등록 도메인 (GTM: 반장이 팀을 통째로 데려와 공급 시딩).
// DB 직결 — local-first 아님. 멤버는 연락처로 멱등 가입(User) 후 TeamMember 링크.
@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // 반장(leaderId)의 팀에 멤버 일괄 등록. 팀 없으면 생성, 있으면 멤버 추가(멱등).
  async registerTeam(leaderId: string, dto: RegisterTeamDto) {
    const leader = await this.prisma.user.findUnique({ where: { id: leaderId } });
    if (!leader) throw new NotFoundException(`User ${leaderId} not found`);
    // 반장 승인(관리자)된 계정만 팀 생성 가능 — 무작정 아무나 생성 차단.
    if (leader.role !== 'FIELD_LEADER') {
      throw new ForbiddenException('반장 승인 후 팀을 만들 수 있어요.');
    }

    // 연락처 dedupe — 반장이 같은 번호를 중복 입력해도 1건만 처리.
    const seen = new Set<string>();
    const members = (dto.members ?? []).filter((m) => {
      if (seen.has(m.phone)) return false;
      seen.add(m.phone);
      return true;
    });

    // 팀 프로필(선택) — 입력으로 들어온 필드만 반영(미입력 필드는 기존값 유지).
    const profile: {
      industries?: IndustryType[];
      workTypes?: string[];
      avgCareerBand?: CareerBand;
      safetyRate?: number;
      equipOperators?: number;
      regions?: string[];
    } = {};
    if (dto.industries !== undefined) profile.industries = dto.industries;
    if (dto.workTypes !== undefined) profile.workTypes = dto.workTypes;
    if (dto.avgCareerBand !== undefined) profile.avgCareerBand = dto.avgCareerBand;
    if (dto.safetyRate !== undefined) profile.safetyRate = dto.safetyRate;
    if (dto.equipOperators !== undefined) profile.equipOperators = dto.equipOperators;
    if (dto.regions !== undefined) profile.regions = dto.regions;

    // 팀 생성/갱신 + 멤버 가입·링크를 단일 트랜잭션으로(중간 실패 시 일부만 반영 방지).
    await this.prisma.$transaction(async (tx) => {
      let team = await tx.team.findFirst({ where: { leaderId } });
      if (!team) {
        team = await tx.team.create({
          data: { name: dto.name, leaderId, ...profile },
        });
      } else {
        // 팀명 변경 + 프로필 입력분만 갱신(둘 다 없으면 update 생략).
        const data: typeof profile & { name?: string } = { ...profile };
        if (dto.name && dto.name !== team.name) data.name = dto.name;
        if (Object.keys(data).length > 0) {
          team = await tx.team.update({ where: { id: team.id }, data });
        }
      }
      for (const m of members) {
        const member = await tx.user.upsert({
          where: { phone: m.phone },
          create: { name: m.name, phone: m.phone },
          update: {}, // 기존 유저면 그대로(이름 덮어쓰지 않음)
        });
        if (member.id === leaderId) continue; // 반장은 멤버로 추가하지 않음
        await tx.teamMember.upsert({
          where: { teamId_userId: { teamId: team.id, userId: member.id } },
          create: { teamId: team.id, userId: member.id },
          update: {},
        });
      }
    });

    this.logger.log(`반장 ${leaderId} 팀 등록 — 멤버 ${members.length}건 처리`);
    return this.getTeam(leaderId);
  }

  // 팀 삭제 — 반장의 팀 제거(TeamMember 는 onDelete: Cascade 로 함께 삭제). 멱등.
  async deleteTeam(leaderId: string) {
    await this.prisma.team.deleteMany({ where: { leaderId } });
    return { ok: true };
  }

  // 반장의 팀 + 멤버 목록
  async getTeam(leaderId: string) {
    const team = await this.prisma.team.findFirst({
      where: { leaderId },
      include: {
        members: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, name: true, jobType: true, region: true } },
          },
        },
      },
    });
    if (!team) return null;
    return {
      id: team.id,
      name: team.name,
      leaderId: team.leaderId,
      // 팀 프로필(캐노니컬 §3-3) — 미설정 시 빈 배열/null 그대로 노출.
      industries: team.industries,
      workTypes: team.workTypes,
      avgCareerBand: team.avgCareerBand,
      safetyRate: team.safetyRate,
      equipOperators: team.equipOperators,
      regions: team.regions,
      memberCount: team.members.length,
      members: team.members.map((tm) => ({
        userId: tm.userId,
        name: tm.user.name,
        jobType: tm.user.jobType,
        region: tm.user.region,
      })),
    };
  }

  // 팀 디렉터리 — 후보매칭/리더풀용(§4-3 P1). 산업/지역/작업유형/가동상태 필터, 최신순.
  listTeams(params: {
    industry?: IndustryType;
    region?: string;
    workType?: string;
    availability?: TeamAvailabilityStatus;
    limit?: number;
  }) {
    const { industry, region, workType, availability, limit = 50 } = params;
    const where: Prisma.TeamWhereInput = {};
    if (industry) where.industries = { has: industry };
    if (region) where.regions = { has: region };
    if (workType) where.workTypes = { has: workType };
    // 가동상태: 해당 status 의 가동일정을 1건 이상 가진 팀만.
    if (availability) where.availabilities = { some: { status: availability } };

    return this.prisma.team.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 50, 1), 200),
      select: {
        id: true,
        name: true,
        leaderId: true,
        industries: true,
        workTypes: true,
        avgCareerBand: true,
        safetyRate: true,
        equipOperators: true,
        regions: true,
        createdAt: true,
        leader: { select: { id: true, name: true } },
        _count: { select: { members: true } },
      },
    });
  }

  // 반장 팀의 가동일정 목록(weekStart 순). 팀 없으면 빈 배열(getTeam 이 null 반환과 동일 톤).
  async getTeamAvailability(leaderId: string) {
    const team = await this.prisma.team.findFirst({
      where: { leaderId },
      select: { id: true },
    });
    if (!team) return [];
    return this.prisma.teamAvailability.findMany({
      where: { teamId: team.id },
      orderBy: { weekStart: 'asc' },
    });
  }

  // 반장 팀의 주간 가동일정 upsert — weekStart 기준 멱등. 팀 없으면 404(일정 부착 대상 없음).
  async upsertTeamAvailability(leaderId: string, dto: UpdateAvailabilityDto) {
    const team = await this.prisma.team.findFirst({
      where: { leaderId },
      select: { id: true },
    });
    if (!team) {
      throw new NotFoundException('팀을 먼저 등록한 뒤 가동일정을 설정할 수 있어요.');
    }

    // 입력으로 들어온 필드만 반영(미입력은 create 기본값/기존값 유지).
    const fields: {
      status?: UpdateAvailabilityDto['status'];
      regions?: string[];
      urgentOk?: boolean;
    } = {};
    if (dto.status !== undefined) fields.status = dto.status;
    if (dto.regions !== undefined) fields.regions = dto.regions;
    if (dto.urgentOk !== undefined) fields.urgentOk = dto.urgentOk;

    const availability = await this.prisma.teamAvailability.upsert({
      where: { teamId_weekStart: { teamId: team.id, weekStart: dto.weekStart } },
      create: { teamId: team.id, weekStart: dto.weekStart, ...fields },
      update: { ...fields },
    });

    this.logger.log(
      `반장 ${leaderId} 팀 가동일정 upsert — ${dto.weekStart} (${availability.status})`,
    );
    return availability;
  }

  // ── 팀 커뮤니티 (TeamPost) ──
  async createTeamPost(teamId: string, authorId: string, data: { content: string; isNotice?: boolean }) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new NotFoundException(`Team ${teamId} not found`);

    return this.prisma.teamPost.create({
      data: {
        teamId,
        authorId,
        content: data.content,
        isNotice: data.isNotice ?? false,
      },
    });
  }

  async listTeamPosts(teamId: string) {
    return this.prisma.teamPost.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    });
  }
}
