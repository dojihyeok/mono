import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

// 알림 도메인. NotificationsService 를 export 해 AdminModule(공고 승인 시 매칭)이 주입해 쓴다.
@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
