import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, RateeType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

// 다방향 평가 + 신뢰점수 도메인 (dev-plan §4-5, P2).
// 평가 제출 시 피평가자(rateeType,rateeId)의 TrustScore 를 재계산(7항목 평균 → 0~100 점).
@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  // 평가 항목 키 — 평균 집계 대상. (외국인 신뢰도 collaboration 포함, PDF §5-1)
  private static readonly METRICS = [
    'scheduleAdherence',
    'workQuality',
    'communication',
    'safetyManagement',
    'costTrust',
    'rehireIntent',
    'siteEnvironment',
    'collaboration',
  ] as const;

  constructor(private readonly prisma: PrismaService) {}

  // 평가 제출 — 평가자 존재 검증 후 생성, TrustScore 재계산.
  async create(dto: CreateReviewDto) {
    const rater = await this.prisma.user.findUnique({
      where: { id: dto.raterUserId },
    });
    if (!rater) throw new NotFoundException(`User ${dto.raterUserId} not found`);

    const review = await this.prisma.review.create({
      data: {
        raterUserId: dto.raterUserId,
        rateeType: dto.rateeType,
        rateeId: dto.rateeId,
        workRequestId: dto.workRequestId,
        scheduleAdherence: dto.scheduleAdherence,
        workQuality: dto.workQuality,
        communication: dto.communication,
        safetyManagement: dto.safetyManagement,
        costTrust: dto.costTrust,
        rehireIntent: dto.rehireIntent,
        siteEnvironment: dto.siteEnvironment,
        collaboration: dto.collaboration,
        comment: dto.comment,
      },
    });
    await this.recomputeTrustScore(dto.rateeType, dto.rateeId);
    this.logger.log(`평가 제출 — ${dto.rateeType} ${dto.rateeId} (평가자 ${dto.raterUserId})`);
    return review;
  }

  // 신뢰점수 재계산 — 대상의 전체 평가에서 7항목별 평균(있는 값만) → 전체 평균 ×20(0~100).
  private async recomputeTrustScore(rateeType: RateeType, rateeId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { rateeType, rateeId },
    });
    const breakdown: Record<string, number> = {};
    const fieldAverages: number[] = [];
    for (const m of ReviewsService.METRICS) {
      const vals = reviews
        .map((r) => r[m] as number | null)
        .filter((v): v is number => v != null);
      if (vals.length) {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        breakdown[m] = Math.round(avg * 100) / 100;
        fieldAverages.push(avg);
      }
    }
    // 0~5 평균을 0~100 점으로 환산. 평가에 점수가 하나도 없으면 0.
    const score = fieldAverages.length
      ? Math.round((fieldAverages.reduce((a, b) => a + b, 0) / fieldAverages.length) * 20 * 10) / 10
      : 0;

    await this.prisma.trustScore.upsert({
      where: { subjectType_subjectId: { subjectType: rateeType, subjectId: rateeId } },
      create: {
        subjectType: rateeType,
        subjectId: rateeId,
        score,
        reviewCount: reviews.length,
        breakdown: breakdown as Prisma.InputJsonValue,
      },
      update: {
        score,
        reviewCount: reviews.length,
        breakdown: breakdown as Prisma.InputJsonValue,
        computedAt: new Date(),
      },
    });
  }

  // 평가 목록 — rateeType/rateeId/workRequestId 필터, 최신순.
  list(params: { rateeType?: RateeType; rateeId?: string; workRequestId?: string; limit?: number }) {
    const { rateeType, rateeId, workRequestId, limit = 100 } = params;
    const where: Prisma.ReviewWhereInput = {};
    if (rateeType) where.rateeType = rateeType;
    if (rateeId) where.rateeId = rateeId;
    if (workRequestId) where.workRequestId = workRequestId;
    return this.prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 100, 1), 200),
    });
  }

  // 신뢰점수 조회 — 없으면 0점 기본(미평가).
  async getTrustScore(subjectType: RateeType, subjectId: string) {
    const ts = await this.prisma.trustScore.findUnique({
      where: { subjectType_subjectId: { subjectType, subjectId } },
    });
    return ts ?? { subjectType, subjectId, score: 0, reviewCount: 0, breakdown: null };
  }
}
