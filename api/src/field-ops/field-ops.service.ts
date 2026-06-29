import { Injectable, Logger } from '@nestjs/common';
import { Prisma, FieldOpsFeature } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFieldOpsInterestDto } from './dto/create-field-ops-interest.dto';
import { CreateAiLeaderInterestDto } from './dto/create-ai-leader-interest.dto';

// Field Ops 관심 도메인 (dev-plan §4-6). 7종 기능에 대한 수요 시딩·검증.
// props 는 Prisma Json 컬럼에 그대로 저장. 익명(userId 없음) 허용.
@Injectable()
export class FieldOpsService {
  private readonly logger = new Logger(FieldOpsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // 관심 등록 — 로그인/익명 모두 허용
  createInterest(dto: CreateFieldOpsInterestDto) {
    this.logger.log(
      `Field Ops 관심 등록 — feature=${dto.feature} userId=${dto.userId ?? 'anon'}`,
    );
    return this.prisma.fieldOpsInterest.create({
      data: {
        feature: dto.feature,
        userId: dto.userId,
        props: (dto.props ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  }

  // 관심 목록(최신순) — 관리/검증용. feature 로 선택 필터.
  listInterests(params: { feature?: FieldOpsFeature; limit?: number }) {
    return this.prisma.fieldOpsInterest.findMany({
      where: params.feature ? { feature: params.feature } : undefined,
      orderBy: { createdAt: 'desc' },
      take: params.limit ?? 100,
    });
  }

  // AI현장리더 관심 등록 — 로그인/익명 모두 허용. conditions/repeatPattern 은 Json 그대로.
  createAiLeaderInterest(dto: CreateAiLeaderInterestDto) {
    this.logger.log(
      `AI현장리더 관심 등록 — industry=${dto.industry ?? '-'} userId=${dto.userId ?? 'anon'}`,
    );
    return this.prisma.aiLeaderInterest.create({
      data: {
        userId: dto.userId,
        industry: dto.industry,
        conditions: (dto.conditions ?? undefined) as
          | Prisma.InputJsonValue
          | undefined,
        repeatPattern: (dto.repeatPattern ?? undefined) as
          | Prisma.InputJsonValue
          | undefined,
        candidateTeamIds: dto.candidateTeamIds ?? [],
      },
    });
  }

  // AI현장리더 관심 목록(최신순) — 관리/검증용.
  listAiLeaderInterests(params: { limit?: number }) {
    return this.prisma.aiLeaderInterest.findMany({
      orderBy: { createdAt: 'desc' },
      take: params.limit ?? 100,
    });
  }
}
