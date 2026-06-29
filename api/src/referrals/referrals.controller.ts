import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { QueryReferralDto } from './dto/query-referral.dto';

// 전역 프리픽스 없음 — 절대경로 명시. 파트너 연계 큐(PDF §2·§6).
@Controller()
export class ReferralsController {
  constructor(private readonly referrals: ReferralsService) {}

  // 연계 요청 생성.
  @Post('referrals')
  create(@Body() dto: CreateReferralDto) {
    return this.referrals.create(dto);
  }

  // 연계 큐 목록(필터).
  @Get('referrals')
  list(@Query() query: QueryReferralDto) {
    return this.referrals.list(query);
  }
}
