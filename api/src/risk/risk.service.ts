import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRiskReportDto } from './dto/create-risk-report.dto';
import { QueryRiskReportDto } from './dto/query-risk-report.dto';
import { UpdateRiskStatusDto } from './dto/update-risk-status.dto';

// 리스크 신고 도메인 — 임금체불/안전사고/언어위험/괴롭힘. PDF §8-4.
@Injectable()
export class RiskService {
  private readonly logger = new Logger(RiskService.name);

  constructor(private readonly prisma: PrismaService) {}

  // 신고 생성 — status 기본 OPEN.
  async create(dto: CreateRiskReportDto) {
    const created = await this.prisma.riskReport.create({
      data: {
        reporterId: dto.reporterId,
        subjectId: dto.subjectId,
        kind: dto.kind,
        detail: dto.detail,
      },
    });
    this.logger.log(`리스크 신고 — ${created.id} (${dto.kind})`);
    return created;
  }

  // 목록 — status/kind 필터, 최신순.
  list(query: QueryRiskReportDto) {
    const where: Prisma.RiskReportWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.kind) where.kind = query.kind;

    return this.prisma.riskReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  // 상태 변경 — 없으면 404.
  async updateStatus(id: string, dto: UpdateRiskStatusDto) {
    const existing = await this.prisma.riskReport.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`RiskReport ${id} not found`);
    const updated = await this.prisma.riskReport.update({
      where: { id },
      data: { status: dto.status },
    });
    this.logger.log(`리스크 신고 상태 변경 — ${id} → ${dto.status}`);
    return updated;
  }
}
