const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Intercept DOMParser before any scripts run
  await page.evaluateOnNewDocument(() => {
    const originalParse = DOMParser.prototype.parseFromString;
    DOMParser.prototype.parseFromString = function(str, mimeType) {
      console.log('INTERCEPT_START');
      console.log('MimeType: ' + mimeType);
      console.log('String length: ' + str.length);
      console.log('Stack trace: ' + new Error().stack);
      console.log('INTERCEPT_END');
      return originalParse.call(this, str, mimeType);
    };
  });

  page.on('console', msg => {
    const txt = msg.text();
    if (txt.startsWith('INTERCEPT_') || txt.startsWith('MimeType:') || txt.startsWith('String length:') || txt.startsWith('Stack trace:')) {
      console.log('[Browser]', txt);
    }
  });

  try {
    await page.goto('http://localhost:3001/mobile', { waitUntil: 'networkidle0', timeout: 15000 });
  } catch (err) {
    console.error('Puppeteer run failed:', err);
  } finally {
    await browser.close();
  }
}

run();
