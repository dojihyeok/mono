import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { CareerBand, IndustryType, Residency } from '@prisma/client';

// 기본 프로필: 이름(선택) + 유형(선택, 자가선택 가능 4종) + 직종(선택) + 경력구간(선택) + 희망지역(복수)
// role 자가선택: WORKER/CUSTOMER/PROJECT_OPERATOR/PERFORMER_COMPANY — FIELD_LEADER 만 관리자 승인(자가승격 차단).
export class BasicProfileDto {
  // 온보딩에서 진짜 이름 입력 — 로그인 시 임시로 들어간 아이디를 덮어씀
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  // 유형 — 자가선택 가능 4종(캐노니컬 §5.1, 운영자·수행기업 확장 단계). 미전달 시 기존 role 유지.
  @IsOptional()
  @IsIn(['WORKER', 'CUSTOMER', 'PROJECT_OPERATOR', 'PERFORMER_COMPANY'])
  role?: 'WORKER' | 'CUSTOMER' | 'PROJECT_OPERATOR' | 'PERFORMER_COMPANY';

  // 직군 — WORKER 경로만 입력(CUSTOMER 는 직군 없음). 전달 시 1개 이상.
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  jobType?: string[];

  // 경력구간 미선택 가능 — 미선택 시 직종/희망지역만 갱신(미설정 유지)
  @IsOptional()
  @IsEnum(CareerBand)
  careerYears?: CareerBand;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  region!: string[];

  // 온보딩 산업유형(복수) — 캐노니컬 §0-3. 미선택 가능(미전달 시 미갱신).
  @IsOptional()
  @IsArray()
  @IsEnum(IndustryType, { each: true })
  industries?: IndustryType[];

  // 내국인/외국인(WORKER 온보딩) — 전달 시 WorkerProfile.residency 로 영속. 외국인 분류 신호.
  @IsOptional()
  @IsEnum(Residency)
  residency?: Residency;
}
