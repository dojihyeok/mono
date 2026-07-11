// 네이버(카페)/밴드 로그인 세션을 브라우저 창에서 직접 로그인받아 저장한다.
// 사용법: node login.js naver   또는   node login.js band
// 아이디/비밀번호는 이 스크립트에 저장되지 않는다 — 로그인은 뜨는 브라우저 창에서 사용자가 직접 한다.
const { chromium } = require("playwright-core");
const path = require("path");
const readline = require("readline");

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

function waitForEnter(msg) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(msg, () => { rl.close(); resolve(); });
  });
}

(async () => {
  const browser = await chromium.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: false,
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(START_URL, { waitUntil: "domcontentloaded" });

  console.log(`\n브라우저 창에서 ${TARGET === "naver" ? "네이버" : "밴드"} 로그인을 완료해주세요.`);
  await waitForEnter("로그인을 마쳤으면 여기서 Enter를 눌러주세요...");

  await ctx.storageState({ path: STATE_PATH });
  console.log(`세션 저장 완료: ${STATE_PATH}`);

  await browser.close();
})();
