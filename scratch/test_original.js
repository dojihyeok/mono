const { execSync } = require('child_process');
const puppeteer = require('puppeteer');

console.log('Reverting MoNo 사용자 앱.html to original...');
execSync('git checkout 9ca32d8 -- "new mono/MoNo 사용자 앱.html"');

// Run Puppeteer on original
async function runPuppeteer() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  try {
    await page.goto('http://localhost:3001/mobile', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    console.log('Original page loaded.');
    console.log('Console errors on original:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('First 5 errors:');
      console.log(consoleErrors.slice(0, 5));
    }
  } catch (err) {
    console.error('Puppeteer run failed:', err);
  } finally {
    await browser.close();
  }
}

runPuppeteer();
