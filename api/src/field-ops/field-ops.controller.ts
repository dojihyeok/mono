import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FieldOpsFeature } from '@prisma/client';
import { FieldOpsService } from './field-ops.service';
import { CreateFieldOpsInterestDto } from './dto/create-field-ops-interest.dto';
import { CreateAiLeaderInterestDto } from './dto/create-ai-leader-interest.dto';

// 전역 프리픽스 없음 — 절대경로 명시. Field Ops 관심 도메인.
@Controller()
export class FieldOpsController {
  constructor(private readonly fieldOps: FieldOpsService) {}

  // 관심 등록(익명 허용)
  @Post('field-ops/interests')
  createInterest(@Body() dto: CreateFieldOpsInterestDto) {
    return this.fieldOps.createInterest(dto);
  }

  // 관심 목록(최신순, 선택 필터 feature). 관리/검증용.
  @Get('field-ops/interests')
  listInterests(
    @Query('feature') feature?: FieldOpsFeature,
    @Query('limit') limit?: string,
  ) {
    return this.fieldOps.listInterests({
      feature: feature || undefined,
      limit: limit ? Number(limit) : 100,
    });
  }

  // AI현장리더 관심 등록(익명 허용)
  @Post('ai-leader/interests')
  createAiLeaderInterest(@Body() dto: CreateAiLeaderInterestDto) {
    return this.fieldOps.createAiLeaderInterest(dto);
  }

  // AI현장리더 관심 목록(최신순). 관리/검증용.
  @Get('ai-leader/interests')
  listAiLeaderInterests(@Query('limit') limit?: string) {
    return this.fieldOps.listAiLeaderInterests({
      limit: limit ? Number(limit) : 100,
    });
  }
}
