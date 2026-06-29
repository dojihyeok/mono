import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApplyDto } from './dto/apply.dto';
import { SetStatusDto } from './dto/set-status.dto';
import { CheckInDto } from './dto/check-in.dto';
import { CoworkersService } from '../coworkers/coworkers.service';

// 지원 → 수락(배정) → 출역 체인.
@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coworkers: CoworkersService,
  ) {}

  // 기술자: 공고 지원 (idempotent — unique jobPostId+userId)
  async apply(jobPostId: string, dto: ApplyDto) {
    const post = await this.prisma.jobPost.findUnique({ where: { id: jobPostId } });
    if (!post) throw new NotFoundException(`JobPost ${jobPostId} not found`);
    if (post.status === 'CLOSED') {
      throw new BadRequestException('마감된 공고에는 지원할 수 없습니다.');
    }
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);
    return this.prisma.jobApplication.upsert({
      where: { jobPostId_userId: { jobPostId, userId: dto.userId } },
      create: { jobPostId, userId: dto.userId },
      update: {},
      include: { jobPost: { select: { title: true } } },
    });
  }

  // 기술자: 내 지원 목록(공고·회사·상태)
  listUserApplications(userId: string) {
    return this.prisma.jobApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        jobPost: {
          select: {
            id: true,
            title: true,
            jobType: true,
            region: true,
            status: true,
            company: { select: { name: true } },
          },
        },
      },
    });
  }

  // 기술자: 배정(ACCEPTED)된 현장 + 출역 기록 — 출역·정산 탭용
  listUserAssignments(userId: string) {
    return this.prisma.jobApplication.findMany({
      where: { userId, status: 'ACCEPTED' },
      orderBy: { updatedAt: 'desc' },
      include: {
        jobPost: {
          select: {
            id: true,
            title: true,
            region: true,
            company: { select: { name: true } },
          },
        },
        attendances: { orderBy: { checkInAt: 'desc' } },
      },
    });
  }

  // 기업: 우리 공고에 들어온 지원 목록(지원자 공개 정보)
  listCompanyApplications(companyId: string) {
    return this.prisma.jobApplication.findMany({
      where: { jobPost: { companyId } },
      orderBy: { createdAt: 'desc' },
      include: {
        jobPost: { select: { id: true, title: true } },
        user: {
          select: {
            id: true,
            name: true,
            jobType: true,
            careerYears: true,
            region: true,
            _count: {
              select: { careerCards: true, certificates: true, educations: true },
            },
          },
        },
      },
    });
  }

  // 기업: 지원 수락/반려
  async setStatus(applicationId: string, dto: SetStatusDto) {
    // 기업은 수락/반려만 — APPLIED 로의 역전은 출역/배정 정합성을 깨므로 차단.
    if (dto.status === 'APPLIED') {
      throw new BadRequestException('지원 상태는 수락 또는 반려만 변경할 수 있습니다.');
    }
    try {
      const updated = await this.prisma.jobApplication.update({
        where: { id: applicationId },
        data: { status: dto.status },
      });
      // 배정(ACCEPTED) 시 같은 공고에 배정된 동료들과 그래프 엣지 형성(throw 안 함).
      if (updated.status === 'ACCEPTED') {
        await this.coworkers.linkCoassigned(applicationId);
      }
      return updated;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Application ${applicationId} not found`);
      }
      throw e;
    }
  }

  // 기술자: 출근 체크인 — ACCEPTED 배정만, 미마감 기록 있으면 그대로 반환(중복 방지)
  async checkIn(applicationId: string, dto: CheckInDto) {
    const app = await this.prisma.jobApplication.findUnique({
      where: { id: applicationId },
    });
    if (!app) throw new NotFoundException(`Application ${applicationId} not found`);
    if (app.status !== 'ACCEPTED') {
      throw new BadRequestException('배정(수락)된 공고만 출근 체크할 수 있습니다.');
    }
    const open = await this.prisma.attendance.findFirst({
      where: { applicationId, checkOutAt: null },
    });
    if (open) return open;
    const workDate = dto.workDate || new Date().toISOString().slice(0, 10);
    return this.prisma.attendance.create({ data: { applicationId, workDate } });
  }

  // 기술자: 퇴근 체크아웃 — 가장 최근 미마감 출근 마감
  async checkOut(applicationId: string) {
    const open = await this.prisma.attendance.findFirst({
      where: { applicationId, checkOutAt: null },
      orderBy: { checkInAt: 'desc' },
    });
    if (!open) throw new BadRequestException('진행 중인 출근 기록이 없습니다.');
    return this.prisma.attendance.update({
      where: { id: open.id },
      data: { checkOutAt: new Date() },
    });
  }
}
