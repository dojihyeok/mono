import type { ProfileState } from "./types";

// 프로필 완성도 0~100% (PDF 11-4).
// 기본프로필 40 + 경력카드(1건 20, 2건 +10, 3건 +10) + 자격/교육 20.
export function computeCompletion(s: ProfileState): number {
  let score = 0;
  const u = s.user;
  if (u && u.name && u.jobType?.length && u.careerYears && u.region?.length) score += 40;
  const careers = s.careerCards.length;
  if (careers >= 1) score += 20;
  if (careers >= 2) score += 10;
  if (careers >= 3) score += 10;
  if (s.certificates.length > 0 || s.educations.length > 0) score += 20;
  return Math.min(100, score);
}
