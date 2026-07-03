import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateConsultRequestDto {
  @IsString()
  targetUserId!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  memo?: string;
}
