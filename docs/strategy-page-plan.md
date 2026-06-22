# MONO 전략(IR) 페이지 개선 계획

> 출처: 내부 기획 문서 "MONO 전략 페이지 개발 개선 계획서".
> 전략 페이지는 서비스 소개·오디션 전략·GTM·BM·Next MONO 비전을 한 페이지에 담는 **전략 허브**입니다.

## 1. 개선 방향

정보량이 많아지므로 **본문은 핵심 메시지·성장 흐름** 중심으로 유지하고,
**상세 분석은 팝업 모달**로 분리하여 심사자·투자자·파트너가 필요한 깊이만 선택적으로 확인하도록 합니다.

## 2. 정보 구조

권장 전체 구조:

```
Hero
01 MONO 서비스 소개
02 MONO가 만들고 싶은 변화
03 모두의 창업 오디션 전략 (1R·2R·3R)
04 MONO 단계별 성장 전략
05 MONO 비즈니스 모델 (Core/Growth/Partnership/Future BM)
06 Deep Dive · 상세 분석   ← 신설
07 MONO 브랜드 철학 (T-Rive, Tech-Blue)
08 Next MONO (Industrial Intelligence)
Built by T-Rive
CTA
```

본문 섹션은 간결히 유지하고, 상세 데이터는 아래 Deep Dive로 분리합니다.

## 3. Deep Dive 섹션 (신설)

섹션 설명: "MONO의 핵심 전략은 본문에서 간결하게 확인할 수 있습니다.
경쟁사 분석, 기업가치 시뮬레이션, 장기 기술 비전, 규제 리스크, 투자 전략은 상세 보기에서 확인할 수 있습니다."

| # | 카드 제목 | 설명 | category |
| --- | --- | --- | --- |
| 1 | 경쟁사 분석 | 국내외 유사 솔루션 대비 MONO 데이터 구조 차별성 | Market |
| 2 | 기업가치 시뮬레이션 | 한국 평균 기준 단계별 기업가치 가정 | Investment |
| 3 | MONO Gear 상세 | 공구·장비 쉐어 네트워크 BM과 리스크 | Business Model |
| 4 | 2라운드 검증 지표 | 핵심 성장 지표, Aha Moment, Retention, Fake Door | Validation |
| 5 | 규제 리스크 상세 | 직업소개·파견·정산·보험·중장비·외국인 검토 | Risk |
| 6 | 장기 기술 비전 | Tech-Blue → AGI Core OS Device 미래 비전 | Future |
| 7 | 투자 유치 전략 | VC, 금융권 SI, 산업계 SI, 공공 협력 | IR |

## 4. 팝업 모달 공통 UX

기본 구조: `[모달 제목] → 요약 2~3문장 → 핵심 표/도식 → 해석 문장 → 전제/주의 문구 → 닫기`

| 항목 | 권장 기준 |
| --- | --- |
| Desktop 너비 | 720~960px |
| Mobile | Full-screen modal |
| 배경 | 반투명 딤 처리 |
| 높이 | 내부 스크롤 허용 (본문 1~2스크롤 이내) |
| 닫기 | X 버튼, ESC, 바깥 클릭 |
| 접근성 | focus trap, aria-label, 키보드 접근, body scroll lock |
| 색상 | 네이비, 블루, 시안 |
| 표 스타일 | 헤더 고정 또는 카드형 테이블 |

## 5. 팝업별 콘텐츠 (요약)

### 5-1. 경쟁사 분석
비교군: 커리어 네트워크(LinkedIn) / 현장 SaaS(Procore, ServiceTitan) /
산업 인력 플랫폼(Workrise) / 국내 인력(가다) / 장비 렌탈(일반 렌탈사) → **MONO**.
하단 메시지: "MONO의 차별성은 기능 수가 아니라 **데이터 구조**에 있습니다."

### 5-2. 기업가치 시뮬레이션 (한국 평균 기준 가정)

| 단계 | 주요 조건 | 예상 기업가치 |
| --- | --- | --- |
| MVP / 2R | 기술자·기업 수요 검증 | 10억~30억 |
| Seed | MVP, 인터뷰, PoC 후보 | 50억~120억 |
| Pre-A | 유료 PoC, 초기 ARR | 100억~250억 |
| Series A | B2B SaaS 매출 검증 | 200억~600억 |
| Series B | 전국 확장, SI 논의 | 700억~2,000억 |
| Series C | 산업 인프라 플랫폼화 | 2,000억~5,000억 |
| 상방 | 대기업/금융권 SI, 공공 실증 | 5,000억~1조+ |

> 주의: 투자 검토용 가정이며 실제 가치는 매출·성장률·유지율·시장상황·SI·규제대응에 따라 달라짐.

### 5-3. MONO Gear
가정용/전문 시공 공구·기업용 장비·중장비를 적시 연결. 기술자 직군·경력·자격·안전교육 기반 매칭.
수익원: 공구 대여, 전문 장비 렌탈, 기업 장비 구독, 중장비 연결, 장비+기술자 패키지, 보험·보증, 정비·점검, 장비 금융.
리스크: 파손/분실/안전사고/중장비 규제/물류·회수 → 보증금·보험·자격확인·패키지운영·거점화로 대응.

### 5-4. 2라운드 검증 지표 (목표치)
기술자 인터뷰 50명+ / 기업 인터뷰 20~30개사 / 기본 프로필 완성률 40%+ /
경력 1건 30%+ / 경력 3건 15%+ / 공유율 10%+ / 7일 재방문 15~25% /
기업 관심저장 조회 중 20%+ / 장비 관심 클릭 5~15% / PoC 관심 3~5개사.
> 목표는 가입자 수 경쟁이 아니라 **실제 행동 데이터 확보**.

### 5-5. 규제 리스크
직업소개사업 / 근로자파견 / 정산·에스크로 / 보험 / 중장비 / 외국인 근로자 / 개인정보 —
각각 등록·제휴·구조분리·자문·동의/감사 로그로 대응. 초기 MVP는 **수요 검증 범위**에서 운영.

### 5-6. 장기 기술 비전 (AGI Core OS Device)
데이터 입력(센서·작업기록·경력·장비이력·안전) → Tech-Blue 데이터 → AGI Core OS Device →
연결 대상(휴먼 로봇·중장비·스마트 공구·3D 프린터). **현재 MVP 범위 아님, 장기 비전으로 별도 관리.**

### 5-7. 투자 유치 전략
VC / 금융권 SI / 산업계 SI / 공공·정책 자금 / 전략적 엔젤 — 유형별 투자 논리 정리.

## 6. 개발 구현 계획

### 6-1. 컴포넌트 구조
```
components/
  DeepDiveSection.tsx
  DeepDiveCard.tsx
  DeepDiveModal.tsx
  ModalTable.tsx
  ModalBadge.tsx
  ModalWarning.tsx
```

### 6-2. 데이터 구조
```ts
export const deepDiveItems = [
  { id: "competitor",    title: "경쟁사 분석",        summary: "국내외 유사 솔루션 대비 MONO의 데이터 구조 차별성", buttonText: "상세 보기", modalTitle: "국내외 유사 솔루션 대비 MONO의 차별성", category: "Market" },
  { id: "valuation",     title: "기업가치 시뮬레이션", summary: "한국 평균 기준 성장 단계별 기업가치 가정",          buttonText: "상세 보기", modalTitle: "성장 단계별 기업가치 시뮬레이션",        category: "Investment" },
  { id: "mono-gear",     title: "MONO Gear 상세",     summary: "공구·장비 쉐어 네트워크 BM과 리스크",              buttonText: "상세 보기", modalTitle: "MONO Gear · 공구·장비 쉐어 네트워크",     category: "Business Model" },
  { id: "round2-metrics",title: "2라운드 검증 지표",   summary: "핵심 성장 지표, Aha Moment, Retention, Fake Door", buttonText: "상세 보기", modalTitle: "2라운드 데이터 기반 시장 검증 지표",      category: "Validation" },
  { id: "regulation",    title: "규제 리스크 상세",    summary: "직업소개, 파견, 정산, 보험, 중장비, 외국인 근로자 검토", buttonText: "상세 보기", modalTitle: "규제 리스크 및 단계별 대응 전략",        category: "Risk" },
  { id: "agi-vision",    title: "장기 기술 비전",      summary: "Tech-Blue 데이터에서 AGI Core OS Device로 확장",   buttonText: "상세 보기", modalTitle: "AGI Core OS Device 장기 비전",          category: "Future" },
  { id: "investment",    title: "투자 유치 전략",      summary: "VC, 금융권 SI, 산업계 SI, 공공 협력 전략",          buttonText: "상세 보기", modalTitle: "투자 유치 및 전략적 파트너십 구조",      category: "IR" },
];
```

### 6-3. 라우팅 / 상태
URL 파라미터 지원 권장 → 특정 팝업 외부 공유 가능 (`/strategy?deepdive=competitor`).
```ts
const [activeModal, setActiveModal] = useState<string | null>(null);
// 또는 URL 기반
const searchParams = useSearchParams();
const activeModal = searchParams.get("deepdive");
```

### 6-4. 접근성
Tab 이동 / ESC 닫기 / 바깥 클릭 닫기 / focus trap / aria-label(모달 제목 연결) / body scroll lock / Mobile full-screen.

## 7. 디자인 가이드

- **카드**: 배경 White·Ivory, border light gray, radius 16~24px, 약한 그림자, line icon, title bold navy, summary 2줄 이하, button navy/cyan.
- **모달**: header(제목+카테고리 배지) → body(요약→표→해석→주의) → footer(닫기). 표는 모바일에서 카드형 전환. 투자/미래비전/규제 문구는 강조 박스. Width 720~960px, Mobile full-screen.
