import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { DocumentKind, VisaDocStatus } from '@prisma/client';

// 서류 업로드 — dev-plan-foreign-workforce §6-3. 파일은 외부 스토리지 URL로 전달.
export class DocumentRecordDto {
  @IsEnum(DocumentKind)
  kind!: DocumentKind;

  @IsString()
  @MinLength(1)
  fileUrl!: string;

  @IsOptional()
  @IsEnum(VisaDocStatus)
  status?: VisaDocStatus;
}
