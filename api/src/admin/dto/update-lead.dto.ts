import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeadStage, PaymentIntent } from '@prisma/client';

// BM 검증 CRM — 리드 단계·지불의향·후속액션 갱신
export class UpdateLeadDto {
  @IsOptional()
  @IsEnum(LeadStage)
  stage?: LeadStage;

  @IsOptional()
  @IsEnum(PaymentIntent)
  paymentIntent?: PaymentIntent;

  @IsOptional()
  @IsString()
  followUp?: string;
}
