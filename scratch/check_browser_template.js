const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/mobile', { waitUntil: 'networkidle0', timeout: 15000 });
  
  const results = await page.evaluate(() => {
    const el = document.querySelector('script[type="__bundler/template"]');
    if (!el) return { error: 'no element' };
    const rawText = el.textContent;
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      parsed = 'failed: ' + e.message;
    }
    return {
      rawLength: rawText.length,
      rawStart: rawText.substring(0, 300),
      parsedLength: typeof parsed === 'string' ? parsed.length : (parsed ? parsed.length : 0),
      parsedStart: typeof parsed === 'string' ? parsed : (parsed ? parsed.substring(0, 300) : ''),
      countBackslashQuotes: rawText.split('\\"').length - 1,
      countTripleBackslashQuotes: rawText.split('\\\\\\"').length - 1
    };
  });
  
  console.log('Browser template results:', results);
  await browser.close();
}

run();
