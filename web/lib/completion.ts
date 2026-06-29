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

// North Star(§8-1): "검증 가능한 기술자 프로필" — 기본정보(이름·직군·연차·희망지역) +
// 경력 1건 이상 + 자격증/교육 1건 이상이 모두 충족된 상태.
export function isVerifiedProfile(s: ProfileState): boolean {
  const u = s.user;
  const basic = !!(u && u.name && u.jobType?.length && u.careerYears && u.region?.length);
  return basic && s.careerCards.length >= 1 && (s.certificates.length > 0 || s.educations.length > 0);
}
