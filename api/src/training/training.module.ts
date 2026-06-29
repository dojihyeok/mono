import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';

// 교육 이수 도메인 — PDF §6-2. PrismaModule(@Global) 사용.
@Module({
  controllers: [TrainingController],
  providers: [TrainingService],
  exports: [TrainingService],
})
export class TrainingModule {}
