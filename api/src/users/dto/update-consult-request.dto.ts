import { IsEnum } from 'class-validator';
import { ConsultStatus } from '@prisma/client';

export class UpdateConsultRequestDto {
  @IsEnum(ConsultStatus)
  status!: ConsultStatus;
}
