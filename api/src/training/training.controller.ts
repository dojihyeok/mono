import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { TrainingService } from './training.service';
import { CreateTrainingDto } from './dto/create-training.dto';

// 전역 프리픽스 없음 — 절대경로 명시. 교육 이수(PDF §6-2).
@Controller()
export class TrainingController {
  constructor(private readonly training: TrainingService) {}

  // 사용자 교육 이수 목록.
  @Get('users/:id/training')
  listByUser(@Param('id') id: string) {
    return this.training.listByUser(id);
  }

  // 교육 이수 생성.
  @Post('users/:id/training')
  create(@Param('id') id: string, @Body() dto: CreateTrainingDto) {
    return this.training.create(id, dto);
  }

  // 교육 이수 삭제 — 소유권 스코프(userId).
  @Delete('users/:id/training/:tid')
  remove(@Param('id') id: string, @Param('tid') tid: string) {
    return this.training.remove(id, tid);
  }
}
