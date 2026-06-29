import { Module } from '@nestjs/common';
import { GlossaryController } from './glossary.controller';
import { GlossaryService } from './glossary.service';

// 현장 용어 사전 도메인 — PDF §4. PrismaModule(@Global) 사용.
@Module({
  controllers: [GlossaryController],
  providers: [GlossaryService],
  exports: [GlossaryService],
})
export class GlossaryModule {}
