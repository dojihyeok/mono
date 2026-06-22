import { IsOptional, IsString, MinLength } from 'class-validator';

// 자격증 등록 (DB: Certificate)
export class CreateCertificateDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  licenseNo!: string; // 발급번호 — 필수

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsString()
  issuedAt?: string; // "YYYY-MM" 등 — 서비스에서 Date 변환
}
