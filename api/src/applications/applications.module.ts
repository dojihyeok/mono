import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { CoworkersModule } from '../coworkers/coworkers.module';

// CoworkersModule 주입 — 배정(ACCEPTED) 시 같이 일한 동료 그래프 엣지 형성.
@Module({
  imports: [CoworkersModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
