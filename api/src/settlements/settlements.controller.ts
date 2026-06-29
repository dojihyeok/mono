import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SettlementsService } from './settlements.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { QuerySettlementDto } from './dto/query-settlement.dto';

// 전역 프리픽스 없음 — 절대경로 명시. 정산(PDF §7).
@Controller()
export class SettlementsController {
  constructor(private readonly settlements: SettlementsService) {}

  // 정산 생성 — 정적 경로이므로 :id 보다 위.
  @Post('settlements')
  create(@Body() dto: CreateSettlementDto) {
    return this.settlements.create(dto);
  }

  // 목록(필터) — 정적 경로, :id 동적보다 위.
  @Get('settlements')
  list(@Query() query: QuerySettlementDto) {
    return this.settlements.list(query);
  }

  // 단건 상세.
  @Get('settlements/:id')
  getOne(@Param('id') id: string) {
    return this.settlements.getOne(id);
  }

  // 이의제기 — status=DISPUTED.
  @Post('settlements/:id/dispute')
  dispute(@Param('id') id: string) {
    return this.settlements.dispute(id);
  }
}
