import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { QueryReferralDto } from './dto/query-referral.dto';

// 행정·노무 파트너 연계 큐 — 비자/노무/정산/교육/보험 매칭. PDF §2·§6.
@Injectable()
export class ReferralsService {
  private readonly logger = new Logger(ReferralsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // 연계 요청 생성 — status 기본 REQUESTED.
  async create(dto: CreateReferralDto) {
    const created = await this.prisma.partnerReferral.create({
      data: {
        requesterId: dto.requesterId,
        kind: dto.kind,
        note: dto.note,
      },
    });
    this.logger.log(
      `파트너 연계 요청 — ${created.id} (${dto.kind} / 요청자 ${dto.requesterId})`,
    );
    return created;
  }

  // 목록 — status/kind 필터, 최신순.
  list(query: QueryReferralDto) {
    const where: Prisma.PartnerReferralWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.kind) where.kind = query.kind;

    return this.prisma.partnerReferral.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
