import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { CandidateType } from '@prisma/client';

// 작업요청 후보지정 — 캐노니컬 §3-2(8). status는 기본 RECOMMENDED(생성 시 받지 않음).
export class CreateCandidateDto {
  @IsEnum(CandidateType)
  candidateType!: CandidateType; // 수행기업/현장리더/작업팀

  @IsString()
  @MinLength(1)
  candidateId!: string; // 타입별 해석되는 대상 id

  @IsOptional()
  @IsNumber()
  score?: number; // 매칭/추천 점수

  @IsOptional()
  @IsString()
  memo?: string;
}
