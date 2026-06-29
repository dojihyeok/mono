import { IsOptional, IsString } from 'class-validator';

// 출근 체크인 — workDate 미지정 시 서버 오늘 날짜 사용
export class CheckInDto {
  @IsOptional()
  @IsString()
  workDate?: string; // YYYY-MM-DD
}
