import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { CommunityModule } from '../community/community.module';

@Module({
  imports: [NotificationsModule, CommunityModule], // 공고 승인(OPEN) 시 매칭 알림
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
