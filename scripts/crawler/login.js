// 네이버(카페)/밴드 로그인 세션을 브라우저 창에서 직접 로그인받아 저장한다.
// 사용법: node login.js naver   또는   node login.js band
// 아이디/비밀번호는 이 스크립트에 저장되지 않는다 — 로그인은 뜨는 브라우저 창에서 사용자가 직접 한다.
// 터미널 입력을 기다리지 않고, 로그인 완료 여부를 페이지에서 자동 감지해서 세션을 저장한다
// (이 스크립트가 사람이 아니라 다른 프로세스/에이전트에 의해 실행될 수도 있어서 stdin에 의존하지 않음).
const { chromium } = require("playwright-core");
const path = require("path");

const TARGET = process.argv[2];
const START_URL = {
  naver: "https://nid.naver.com/nidlogin.login",
  band: "https://www.band.us/",
}[TARGET];

if (!START_URL) {
  console.error("사용법: node login.js naver | band");
  process.exit(1);
}

const STATE_PATH = path.join(__dirname, ".session", `${TARGET}.json`);
const TIMEOUT_MS = 10 * 60 * 1000; // 10분 안에 로그인 안 하면 타임아웃
const POLL_MS = 3000;
const CONFIRM_STREAK = 2; // 연속으로 이 횟수만큼 같은 상태여야 인정(과도기 오탐 방지)

async function loggedOutSignal(page, target) {
  const text = await page.evaluate(() => document.body.innerText).catch(() => "");
  if (target === "band") return text.includes("로그인") && text.includes("회원가입");
  return page.url().includes("nid.naver.com/nidlogin");
}

async function waitForStreak(page, target, wantLoggedOut, label) {
  let streak = 0;
  while (streak < CONFIRM_STREAK) {
    const isOut = await loggedOutSignal(page, target);
    if (isOut === wantLoggedOut) {
      streak += 1;
    } else {
      streak = 0;
    }
    if (streak < CONFIRM_STREAK) await new Promise((r) => setTimeout(r, POLL_MS));
  }
  console.log(label);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: false,
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(START_URL, { waitUntil: "networkidle" });

  // 1) 먼저 "로그아웃 상태" 렌더링이 실제로 끝났는지부터 확인(초기 로딩 스켈레톤 오탐 방지)
  await waitForStreak(page, TARGET, true, "페이지 로딩 확인됨 — 로그인 대기 중");

  console.log(`\n브라우저 창에서 ${TARGET === "naver" ? "네이버" : "밴드"} 로그인을 완료해주세요.`);
  console.log("로그인이 완료되면 자동으로 감지해서 세션을 저장합니다(최대 10분 대기)...");

  // 2) 그 다음에야 "로그인 상태로 전환됨"을 감지
  const timeout = setTimeout(() => {
    console.log("타임아웃: 로그인을 감지하지 못했습니다. 다시 시도해주세요.");
    browser.close();
    process.exitCode = 1;
  }, TIMEOUT_MS);

  await waitForStreak(page, TARGET, false, "로그인 감지됨 — 리다이렉트가 끝날 때까지 대기 중...");
  clearTimeout(timeout);

  // OAuth 리다이렉트 체인(band.us → auth.band.us → nid.naver.com → ...)이 완전히
  // 끝나서 URL이 안정될 때까지 기다린 다음에야 세션을 저장한다(안 그러면 저장 도중
  // 페이지 전환으로 "Execution context was destroyed" 에러 발생).
  let lastUrl = "";
  let stableCount = 0;
  while (stableCount < 3) {
    await new Promise((r) => setTimeout(r, 1500));
    const url = page.url();
    if (url === lastUrl) stableCount += 1;
    else { stableCount = 0; lastUrl = url; }
  }
  await page.waitForLoadState("networkidle").catch(() => {});

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await ctx.storageState({ path: STATE_PATH });
      console.log(`세션 저장 완료: ${STATE_PATH}`);
      break;
    } catch (e) {
      if (attempt === 3) throw e;
      console.log(`저장 재시도 중(${attempt}/3)...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  await browser.close();
})();
