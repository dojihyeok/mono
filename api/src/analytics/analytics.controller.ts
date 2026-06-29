import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

// 마케팅 분석 웹 BFF(/api/analytics/*) → 이 컨트롤러. 읽기 전용 집계.
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('summary')
  summary() {
    return this.analytics.summary();
  }
}
