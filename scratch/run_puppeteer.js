const puppeteer = require('puppeteer');

async function run() {
  console.log('Launching browser (JS enabled)...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 800, height: 1200 });

  page.on('console', msg => {
    console.log('[Browser Console]', msg.type().toUpperCase(), ':', msg.text());
  });

  page.on('pageerror', err => {
    console.error('[Browser Error]', err.toString());
  });

  console.log('Navigating to http://localhost:3001/mobile ...');
  try {
    await page.goto('http://localhost:3001/mobile', { waitUntil: 'networkidle0', timeout: 15000 });
    console.log('Page loaded.');
    await new Promise(r => setTimeout(r, 3000));
    
    // Dump body HTML
    const bodyHtml = await page.evaluate(() => document.body.innerHTML);
    console.log('\n=== Rendered HTML (first 1000 chars) ===');
    console.log(bodyHtml.substring(0, 1000));
    console.log('========================================');
  } catch (err) {
    console.error('Failed in Puppeteer:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

run();
