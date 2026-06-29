import { IsOptional, IsString, MinLength } from 'class-validator';

// 관심 기술자 저장 (DB: SavedWorker, unique companyId+userId)
export class SaveWorkerDto {
  @IsString()
  @MinLength(1)
  userId!: string; // 저장할 기술자(User.id)

  @IsOptional()
  @IsString()
  memo?: string;
}
