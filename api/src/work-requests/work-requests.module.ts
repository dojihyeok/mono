import { Module } from '@nestjs/common';
import { WorkRequestsController } from './work-requests.controller';
import { WorkRequestsService } from './work-requests.service';

// 현장작업요청 도메인 — dev-plan §4-2. PrismaModule(@Global) 사용.
@Module({
  controllers: [WorkRequestsController],
  providers: [WorkRequestsService],
  exports: [WorkRequestsService],
})
export class WorkRequestsModule {}
