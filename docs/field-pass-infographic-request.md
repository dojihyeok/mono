# /field-pass 인포그래픽 개편 개발 요청서

> 참고 코드: [`web/public/field-pass/mono-field-pass-infographics.html`](../web/public/field-pass/mono-field-pass-infographics.html) — 6개 인포그래픽 전체가 담긴 단일 HTML 파일. 브라우저에서 바로 열어 확인 가능.
>
> **2026-07-14 개정**: 인포그래픽 구현 방식을 SVG에서 순수 HTML(div + flex) 기반 플랫 박스·화살표 스타일로 변경했다 — 안정성과 유지보수 편의를 우선. 아래 "SVG 인포그래픽 6종" 절의 시각적 세부 사항은 이 개정으로 대체되었고, 삭제·변경 항목·페이지 순서·완료 기준은 그대로 유효하다.

## 배경

현재 `/field-pass`는 성장 흐름·기존 전자카드 비교·OTAC PoC·권한 구조·데이터 루프·아키텍처·확장 로드맵이 모두 들어가 있지만, 비슷한 흐름이 여러 번 반복되고 PoC 중심 문구가 전체 비전보다 크게 보인다. 세로 텍스트 카드가 많아 핵심 구조를 한눈에 이해하기 어렵다.

핵심 방향은 인포그래픽 한 장에 모든 내용을 넣는 방식이 아니라, **각 설명 섹션에 해당하는 SVG 인포그래픽을 1:1로 매핑**하는 것이다.

## 1. SVG 인포그래픽 6종

첨부한 `mono-field-pass-infographics.html`에는 아래 6개의 인라인 SVG가 포함되어 있다.

1. Growth Journey — 일용직→교육→준비완료→조공 경험→건설근로자 프로필→Field Pass
2. Global Credential Landscape — 전자 인력카드(북유럽)·모바일 출입 자격증명·디지털 자격 패스포트 → MONO Field Pass
3. OTAC Mobile Authentication Flow — MONO 앱→OTAC→현장 검증→출입 승인→출근 기록→데이터 연결
4. Permission Architecture — Identity→Credential→Access→Permission→Equipment→Industrial OT
5. MONO Data Loop — 출입·출근→작업·공수→받을 금액→경력·신뢰의 순환 구조
6. Expansion Roadmap — 건설 현장→Field Pass→아파트·주거→오피스·시설→중장비·차량→OT·산업 설비

React 적용 시 각 `<svg>` 블록을 독립 컴포넌트로 분리하고, HTML/SVG 속성을 JSX 표기로 변환한다.

| HTML 속성 | JSX 속성 |
| --- | --- |
| `class` | `className` |
| `stroke-width` | `strokeWidth` |
| `font-size` | `fontSize` |
| `text-anchor` | `textAnchor` |
| `marker-end` | `markerEnd` |
| `flood-color` | `floodColor` |
| `flood-opacity` | `floodOpacity` |
| `stop-color` | `stopColor` |

## 2. 삭제·변경할 항목

| # | 대상 | 문제 | 조치 |
| --- | --- | --- | --- |
| 1 | Why MONO 섹션의 긴 다단계 타임라인 | 성장·인증·출입·권한이 한 줄에 모두 포함되어 뒤 섹션과 반복 | 섹션 제거, Growth Journey SVG로 대체 |
| 2 | Hero 하단 STEP 버튼형 나열 | 아래 각 섹션과 동일한 내용을 다시 나열 | 성장 여정·글로벌 사례·모바일 인증·권한 구조·확장 로드맵 5개 앵커 내비게이션으로 축소 |
| 3 | Growth Journey의 텍스트 칩 흐름 | Why MONO 타임라인과 중복 | Growth Journey SVG 1개만 배치 |
| 4 | Legacy vs MONO의 도식 | 기존 시스템 역할이 과도하게 단순하게 보임 | 기존 전자카드(본인 확인→카드 발급→출입·출근 기록) vs MONO(교육·자격·경력→모바일·카드 인증→출입·근무 기록→현장 권한→장비·OT 권한) 비교로 재작성 |
| 5 | OTAC 섹션의 PoC 목표·최소 기능 표 | 내부 개발 백로그처럼 보임 | 공개 페이지에서 제거, 상세 스펙은 `/field-pass/otac` 또는 별도 데이터룸 문서로 이동 |
| 6 | "PoC로 가장 차별성 있는 기능부터 검증합니다" 문구 | PoC가 페이지의 최종 목적처럼 보임 | "센스톤과 함께 산업 현장의 새로운 인증 구조를 설계합니다"로 교체 |
| 7 | Architecture 섹션의 8단계 세로 목록(Digital Identity Evolution) | Permission·Data Loop·Expansion과 상당 부분 중복 | 섹션 제거 — Permission Architecture SVG가 동일한 인증 계층을 이미 표현 |
| 8 | 기술 상세 아키텍처의 다컬럼 텍스트 목록(System Architecture) | 텍스트가 과도하고 기능 목록처럼 보임 | 섹션 제거, 상세 내용은 별도 기술 문서로 이동 |
| 9 | 확장 로드맵의 산업군 나열(반도체·조선·플랜트·아파트·오피스·공장·헬스케어·캠퍼스·스마트시티) | 산업군 나열과 제품 확장 단계가 섞여 있음 | Expansion Roadmap SVG(건설 현장→Field Pass→아파트·주거→오피스·시설→중장비·차량→OT·산업 설비)로 대체, 반도체·조선·플랜트는 하단 적용 산업 태그로 이동 |
| 10 | Business Model의 다항목 표 | 초기/확장 구분 없이 나열되어 우선순위가 안 보임 | 초기 검증(Field Pass 현장 구독·출입 출근 리포트·인증 시스템 연동)과 확장(장비 권한 API·OT 접근 권한·아파트 오피스 SaaS·카드 금융 제휴) 두 그룹으로 압축 |

## 3. 핵심 문구 변경

**Hero**
- 제목: "현장 근무자의 성장 기록이 출입과 장비 권한이 됩니다"
- 설명: "MONO Field Pass는 교육, 자격, 현장 경험과 근무 기록을 기반으로 사용자의 출입 권한을 확인하고, 장비·차량·OT 시스템의 사용 승인으로 확장하는 산업 현장 인증 플랫폼입니다."

**센스톤 협력**
- 제목: "MONO의 현장 데이터와 센스톤의 인증 기술을 연결합니다"
- 메시지: "MONO는 현장 근무자의 성장·교육·자격·경력 데이터를 구축합니다. 센스톤과 함께 모바일 인증, 저전력 인증, 출입 권한, 장비·OT 사용 승인으로 이어지는 글로벌 확장형 인증 구조를 설계하고자 합니다."

## 4. 최종 페이지 순서

1. Hero
2. 현장 근무자 성장 여정 — Growth Journey SVG
3. 기존 전자카드와 MONO Field Pass 비교
4. 글로벌 현장 인증 사례 — Global Landscape SVG
5. 모바일·저전력 인증 구조 — OTAC Flow SVG
6. 출입·장비·OT 권한 구조 — Permission Architecture SVG
7. MONO 데이터 선순환 — Data Loop SVG
8. 확장 로드맵 — Expansion Roadmap SVG
9. MONO × 센스톤 공동 제안
10. 수익모델
11. 기술 협력 CTA

## 5. 개발 완료 기준

- [ ] 기존 인포그래픽 컴포넌트와 새 SVG가 동시에 노출되지 않는다.
- [ ] 각 설명 섹션과 SVG가 1:1로 연결된다.
- [ ] 모바일에서는 SVG 컨테이너만 가로 스크롤되고, 본문 전체에는 가로 스크롤이 생기지 않는다.
- [ ] SVG 내부 한글이 깨지지 않는다.
- [ ] 글로벌 사례에는 공식 출처 확인이 필요하다는 점을 별도 표기한다(출처 URL은 반영 전 검증).
- [ ] 센스톤 협력은 공동 제안·기술 협의 문구로 표시하고, 확정 제휴 표현을 쓰지 않는다.
- [ ] PoC가 페이지 전체의 최종 목적처럼 보이지 않는다.
- [ ] 장비·OT 기능은 "사용 승인 및 시스템 연동"으로 표현한다(직접 제어가 아님).
- [ ] "정산"은 "받을 금액"으로, "더 높은 급여"는 "더 나은 처우"로 표현한다.
- [ ] 모바일 최소 글자 크기는 14px 이상 유지한다.
- [ ] 모든 SVG에 `title`/`desc`/`aria-labelledby`가 포함된다.
- [ ] `/field-pass/otac` 연결은 유지한다.

## 6. 반영 상태

- 2026-07-14: 위 항목을 `web/app/field-pass/` 코드에 직접 반영 완료(SVG 6종 교체, 삭제 대상 섹션 제거, 문구 교체, 페이지 순서 재정렬). 상세는 `git log web/app/field-pass/`에서 확인.
- 2026-07-15: Why MONO 섹션과 Growth Journey 섹션이 같은 성장 흐름을 반복 노출하는 문제를 발견 — 아래 7절 "Why MONO 통합 요청"으로 대체 반영.

## 7. Why MONO 통합 요청 (개정 — 재해석 방지용 확정 스펙)

### 7.1 최종 목표 (한 문장 고정)

> 성장 흐름과 인증·권한 흐름을 하나의 React + SVG 인포그래픽으로 통합하고, 기존 중복 인포그래픽과 저해상도 이미지는 제거한다.

### 7.2 삭제 대상 (명확화)

1. 상단 "왜 MONO가 Field Pass를 만드는가" 기존 타임라인 (`WhyMonoInfographic`, chip 기반 `Timeline` 컴포넌트)
2. 하단 저해상도 참고 이미지 (`ZoomableImage` → `public/field-pass/panel-01-why-mono.png`)
3. 동일한 성장 흐름을 반복하는 카드와 설명 (VC용/센스톤용 중복 메시지 카드, 별도 Growth Journey 섹션)

### 7.3 신규 컴포넌트 이름 (고정)

```text
web/app/field-pass/UnifiedFieldPassFlow.tsx
```

> 원 요청은 `components/field-pass/UnifiedFieldPassFlow.tsx`였으나, 이 프로젝트는 `/field-pass` 관련 컴포넌트를 전부 `web/app/field-pass/`에 co-locate하는 기존 컨벤션을 쓰고 있어(`InfographicsKit.tsx`, `svgKit.tsx` 등) 같은 규칙을 적용했다. 파일 위치만 다르고 컴포넌트 이름(export)은 `UnifiedFieldPassFlow`로 요청대로 고정했다.

### 7.4 배치 위치 (고정)

```text
Hero
→ 문제 정의 (id="problem")
→ UnifiedFieldPassFlow (id="why")
→ 기존 전자카드 비교 (id="concept")
```

### 7.5 통합 인포그래픽 구성

**상단 성장 흐름**: 일용직 → 필수 교육 → 준비 완료 → 조공 경험 → 건설근로자 → **MONO Field Pass**(강조)

**하단 인증·권한 흐름**: MONO App Pass → 현장 출입 → 출근 기록 → 경력 반영 → 신뢰 프로필 → **권한 확장**(강조)

**하단 핵심 문구**: "일한 기록이 경력이 되고, 경력이 Field Pass가 되며, Field Pass가 현장 권한으로 이어집니다."

### 7.6 구현 방식

- React + 인라인 SVG, 한글은 실제 `<text>` 요소로 렌더링 (이미지 텍스트 금지)
- 데스크톱(1200px 이상): 가로 2단 구조 — 실제 `<svg viewBox>` 렌더링
- 모바일(767px 이하): 세로 카드형 — **CSS 미디어쿼리로 전환되는 별도 DOM**(가로 스크롤 SVG 축소가 아니라 진짜 세로 스택)
- 벡터(SVG) 기반이라 브라우저 확대 200%에서도 선명
- 본문 전체 가로 스크롤 없음 (SVG 컨테이너만 필요 시 개별 스크롤)
- 모든 SVG에 `<title>`/`<desc>`/`aria-labelledby` 포함

### 7.7 완료 기준 (수치화)

- [x] 성장 흐름 인포그래픽이 페이지에 1개만 존재한다 (`UnifiedFieldPassFlow` 단일 컴포넌트).
- [x] 저해상도 PNG(`panel-01-why-mono.png`)가 페이지에서 제거된다.
- [x] 중복 카드·설명(VC/센스톤 메시지 카드, 별도 Growth Journey 섹션)이 제거된다.
- [x] 데스크톱 1200px 이상에서 가로 2단 구조가 적용된다.
- [x] 모바일 767px 이하에서 세로 카드 구조가 적용된다.
- [x] SVG 내부 한글이 실제 `<text>` 요소로 렌더링된다.
- [x] 모든 SVG에 `title`/`desc`/`aria-labelledby`가 포함된다.

> 2026-07-15 기준 위 항목 전부 구현·검증 완료 (`tsc --noEmit` 통과, 개발 서버 렌더링 확인).
