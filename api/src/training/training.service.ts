import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrainingDto } from './dto/create-training.dto';

// 교육 이수 도메인 — 사용자별 안전/직무/한국어 교육 기록. PDF §6-2.
@Injectable()
export class TrainingService {
  private readonly logger = new Logger(TrainingService.name);

  constructor(private readonly prisma: PrismaService) {}

  // 사용자 교육 이수 목록 — 최신순(이수일 기준).
  listByUser(userId: string) {
    return this.prisma.trainingRecord.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });
  }

  // 교육 이수 생성 — completedAt(ISO) → Date 변환.
  async create(userId: string, dto: CreateTrainingDto) {
    const created = await this.prisma.trainingRecord.create({
      data: {
        userId,
        kind: dto.kind,
        title: dto.title,
        provider: dto.provider,
        completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
        certUrl: dto.certUrl,
      },
    });
    this.logger.log(`교육 이수 생성 — ${created.id} (사용자 ${userId})`);
    return created;
  }

  // 삭제 — id+userId 소유권 스코프(deleteMany). count 반환.
  remove(userId: string, tid: string) {
    return this.prisma.trainingRecord.deleteMany({
      where: { id: tid, userId },
    });
  }
}
