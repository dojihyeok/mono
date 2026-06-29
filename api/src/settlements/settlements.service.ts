import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { QuerySettlementDto } from './dto/query-settlement.dto';

// 정산 도메인 — 기술자/기업 정산 명세 + 항목. PDF §7.
@Injectable()
export class SettlementsService {
  private readonly logger = new Logger(SettlementsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // 정산 생성 — items nested create. status는 기본 DRAFT.
  async create(dto: CreateSettlementDto) {
    const created = await this.prisma.settlement.create({
      data: {
        workerId: dto.workerId,
        companyId: dto.companyId,
        workRequestId: dto.workRequestId,
        period: dto.period,
        items: {
          create: dto.items.map((i) => ({
            kind: i.kind,
            amount: i.amount,
            note: i.note,
          })),
        },
      },
      include: { items: true },
    });
    this.logger.log(`정산 생성 — ${created.id} (기술자 ${dto.workerId})`);
    return created;
  }

  // 목록 — workerId/companyId 필터, items include, 최신순.
  list(query: QuerySettlementDto) {
    const where: Prisma.SettlementWhereInput = {};
    if (query.workerId) where.workerId = query.workerId;
    if (query.companyId) where.companyId = query.companyId;

    return this.prisma.settlement.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 단건 상세(items include) — 없으면 404.
  async getOne(id: string) {
    const settlement = await this.prisma.settlement.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!settlement) throw new NotFoundException(`Settlement ${id} not found`);
    return settlement;
  }

  // 이의제기 — status=DISPUTED.
  async dispute(id: string) {
    await this.getOne(id); // 존재 검증(404)
    const updated = await this.prisma.settlement.update({
      where: { id },
      data: { status: 'DISPUTED' },
      include: { items: true },
    });
    this.logger.log(`정산 이의제기 — ${id}`);
    return updated;
  }
}
