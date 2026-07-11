// 네이버 카페/밴드 구인 게시글을 읽어 MONO JobPost(PENDING, 관리자 검수 대기)로 등록한다.
// 사용법: node crawl.js <URL> [<URL> ...]
// 로그인이 필요한 글은 먼저 `node login.js naver`(카페) 또는 `node login.js band`(밴드)로
// 브라우저 창에서 직접 로그인해 세션을 저장해둬야 한다. 공개 글은 로그인 없이도 수집된다.
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const API_BASE = process.env.CRAWL_API_BASE || "http://localhost:3000";
const SESSION_DIR = path.join(__dirname, ".session");

// web/lib/constants.ts의 JOB_TYPES와 동일(단일 출처 유지용 수동 동기화).
const JOB_TYPES = ["전기", "설비", "토목", "목공", "도장", "용접", "비계", "철근", "조적", "방수"];
const URGENT_RE = /급구|긴급|당일모집|오늘모집|급함/;
const PHONE_RE = /01[016-9]-?\d{3,4}-?\d{4}/g;

function detect(url) {
  if (url.includes("cafe.naver.com")) return { platform: "cafe", isList: false };
  if (url.includes("band.us")) {
    const m = url.match(/\/band\/(\d+)\/post\/(\d+)/);
    return { platform: "band", isList: !m, bandId: url.match(/\/band\/(\d+)/)?.[1] };
  }
  return { platform: null, isList: false };
}

function sessionStateFor(platform) {
  const p = path.join(SESSION_DIR, `${platform === "cafe" ? "naver" : "band"}.json`);
  return fs.existsSync(p) ? p : undefined;
}

function extractLabeled(text) {
  // "라벨 : 값" 줄 패턴 추출(카페 구인글 관례: 지역/직종/급여/담당자/연락처 등)
  const map = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([가-힣]{1,8})\s*[:：]\s*(.+?)\s*$/);
    if (m) map[m[1]] = m[2];
  }
  return map;
}

function pickJobTypes(text) {
  const found = JOB_TYPES.filter((t) => text.includes(t));
  return found.length ? found : ["기타"];
}

const PROVINCES = ["서울", "경기", "인천", "충청", "충남", "충북", "대전", "세종", "전라", "전북", "전남", "광주", "경상", "경북", "경남", "부산", "대구", "울산", "강원", "제주"];
function guessRegion(bodyLines) {
  const line = bodyLines.slice(0, 8).map((l) => l.trim()).find((l) => l && PROVINCES.some((p) => l.startsWith(p)) && l.length <= 30);
  return line || "";
}

function firstNonEmptyLine(text) {
  return text.split("\n").map((l) => l.trim()).find(Boolean) || "";
}

function parseCafeDate(text) {
  const m = text.match(/(\d{4})\.(\d{2})\.(\d{2})\.\s*(\d{2}):(\d{2})/);
  if (!m) return undefined;
  const [, y, mo, d, h, mi] = m;
  return new Date(`${y}-${mo}-${d}T${h}:${mi}:00+09:00`).toISOString();
}

function parseBandDate(text) {
  const m = text.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*(오전|오후)\s*(\d{1,2}):(\d{2})/);
  if (!m) return undefined;
  let [, y, mo, d, ampm, h, mi] = m;
  h = Number(h);
  if (ampm === "오후" && h !== 12) h += 12;
  if (ampm === "오전" && h === 12) h = 0;
  const pad = (n) => String(n).padStart(2, "0");
  return new Date(`${y}-${pad(mo)}-${pad(d)}T${pad(h)}:${mi}:00+09:00`).toISOString();
}

async function extractCafe(page) {
  await page.waitForTimeout(1500);
  const articleFrame = page.frames().find((f) => f.url().includes("/ca-fe/cafes/"));
  if (!articleFrame) throw new Error("카페 본문 프레임을 찾지 못함(로그인 필요 여부 확인)");
  const raw = await articleFrame.evaluate(() => document.body.innerText);

  const startMatch = raw.match(/URL\s*복사/);
  const afterStart = startMatch ? raw.slice(startMatch.index + startMatch[0].length) : raw;
  const endMatch = afterStart.search(/님의\s*게시글\s*더보기|\n\s*좋아요\d*\s*\n/);
  const body = (endMatch >= 0 ? afterStart.slice(0, endMatch) : afterStart).trim();
  const bodyLines = body.split("\n");

  const title = firstNonEmptyLine(body).slice(0, 60);
  const labeled = extractLabeled(body);
  const phones = body.match(PHONE_RE) || [];
  const region = labeled["지역"] || labeled["현장"] || labeled["위치"] || guessRegion(bodyLines);
  return {
    title,
    body,
    region: region ? [region] : [],
    jobType: pickJobTypes((labeled["직종"] || labeled["공종"] || "") + " " + title + " " + body),
    conditions: labeled["급여"] || labeled["일당"] || labeled["단가"] || "",
    posterName: labeled["담당자"] || "카페 회원",
    posterPhone: labeled["연락처"] || labeled["전화"] || labeled["핸드폰"] || phones[0] || "",
    sourcePostedAt: parseCafeDate(raw),
    isUrgent: URGENT_RE.test(title + body),
  };
}

async function extractBandSingle(page) {
  await page.waitForTimeout(1500);
  const raw = await page.evaluate(() => document.body.innerText);

  if (/멤버만\s*볼\s*수\s*있습니다/.test(raw)) {
    throw new Error("멤버 전용 글 — 이 밴드 멤버로 가입/로그인된 세션이 필요함");
  }

  const optIdx = raw.indexOf("글 옵션");
  const afterStart = optIdx >= 0 ? raw.slice(optIdx + 4) : raw;
  const endIdx = afterStart.search(/\n\s*표정짓기/);
  const body = (endIdx >= 0 ? afterStart.slice(0, endIdx) : afterStart).trim();

  const beforeOpt = optIdx >= 0 ? raw.slice(0, optIdx) : "";
  const beforeLines = beforeOpt.trim().split("\n").filter(Boolean);
  const author = beforeLines.length >= 2 ? beforeLines[beforeLines.length - 2] : "밴드 회원";

  const labeled = extractLabeled(body);
  const phones = body.match(PHONE_RE) || [];
  const title = firstNonEmptyLine(body).slice(0, 60);
  const region = labeled["지역"] || labeled["현장"] || labeled["위치"] || guessRegion(body.split("\n"));

  return {
    title,
    body,
    region: region ? [region] : [],
    jobType: pickJobTypes((labeled["직종"] || labeled["공종"] || "") + " " + body),
    conditions: labeled["급여"] || labeled["일당"] || labeled["단가"] || "",
    posterName: labeled["담당자"] || author,
    posterPhone: labeled["연락처"] || labeled["전화"] || labeled["핸드폰"] || phones[0] || "",
    sourcePostedAt: parseBandDate(raw),
    isUrgent: URGENT_RE.test(body),
  };
}

async function listBandPostUrls(page, bandId) {
  await page.waitForTimeout(2000);
  const hrefs = await page.$$eval("a[href*='/post/']", (as) => as.map((a) => a.getAttribute("href")));
  const abs = hrefs
    .map((h) => (h.startsWith("http") ? h : `https://www.band.us${h}`))
    .filter((h) => h.includes(`/band/${bandId}/post/`));
  return [...new Set(abs)];
}

async function submit(record, source, sourceUrl) {
  const payload = {
    title: record.title || "(제목 없음)",
    jobType: record.jobType,
    region: record.region.length ? record.region : ["전국"],
    conditions: record.conditions || undefined,
    isUrgent: !!record.isUrgent,
    source,
    sourceUrl,
    sourceRawText: record.body,
    sourcePostedAt: record.sourcePostedAt,
    posterName: record.posterName,
    posterPhone: record.posterPhone || undefined,
  };
  const res = await fetch(`${API_BASE}/api/admin/job-posts/crawled`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function processOne(browser, url) {
  const { platform } = detect(url);
  if (!platform) {
    console.log(`SKIP (지원하지 않는 URL): ${url}`);
    return;
  }
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    storageState: sessionStateFor(platform),
  });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 25000 });
    const record = platform === "cafe" ? await extractCafe(page) : await extractBandSingle(page);
    const source = platform === "cafe" ? "CRAWLED_CAFE" : "CRAWLED_BAND";
    const result = await submit(record, source, url);
    console.log(`${result.ok ? "OK" : "FAIL"} [${result.status}] ${record.title} | 지역:${record.region.join(",")} | 직종:${record.jobType.join(",")} | 연락처:${record.posterPhone || "-"} -> ${url}`);
    if (!result.ok) console.log("  응답:", JSON.stringify(result.data));
  } catch (e) {
    console.log(`ERROR: ${url}\n  ${e.message}`);
  } finally {
    await ctx.close();
  }
}

(async () => {
  const urls = process.argv.slice(2);
  if (!urls.length) {
    console.error("사용법: node crawl.js <URL> [<URL> ...]");
    process.exit(1);
  }

  const browser = await chromium.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });

  for (const url of urls) {
    const { platform, isList, bandId } = detect(url);
    if (platform === "band" && isList) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, storageState: sessionStateFor("band") });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: "networkidle", timeout: 25000 });
      const postUrls = await listBandPostUrls(page, bandId);
      await ctx.close();
      console.log(`밴드 목록에서 게시글 ${postUrls.length}건 발견: ${url}`);
      for (const postUrl of postUrls) await processOne(browser, postUrl);
    } else {
      await processOne(browser, url);
    }
  }

  await browser.close();
})();
