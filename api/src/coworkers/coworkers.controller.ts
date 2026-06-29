import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CoworkersService } from './coworkers.service';
import { RecallDto } from './dto/recall.dto';

// 전역 프리픽스 없음 — 다른 컨트롤러와 동일 규약.
@Controller()
export class CoworkersController {
  constructor(private readonly coworkers: CoworkersService) {}

  // 내 동료 목록(함께 일한 사람) — "함께 일한 동료" 섹션용
  @Get('users/:id/coworkers')
  list(@Param('id') id: string) {
    return this.coworkers.getCoworkers(id);
  }

  // 동료 재호출 — 함께 일한 동료에게 "함께 일하자" 알림
  @Post('users/:id/recall')
  recall(@Param('id') id: string, @Body() dto: RecallDto) {
    return this.coworkers.recall(id, dto.coworkerId);
  }
}
