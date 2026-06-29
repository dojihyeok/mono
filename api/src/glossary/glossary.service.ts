import { Injectable, Logger } from '@nestjs/common';
import { IndustryType, Prisma, SupportedLang } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGlossaryTermDto } from './dto/create-glossary-term.dto';
import { QueryGlossaryDto } from './dto/query-glossary.dto';

// 현장 용어 사전 — 다국어 번역 + 산업별 용어팩(오프라인 캐시). PDF §4.
@Injectable()
export class GlossaryService {
  private readonly logger = new Logger(GlossaryService.name);

  constructor(private readonly prisma: PrismaService) {}

  // 용어 목록 — category/industry 필터, lang 주면 해당 언어 번역만 include.
  list(query: QueryGlossaryDto) {
    const { lang, category, industry } = query;
    const where: Prisma.GlossaryTermWhereInput = {};
    if (category) where.category = category;
    if (industry) where.industry = industry;

    return this.prisma.glossaryTerm.findMany({
      where,
      include: { translations: lang ? { where: { lang } } : true },
      orderBy: { category: 'asc' },
    });
  }

  // 산업 용어팩 — 해당 산업 + 공통(industry null) 둘 다, 번역 include(오프라인 번들).
  pack(industry: IndustryType, lang?: SupportedLang) {
    return this.prisma.glossaryTerm.findMany({
      where: { OR: [{ industry }, { industry: null }] },
      include: { translations: lang ? { where: { lang } } : true },
      orderBy: { category: 'asc' },
    });
  }

  // 용어 생성(관리자 시드) — translations nested create.
  async create(dto: CreateGlossaryTermDto) {
    const created = await this.prisma.glossaryTerm.create({
      data: {
        koTerm: dto.koTerm,
        category: dto.category,
        industry: dto.industry,
        iconUrl: dto.iconUrl,
        isSafety: dto.isSafety,
        translations: dto.translations?.length
          ? {
              create: dto.translations.map((t) => ({
                lang: t.lang,
                text: t.text,
              })),
            }
          : undefined,
      },
      include: { translations: true },
    });
    this.logger.log(`현장 용어 생성 — ${created.id} (${dto.koTerm})`);
    return created;
  }
}
