# MONO TODO / 백로그

> 착수 전 작업 적재. 합의된 설계·미결정 사항을 함께 기록해 나중에 바로 시작할 수 있게 한다.

---

## 🔔 알림 기능 — 매칭 기반 + 인앱 알림센터 + 푸시 *(✅ 구현 완료 · 2026-06-23)*

**구현됨**: ① 인앱 알림센터(`/mono` 상단 🔔+미읽음 뱃지+패널, ESC·scroll-lock·focus) · ② 매칭 엔진(공고 OPEN 승인 시 직군∩·지역∩·경력≥ 매칭 유저에게 `Notification` 생성, 일괄 dedup·멱등, E2E 검증) · ③ 웹푸시(VAPID·서비스워커·구독·전송 배선).
**남은 것**: 푸시 실전송은 브라우저에서 알림 권한 허용 필요(특히 iOS는 홈화면 추가 PWA만). 운영 배포 시 VAPID 키를 시크릿으로 주입. 종은 현재 홈 헤더에만(추후 글로벌 헤더 승격 권고). 경력카드 텍스트 기반 "비슷한 곳" 매칭은 후속 확장.

**원하는 동작**: 사용자가 **일했던 곳(경력카드) 기반 비슷한 공고**, 또는 **요건이 맞는 공고**가 새로 뜨면 알림. 웹은 상단 종 + 알림창, 폰은 푸시.

### 매칭 신호 (확인됨)
- **프로필(정형)**: `User.jobType ∩ 공고.jobType` · `User.region ∩ 공고.region` · `User.careerYears ≥ 공고.careerBand`
- **경력카드("일했던 곳")**: `CareerCard.field`(작업분야)·`siteName`(현장명) → 공고 제목/직군과 텍스트 유사 = "비슷한 공고"
- **요건 충족**: 공고의 `careerBand`·`certs`·`region`을 사용자가 만족하는지

### 3겹 구조
1. **인앱 알림센터** — `/mono` 상단 **종 아이콘 + 미읽음 뱃지** → 클릭 시 알림 패널에 적재. 항목 클릭 → 기구현된 **공고 상세 시트** 재사용. `track("notification_clicked")` 발화(이벤트명 이미 존재).
2. **매칭 엔진** — 공고가 OPEN될 때(또는 배치)로 사용자별 매칭 점수 계산 → 임계 이상이면 `Notification` 적재.
   - 모델 추가: `Notification(id, userId, type, jobPostId?, title, body, read:Boolean, createdAt)`
3. **푸시 전달(단계적)**
   - **1단계(지금 권장)**: 인앱 알림센터 + 매칭 → 웹·모바일웹 **어디서나** 동작, 푸시 복잡도 0
   - **2단계**: PWA 웹푸시(VAPID + Service Worker) → 앱 닫혀도 알림. **Android 설치형 PWA · iOS 16.4+ 홈화면추가 PWA만**(iOS 일반 사파리 탭 ❌). 모델 추가: `PushSubscription(endpoint, keys, userId)`
   - **3단계**: 네이티브/하이브리드 래퍼(Capacitor/RN + FCM/APNs) → **완전한 폰 푸시(iOS 포함 안정적)**

### 현재 상태
- 미구현. 스텁만 존재: MonoApp 주석 처리된 '알림·설정' 메뉴, 발화 안 되는 이벤트명 `notification_clicked`.

### 미결정
- 푸시를 어디까지(1/2/3단계) — *기본 권장: 1단계부터*
- 매칭 임계값·점수식(직군/지역 가중, 경력카드 텍스트 유사 방식)
- 알림 빈도·묶음(스팸 방지), 알림 on/off 설정
- 자동 OPEN 공고(외부 소싱분)도 매칭 대상에 포함할지 → [job-sourcing-plan.md](job-sourcing-plan.md) 연계
