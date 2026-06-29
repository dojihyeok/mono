import { Module } from '@nestjs/common';
import { RiskController } from './risk.controller';
import { RiskService } from './risk.service';

// 리스크 신고 도메인 — PDF §8-4. PrismaModule(@Global) 사용.
@Module({
  controllers: [RiskController],
  providers: [RiskService],
  exports: [RiskService],
})
export class RiskModule {}
