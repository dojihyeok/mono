import { Module } from '@nestjs/common';
import { CoworkersController } from './coworkers.controller';
import { CoworkersService } from './coworkers.service';
import { NotificationsModule } from '../notifications/notifications.module';

// 함께 일한 동료(그래프) 도메인. CoworkersService 를 export 해
// ApplicationsModule(배정 시 엣지 형성)이 주입해 쓴다. 재호출 알림은 NotificationsService 재사용.
@Module({
  imports: [NotificationsModule],
  controllers: [CoworkersController],
  providers: [CoworkersService],
  exports: [CoworkersService],
})
export class CoworkersModule {}
