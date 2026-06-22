import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateEventDto) {
    return this.prisma.analyticsEvent.create({
      data: {
        name: dto.name,
        userId: dto.userId,
        props: (dto.props ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  }
}
