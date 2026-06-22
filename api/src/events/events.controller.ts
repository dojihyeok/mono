import { Body, Controller, Post } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';

@Controller()
export class EventsController {
  constructor(private readonly events: EventsService) {}

  // 이벤트 로그 적재
  @Post('events')
  create(@Body() dto: CreateEventDto) {
    return this.events.create(dto);
  }
}
