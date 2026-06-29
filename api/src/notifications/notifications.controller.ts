import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SaveSubscriptionDto } from './dto/save-subscription.dto';

// 알림 BFF(/api/users/:id/notifications, /api/notifications/:id/read, /api/push/*) → 이 컨트롤러.
@Controller()
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  // 미읽음 수 — :id/notifications 보다 먼저(별도 세그먼트라 충돌은 없음)
  @Get('users/:id/notifications/unread-count')
  unreadCount(@Param('id') id: string) {
    return this.notifications.unreadCount(id);
  }

  @Get('users/:id/notifications')
  list(@Param('id') id: string) {
    return this.notifications.list(id);
  }

  @Post('users/:id/notifications/read-all')
  readAll(@Param('id') id: string) {
    return this.notifications.markAllRead(id);
  }

  @Patch('notifications/:nid/read')
  markRead(@Param('nid') nid: string) {
    return this.notifications.markRead(nid);
  }

  // 웹푸시 공개키(VAPID) — 클라이언트 구독에 필요
  @Get('push/vapid-public-key')
  vapidKey() {
    return this.notifications.vapidPublicKey();
  }

  @Post('users/:id/push-subscription')
  subscribe(@Param('id') id: string, @Body() dto: SaveSubscriptionDto) {
    return this.notifications.saveSubscription(id, {
      endpoint: dto.endpoint,
      p256dh: dto.keys.p256dh,
      auth: dto.keys.auth,
    });
  }

  @Delete('users/:id/push-subscription')
  unsubscribe(@Body() body: { endpoint?: string }) {
    return this.notifications.removeSubscription(body?.endpoint ?? '');
  }
}
