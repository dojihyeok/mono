import { IsEnum } from 'class-validator';
import { InterestFeature } from '@prisma/client';

// 관심 기능 등록 (DB: InterestRegistration)
export class RegisterInterestDto {
  @IsEnum(InterestFeature)
  feature!: InterestFeature;
}
