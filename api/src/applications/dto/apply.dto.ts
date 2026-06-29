import { IsString, MinLength } from 'class-validator';

// 기술자 공고 지원 (DB: JobApplication, unique jobPostId+userId)
export class ApplyDto {
  @IsString()
  @MinLength(1)
  userId!: string; // 지원하는 기술자(User.id)
}
