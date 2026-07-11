import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

// 외부 카페/밴드 크롤링 공고 등록 (DB: JobPost, 초기 status PENDING=승인 대기)
export class CreateCrawledJobPostDto {
  @IsString()
  @MinLength(1)
  title!: string; // 공고 제목

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  jobType!: string[]; // 필요 직군(복수, 추출 실패 시 ["기타"])

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  region!: string[]; // 현장 지역(복수, 원문 텍스트 그대로)

  @IsOptional()
  @IsString()
  period?: string; // 근무 기간

  @IsOptional()
  @IsString()
  conditions?: string; // 근무 조건(일당 등)

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsIn(['CRAWLED_CAFE', 'CRAWLED_BAND'])
  source!: 'CRAWLED_CAFE' | 'CRAWLED_BAND';

  @IsString()
  @MinLength(1)
  sourceUrl!: string; // 원문 게시글 URL(중복 수집 방지 키)

  @IsString()
  @MinLength(1)
  sourceRawText!: string; // 원문 텍스트(관리자 검수용)

  @IsOptional()
  @IsDateString()
  sourcePostedAt?: string; // 원문 게시 일시

  @IsString()
  @MinLength(1)
  posterName!: string; // 원문 작성자/업체명 → 가상 Company.name

  @IsOptional()
  @IsString()
  posterPhone?: string; // 원문에서 추출한 연락처 → 가상 Company.contactPhone
}
