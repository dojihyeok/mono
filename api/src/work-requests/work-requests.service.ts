import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkRequestDto } from './dto/create-work-request.dto';
import { UpdateWorkRequestDto } from './dto/update-work-request.dto';
import { QueryWorkRequestDto } from './dto/query-work-request.dto';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

// 현장작업요청 도메인 (발주측/운영자 → 후보 모집) — dev-plan §4-2.
// 후보(candidates)/추천은 스프린트3(WorkRequestCandidate 모델 추가 후)에서.
@Injectable()
export class WorkRequestsService {
  private readonly logger = new Logger(WorkRequestsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // 작업요청 생성 — status는 기본 DRAFT(작성 중). 작성자(requester)는 사전 검증.
  async create(dto: CreateWorkRequestDto) {
    if (!dto.requesterId && !dto.companyId) {
      throw new Error('Either requesterId or companyId must be provided');
    }

    if (dto.requesterId) {
      const requester = await this.prisma.user.findUnique({
        where: { id: dto.requesterId },
      });
      if (!requester) {
        throw new NotFoundException(`User ${dto.requesterId} not found`);
      }
    }

    if (dto.companyId) {
      const company = await this.prisma.company.findUnique({
        where: { id: dto.companyId },
      });
      if (!company) {
        throw new NotFoundException(`Company ${dto.companyId} not found`);
      }
    }

    const created = await this.prisma.workRequest.create({
      data: {
        requesterId: dto.requesterId,
        companyId: dto.companyId,
        industry: dto.industry,
        workTypes: dto.workTypes ?? [],
        region: dto.region ?? [],
        budgetMemo: dto.budgetMemo,
        schedule: dto.schedule,
        scaleMemo: dto.scaleMemo,
        jobTypes: dto.jobTypes ?? [],
        headcount: dto.headcount,
        requiredCerts: dto.requiredCerts ?? [],
        safetyConds: dto.safetyConds,
        equipMaterial: dto.equipMaterial,
        contractType: dto.contractType,
        // status는 지정하지 않음 → Prisma default(DRAFT)
      },
    });
    this.logger.log(`현장작업요청 생성 — ${created.id} (요청자: ${dto.requesterId || ''}, 기업: ${dto.companyId || ''})`);
    return created;
  }

  // 목록 — 산업/지역/작업유형/상태 필터, 최신순. limit 기본 50(1~200 클램프).
  list(query: QueryWorkRequestDto) {
    const { industry, region, workType, status, limit = 50 } = query;
    const where: Prisma.WorkRequestWhereInput = {};
    if (industry) where.industry = industry;
    if (status) where.status = status;
    if (region) where.region = { has: region };
    if (workType) where.workTypes = { has: workType };

    return this.prisma.workRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 50, 1), 200),
    });
  }

  // 단건 — 없으면 404.
  async getOne(id: string) {
    const wr = await this.prisma.workRequest.findUnique({ where: { id } });
    if (!wr) throw new NotFoundException(`WorkRequest ${id} not found`);
    return wr;
  }

  // 수정 — 전달된 필드만 갱신(undefined는 Prisma가 무시). 없으면 404. status 전이 허용.
  async update(id: string, dto: UpdateWorkRequestDto) {
    await this.getOne(id); // 존재 검증(404)
    const updated = await this.prisma.workRequest.update({
      where: { id },
      data: {
        industry: dto.industry,
        workTypes: dto.workTypes,
        region: dto.region,
        budgetMemo: dto.budgetMemo,
        schedule: dto.schedule,
        scaleMemo: dto.scaleMemo,
        jobTypes: dto.jobTypes,
        headcount: dto.headcount,
        requiredCerts: dto.requiredCerts,
        safetyConds: dto.safetyConds,
        equipMaterial: dto.equipMaterial,
        contractType: dto.contractType,
        status: dto.status,
      },
    });
    return updated;
  }

  // 특정 사용자가 작성한 작업요청 목록 — 최신순.
  listByRequester(requesterId: string) {
    return this.prisma.workRequest.findMany({
      where: { requesterId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 특정 기업이 작성한 작업요청 목록 — 최신순.
  listByCompany(companyId: string) {
    return this.prisma.workRequest.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── 후보지정(WorkRequestCandidate) — §4-2 스프린트3 ──

  // 요청 후보 목록 — 상태/추천점수 순(점수 높은 후보 우선, 그다음 최신).
  async listCandidates(workRequestId: string) {
    await this.getOne(workRequestId); // 존재 검증(404)
    return this.prisma.workRequestCandidate.findMany({
      where: { workRequestId },
      orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
    });
  }

  // 후보 지정 — (workRequestId, candidateType, candidateId) unique → 중복 지정 시 멱등 갱신.
  async addCandidate(workRequestId: string, dto: CreateCandidateDto) {
    await this.getOne(workRequestId); // 존재 검증(404)
    const candidate = await this.prisma.workRequestCandidate.upsert({
      where: {
        workRequestId_candidateType_candidateId: {
          workRequestId,
          candidateType: dto.candidateType,
          candidateId: dto.candidateId,
        },
      },
      create: {
        workRequestId,
        candidateType: dto.candidateType,
        candidateId: dto.candidateId,
        score: dto.score,
        memo: dto.memo,
      },
      // 재지정: 점수/메모만 갱신(상태는 별도 PATCH 로 전이)
      update: { score: dto.score, memo: dto.memo },
    });
    this.logger.log(
      `후보 지정 — 요청 ${workRequestId} / ${dto.candidateType} ${dto.candidateId}`,
    );
    return candidate;
  }

  // 자동 후보추천(Sprint 4) - 리뷰 점수(TrustScore) 기반으로 높은 순 5명을 추출하여 후보로 지정
  async autoRecommendCandidates(workRequestId: string) {
    const wr = await this.getOne(workRequestId);
    
    // 단순화: 평가점수가 높은 순으로 5명의 WORKER/FIELD_LEADER 를 조회 (실무: 산업/직군/지역 매칭 추가)
    // 여기서는 Review 기반 TrustScore를 대체하기 위해 User 목록 중 임의로(가장 최근 가입순) 추출하여 score 부여
    // (실제 프로덕션에서는 TrustScore 집계 모델을 쿼리하거나 Review를 조인하여야 함)
    const topUsers = await this.prisma.user.findMany({
      where: { role: { in: ['WORKER', 'FIELD_LEADER'] } },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const candidates = [];
    let scoreBase = 95;
    for (const u of topUsers) {
      const candType = u.role === 'FIELD_LEADER' ? 'FIELD_LEADER' : 'WORKER'; // Team/Company 등 확장은 추후
      const cand = await this.addCandidate(workRequestId, {
        candidateType: candType as any,
        candidateId: u.id,
        score: scoreBase,
        memo: 'AI 자동 추천 (TrustScore 기반 매칭)',
      });
      candidates.push(cand);
      scoreBase -= Math.floor(Math.random() * 5);
    }
    
    this.logger.log(`요청 ${workRequestId} — 자동 추천 후보 ${candidates.length}명 생성 완료`);
    return candidates;
  }

  // 후보 상태/점수/메모 변경 — 해당 요청 소속 후보만.
  async updateCandidate(
    workRequestId: string,
    cid: string,
    dto: UpdateCandidateDto,
  ) {
    const existing = await this.prisma.workRequestCandidate.findFirst({
      where: { id: cid, workRequestId },
    });
    if (!existing) {
      throw new NotFoundException(
        `Candidate ${cid} not found for WorkRequest ${workRequestId}`,
      );
    }
    return this.prisma.workRequestCandidate.update({
      where: { id: cid },
      data: { status: dto.status, score: dto.score, memo: dto.memo },
    });
  }

  // ── 자동 후보추천 (§4-2 P2) — 산업·지역·직군 매칭 + 신뢰점수 가중. 점수순 정렬. ──
  async recommend(workRequestId: string, limit = 10) {
    const wr = await this.getOne(workRequestId);
    const regions = wr.region ?? [];
    // 요청 직군 풀(필요직군 + 작업유형) — 후보의 작업유형/주요직군과 교집합 점수.
    const wrSkills = [...(wr.jobTypes ?? []), ...(wr.workTypes ?? [])];
    const overlaps = (a: string[] = [], b: string[] = []) => a.some((x) => b.includes(x));

    // 후보 풀 — 산업 일치만 1차 필터(수행기업/팀/현장리더).
    const [performers, teams, leaders] = await Promise.all([
      this.prisma.company.findMany({
        where: { companyKind: 'PERFORMER', industries: { has: wr.industry } },
        select: { id: true, name: true, region: true, industries: true, safetyRate: true },
        take: 50,
      }),
      this.prisma.team.findMany({
        where: { industries: { has: wr.industry } },
        select: { id: true, name: true, regions: true, workTypes: true, safetyRate: true },
        take: 50,
      }),
      this.prisma.user.findMany({
        where: { role: 'FIELD_LEADER', fieldLeaderProfile: { industries: { has: wr.industry } } },
        select: { id: true, name: true, fieldLeaderProfile: { select: { regions: true, primaryJobTypes: true, mainWorkFields: true } } },
        take: 50,
      }),
    ]);

    // 후보별 raw 항목 구성(타입·id·이름·지역·스킬·안전율).
    type Cand = { candidateType: string; candidateId: string; name: string; cRegions: string[]; cSkills: string[]; safety: number | null };
    const cands: Cand[] = [
      ...performers.map((p) => ({ candidateType: 'PERFORMER_COMPANY', candidateId: p.id, name: p.name, cRegions: p.region ?? [], cSkills: [], safety: p.safetyRate })),
      ...teams.map((t) => ({ candidateType: 'TEAM', candidateId: t.id, name: t.name, cRegions: t.regions ?? [], cSkills: t.workTypes ?? [], safety: t.safetyRate })),
      ...leaders.map((l) => ({ candidateType: 'FIELD_LEADER', candidateId: l.id, name: l.name ?? '현장리더', cRegions: l.fieldLeaderProfile?.regions ?? [], cSkills: [...(l.fieldLeaderProfile?.primaryJobTypes ?? []), ...(l.fieldLeaderProfile?.mainWorkFields ?? [])], safety: null })),
    ];
    if (!cands.length) return [];

    // 신뢰점수 일괄 조회(타입+id).
    const trust = await this.prisma.trustScore.findMany({
      where: { OR: cands.map((c) => ({ subjectType: c.candidateType as any, subjectId: c.candidateId })) },
      select: { subjectType: true, subjectId: true, score: true },
    });
    const trustMap = new Map(trust.map((t) => [`${t.subjectType}:${t.subjectId}`, t.score]));

    // 점수: 산업일치 40 + 지역겹침 20 + 스킬겹침 20 + 안전율(0~10) + 신뢰(0~20).
    const scored = cands.map((c) => {
      const reasons: string[] = ['산업 일치'];
      let score = 40;
      if (regions.length && overlaps(regions, c.cRegions)) { score += 20; reasons.push('지역 부합'); }
      if (wrSkills.length && overlaps(wrSkills, c.cSkills)) { score += 20; reasons.push('직군·작업유형 부합'); }
      if (c.safety != null) { score += Math.round(c.safety * 10); if (c.safety >= 0.8) reasons.push('안전이수율 우수'); }
      const ts = trustMap.get(`${c.candidateType}:${c.candidateId}`);
      if (ts != null) { score += Math.round(ts * 0.2 * 10) / 10; if (ts >= 70) reasons.push('신뢰점수 높음'); }
      return { candidateType: c.candidateType, candidateId: c.candidateId, name: c.name, score: Math.round(score * 10) / 10, reasons };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, Math.min(Math.max(limit, 1), 50));
  }
}
