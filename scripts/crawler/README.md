# 카페/밴드 구인 공고 크롤러

네이버 카페·밴드의 구인 게시글을 읽어 MONO `JobPost`(상태 `PENDING`, 관리자 검수 대기)로 등록한다.
아이디/비밀번호는 어디에도 저장하지 않는다 — 로그인은 실제로 뜨는 브라우저 창에서 직접 한다.

## 1. 설치

```bash
cd scripts/crawler
npm install
```

## 2. 로그인 (멤버 전용 글을 수집할 때만 필요)

```bash
node login.js naver   # 네이버 카페 로그인
node login.js band    # 밴드 로그인
```

브라우저 창이 뜨면 그 안에서 직접 로그인하고, 터미널로 돌아와 Enter를 누르면 세션이
`.session/naver.json` / `.session/band.json`에 저장된다. **공개(비회원 열람 가능) 글은
로그인 없이도 수집된다.**

## 3. 크롤링 실행

```bash
CRAWL_API_BASE=http://localhost:3000 node crawl.js <URL> [<URL> ...]
```

- 카페 게시글 URL(`cafe.naver.com/f-e/cafes/.../articles/...`) — 게시글 1건 수집
- 밴드 게시글 URL(`band.us/band/{id}/post/{postId}`) — 게시글 1건 수집
- 밴드 목록 URL(`band.us/band/{id}/post`) — 목록에서 게시글 링크를 찾아 전부 수집

`CRAWL_API_BASE`는 등록 대상 서버(Next BFF) 주소. 운영 반영 시 `https://mono.dojiung.com`으로 지정.

## 4. 등록 후

수집된 공고는 `status: PENDING`으로만 들어가고 워커 화면에는 노출되지 않는다.
`/amono` 관리자 화면의 공고 관리에서 원문을 확인하고 승인(OPEN)해야 실제로 노출된다.

## 참고

- 제목/지역/직종/연락처는 게시글 텍스트에서 규칙 기반으로 추출한 것이라 완벽하지 않을 수 있다 —
  그래서 자동 노출이 아니라 관리자 검수를 거치도록 설계했다.
- 멤버 전용(가입해야 열람 가능) 밴드/카페 글은 해당 계정이 그 밴드/카페 멤버여야 수집된다.
- 밴드/카페 화면 구조가 바뀌면 파싱이 깨질 수 있다. 그 경우 `crawl.js`의 추출 로직을 다시 맞춰야 한다.
