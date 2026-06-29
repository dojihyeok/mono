import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RiskService } from './risk.service';
import { CreateRiskReportDto } from './dto/create-risk-report.dto';
import { QueryRiskReportDto } from './dto/query-risk-report.dto';
import { UpdateRiskStatusDto } from './dto/update-risk-status.dto';

// 전역 프리픽스 없음 — 절대경로 명시. 리스크 신고(PDF §8-4).
@Controller()
export class RiskController {
  constructor(private readonly risk: RiskService) {}

  // 신고 생성 — 정적 경로, :id 동적보다 위.
  @Post('risk-reports')
  create(@Body() dto: CreateRiskReportDto) {
    return this.risk.create(dto);
  }

  // 신고 목록(필터).
  @Get('risk-reports')
  list(@Query() query: QueryRiskReportDto) {
    return this.risk.list(query);
  }

  // 상태 변경.
  @Patch('risk-reports/:id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateRiskStatusDto) {
    return this.risk.updateStatus(id, dto);
  }
}
