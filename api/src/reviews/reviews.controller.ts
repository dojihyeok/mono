import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RateeType } from '@prisma/client';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

// 전역 프리픽스 없음 — 절대경로. 다방향 평가 + 신뢰점수 도메인(§4-5).
@Controller()
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  // 평가 제출(TrustScore 재계산)
  @Post('reviews')
  create(@Body() dto: CreateReviewDto) {
    return this.reviews.create(dto);
  }

  // 평가 목록 — ?rateeType=&rateeId=&workRequestId=&limit=
  @Get('reviews')
  list(
    @Query('rateeType') rateeType?: string,
    @Query('rateeId') rateeId?: string,
    @Query('workRequestId') workRequestId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviews.list({
      rateeType: (rateeType as RateeType) || undefined,
      rateeId: rateeId || undefined,
      workRequestId: workRequestId || undefined,
      limit: limit ? Number(limit) : 100,
    });
  }

  // 신뢰점수 조회(파생 값)
  @Get('trust-scores/:subjectType/:subjectId')
  getTrustScore(
    @Param('subjectType') subjectType: string,
    @Param('subjectId') subjectId: string,
  ) {
    return this.reviews.getTrustScore(subjectType as RateeType, subjectId);
  }
}
