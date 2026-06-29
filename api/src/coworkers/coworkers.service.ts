import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

// 함께 일한 동료(그래프) 도메인.
// - 그래프 씨앗: 같은 공고에 배정(ACCEPTED)된 사용자끼리 자동 엣지 형성(linkCoassigned).
// - 재호출 1경로: 동료 목록 조회 + 다시 호출(알림).
@Injectable()
export class CoworkersService {
  private readonly logger = new Logger(CoworkersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // 공고 배정(ACCEPTED) 시 호출 — 같은 공고에 이미 배정된 '다른' 사용자들과 양방향 엣지 형성/누적.
  // 절대 throw 하지 않음(배정 흐름 보호).
  async linkCoassigned(applicationId: string): Promise<{ linked: number }> {
    try {
      const app = await this.prisma.jobApplication.findUnique({
        where: { id: applicationId },
        include: { jobPost: { select: { id: true, title: true } } },
      });
      if (!app || app.status !== 'ACCEPTED') return { linked: 0 };

      // 같은 공고에 배정(ACCEPTED)된 나 외의 사용자들
      const peers = await this.prisma.jobApplication.findMany({
        where: {
          jobPostId: app.jobPostId,
          status: 'ACCEPTED',
          userId: { not: app.userId },
        },
        select: { userId: true },
      });
      if (peers.length === 0) return { linked: 0 };

      const siteName = app.jobPost?.title ?? null;
      const jobPostId = app.jobPostId;

      // 한 쌍당 엣지 1개(@@unique). 양방향 + 전체 peer 를 병렬 처리(순차 await 제거).
      await Promise.all(
        peers.flatMap((p) => [
          this.upsertEdge(app.userId, p.userId, jobPostId, siteName),
          this.upsertEdge(p.userId, app.userId, jobPostId, siteName),
        ]),
      );
      this.logger.log(`배정 ${applicationId} → 동료 엣지 ${peers.length}쌍 형성/갱신`);
      return { linked: peers.length };
    } catch (e) {
      this.logger.error(`linkCoassigned 실패(app=${applicationId}): ${e}`);
      return { linked: 0 };
    }
  }

  // 엣지 upsert. 같은 공고 재배정에 의한 중복 증가 방지: 다른 공고일 때만 count 증가.
  private async upsertEdge(
    userId: string,
    coworkerId: string,
    jobPostId: string,
    siteName: string | null,
  ) {
    const existing = await this.prisma.coworker.findUnique({
      where: { userId_coworkerId: { userId, coworkerId } },
      select: { id: true, count: true, jobPostId: true },
    });
    if (existing) {
      const sameJob = existing.jobPostId === jobPostId;
      await this.prisma.coworker.update({
        where: { id: existing.id },
        data: {
          count: sameJob ? existing.count : existing.count + 1,
          jobPostId,
          siteName,
          lastWorkedAt: new Date(),
        },
      });
      return;
    }
    try {
      await this.prisma.coworker.create({
        data: { userId, coworkerId, jobPostId, siteName },
      });
    } catch (e) {
      // 동시 ACCEPT 레이스 — unique(userId,coworkerId) 충돌 시 update 로 폴백(엣지 유실 방지).
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        await this.prisma.coworker.update({
          where: { userId_coworkerId: { userId, coworkerId } },
          data: { jobPostId, siteName, lastWorkedAt: new Date() },
        });
      } else {
        throw e;
      }
    }
  }

  // 내 동료 목록(최근 함께한 순) — "함께 일한 동료" 섹션·재호출용.
  async getCoworkers(userId: string) {
    const edges = await this.prisma.coworker.findMany({
      where: { userId },
      orderBy: [{ lastWorkedAt: 'desc' }],
      take: 50,
      include: {
        coworker: { select: { id: true, name: true, jobType: true, region: true } },
      },
    });
    return edges.map((e) => ({
      coworkerId: e.coworkerId,
      name: e.coworker.name,
      jobType: e.coworker.jobType,
      region: e.coworker.region,
      siteName: e.siteName,
      count: e.count,
      lastWorkedAt: e.lastWorkedAt,
    }));
  }

  // 재호출 — 실제로 함께 일한(엣지 존재) 동료에게만 "함께 일하자" 알림 발송.
  async recall(userId: string, coworkerId: string) {
    const edge = await this.prisma.coworker.findUnique({
      where: { userId_coworkerId: { userId, coworkerId } },
      select: { siteName: true },
    });
    if (!edge) {
      throw new NotFoundException('함께 일한 기록이 있는 동료만 호출할 수 있습니다.');
    }
    const me = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });
    const who = me?.name ?? '함께 일한 동료';
    const title = '함께 일하자는 호출이 왔어요';
    const body = edge.siteName
      ? `${who}님이 회원님을 다시 찾고 있어요 · 함께한 현장: ${edge.siteName}`
      : `${who}님이 회원님을 다시 찾고 있어요`;
    await this.notifications.notifyUser(coworkerId, 'COWORKER_RECALL', title, body);
    return { ok: true };
  }
}
