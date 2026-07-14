// 사용자 앱(/mono)을 제외한 전체 사이트 접근 시 요구하는 공용 비밀번호 게이트.
// 실제 계정 인증이 아니라 미공개 페이지(전략/BM/데이터룸/파트너 등) 노출을
// 막기 위한 단순 게이트 — 위협 모델이 가벼워 해시 없이 상수 비교로 충분하다.
export const SITE_GATE_COOKIE = 'mono_site_gate';
export const SITE_GATE_PASSWORD = process.env.SITE_GATE_PASSWORD || 't-rive';
export const SITE_GATE_GRANTED_VALUE = 'granted';
