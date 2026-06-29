import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { IndustryType } from '@prisma/client';
import { GlossaryService } from './glossary.service';
import { CreateGlossaryTermDto } from './dto/create-glossary-term.dto';
import { QueryGlossaryDto } from './dto/query-glossary.dto';

// 전역 프리픽스 없음 — 절대경로 명시. 현장 용어 사전(PDF §4).
@Controller()
export class GlossaryController {
  constructor(private readonly glossary: GlossaryService) {}

  // 용어 목록(필터) — 정적 경로, :industry 동적보다 위.
  @Get('glossary')
  list(@Query() query: QueryGlossaryDto) {
    return this.glossary.list(query);
  }

  // 산업 용어팩 번들(오프라인 캐시용) — 산업 + 공통.
  @Get('glossary/packs/:industry')
  pack(
    @Param('industry') industry: IndustryType,
    @Query() query: QueryGlossaryDto,
  ) {
    return this.glossary.pack(industry, query.lang);
  }

  // 용어 생성(관리자 시드).
  @Post('glossary')
  create(@Body() dto: CreateGlossaryTermDto) {
    return this.glossary.create(dto);
  }
}
