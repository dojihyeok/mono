import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule], // 공고 승인(OPEN) 시 매칭 알림
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
