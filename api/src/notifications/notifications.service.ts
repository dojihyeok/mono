import { Injectable, Logger } from '@nestjs/common';
import { Prisma, CareerBand } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as webpush from 'web-push';

// 경력 버킷 순위 — 사용자 경력 ≥ 공고 요구 경력 비교용.
const BAND_RANK: Record<string, number> = {
  UNDER_1Y: 0,
  Y1_3: 1,
  Y3_5: 2,
  Y5_10: 3,
  OVER_10Y: 4,
};

// 알림 도메인 — 매칭(공고 OPEN 시) → Notification 적재 + (구독 시)웹푸시 전송, 인앱 알림센터 조회.
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private vapidReady = false;

  constructor(private readonly prisma: PrismaService) {
    const pub = process.env.VAPID_PUBLIC_KEY;
    const priv = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT || 'mailto:admin@mono.app';
    if (pub && priv) {
      try {
        webpush.setVapidDetails(subject, pub, priv);
        this.vapidReady = true;
        this.logger.log('웹푸시(VAPID) 설정 완료');
      } catch (e) {
        this.logger.warn(`VAPID 설정 실패(푸시 비활성): ${e}`);
      }
    } else {
      this.logger.log('VAPID 키 미설정 — 인앱 알림만 동작(푸시 스킵)');
    }
  }

  vapidPublicKey() {
    return { key: process.env.VAPID_PUBLIC_KEY ?? null };
  }

  // ── 인앱 알림센터 ──────────────────────────────────────────
  list(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { jobPost: { select: { id: true, title: true, status: true } } },
    });
  }

  async unreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, read: false },
    });
    return { count };
  }

  async markRead(id: string) {
    await this.prisma.notification.updateMany({ where: { id }, data: { read: true } });
    return { ok: true };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return { ok: true };
  }

  // 단건 알림 생성 + (구독 시)푸시 — 재호출 등 다른 도메인이 재사용(coworkers 모듈 등).
  async notifyUser(
    userId: string,
    type: string,
    title: string,
    body: string,
    jobPostId?: string,
  ) {
    const notif = await this.prisma.notification.create({
      data: { userId, type, title, body, jobPostId: jobPostId ?? null },
    });
    // 푸시는 응답을 막지 않도록 fire-and-forget(sendPush 자체가 에러를 삼킴).
    void this.sendPush(userId, title, body, jobPostId ?? '').catch(() => undefined);
    return notif;
  }

  // ── 웹푸시 구독 ────────────────────────────────────────────
  async saveSubscription(
    userId: string,
    sub: { endpoint: string; p256dh: string; auth: string },
  ) {
    await this.prisma.pushSubscription.upsert({
      where: { endpoint: sub.endpoint },
      create: { userId, endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
      update: { userId, p256dh: sub.p256dh, auth: sub.auth },
    });
    return { ok: true };
  }

  async removeSubscription(endpoint: string) {
    if (endpoint) await this.prisma.pushSubscription.deleteMany({ where: { endpoint } });
    return { ok: true };
  }

  // ── 매칭 → 알림 생성 + 푸시 ────────────────────────────────
  // 공고가 OPEN 될 때 호출(admin 승인). 절대 throw 하지 않음(승인 흐름 보호).
  async notifyMatchingUsers(jobPostId: string): Promise<{ notified: number }> {
    try {
      const post = await this.prisma.jobPost.findUnique({
        where: { id: jobPostId },
        include: { company: { select: { name: true } } },
      });
      if (!post || post.status !== 'OPEN' || post.jobType.length === 0) {
        return { notified: 0 };
      }

      // 요건을 DB where 로 선거름(직군∩ + 지역∩ + 경력 ≥ 요구) — 전체 후보 가져와 JS 필터하던 over-fetch 제거.
      const where: Prisma.UserWhereInput = {
        name: { not: null },
        jobType: { hasSome: post.jobType },
      };
      if (post.region.length > 0) where.region = { hasSome: post.region };
      if (post.careerBand) {
        const minRank = BAND_RANK[post.careerBand];
        const okBands = (Object.keys(BAND_RANK) as CareerBand[]).filter(
          (b) => BAND_RANK[b] >= minRank,
        );
        where.careerYears = { in: okBands };
      }
      const matched = await this.prisma.user.findMany({ where, select: { id: true } });

      const title = '나와 맞는 새 공고';
      const body = [post.title, post.region.join(', '), post.company?.name]
        .filter(Boolean)
        .join(' · ');

      // 멱등 — 이미 이 공고로 알림 받은 유저를 단일 쿼리로 일괄 조회(N+1 제거).
      const matchedIds = matched.map((u) => u.id);
      if (matchedIds.length === 0) return { notified: 0 };
      const already = await this.prisma.notification.findMany({
        where: { jobPostId: post.id, type: 'JOB_MATCH', userId: { in: matchedIds } },
        select: { userId: true },
      });
      const alreadySet = new Set(already.map((n) => n.userId));
      const fresh = matchedIds.filter((id) => !alreadySet.has(id));
      if (fresh.length === 0) return { notified: 0 };

      // 일괄 삽입(레이스 시 unique 충돌은 skipDuplicates 로 무시 — 단, 유니크 제약 없으므로 사실상 위 dedup 가 담당).
      await this.prisma.notification.createMany({
        data: fresh.map((userId) => ({
          userId,
          type: 'JOB_MATCH',
          jobPostId: post.id,
          title,
          body,
        })),
      });

      // 푸시는 승인 응답을 막지 않도록 fire-and-forget(sendPush 자체가 에러를 삼킴).
      void Promise.all(fresh.map((userId) => this.sendPush(userId, title, body, post.id))).catch(
        () => undefined,
      );

      this.logger.log(`공고 ${post.id} 매칭 알림 ${fresh.length}명 생성`);
      return { notified: fresh.length };
    } catch (e) {
      this.logger.error(`notifyMatchingUsers 실패(jobPost=${jobPostId}): ${e}`);
      return { notified: 0 };
    }
  }

  private async sendPush(userId: string, title: string, body: string, jobPostId: string) {
    if (!this.vapidReady) return;
    const subs = await this.prisma.pushSubscription.findMany({ where: { userId } });
    const payload = JSON.stringify({ title, body, url: '/mono', jobPostId });
    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload,
          );
        } catch (e: unknown) {
          const code = (e as { statusCode?: number })?.statusCode;
          // 만료/무효 구독 정리
          if (code === 404 || code === 410) {
            await this.prisma.pushSubscription.deleteMany({ where: { endpoint: s.endpoint } });
          }
        }
      }),
    );
  }
}
