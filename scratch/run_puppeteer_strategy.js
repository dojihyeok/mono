const puppeteer = require('puppeteer');

async function run() {
  console.log('Launching browser for strategy.html testing...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // High-res viewport
  await page.setViewport({ width: 1440, height: 2500 });

  page.on('console', msg => {
    console.log('[Browser Console]', msg.type().toUpperCase(), ':', msg.text());
  });

  page.on('pageerror', err => {
    console.error('[Browser Error]', err.toString());
  });

  console.log('Navigating to http://localhost:3004/strategy ...');
  try {
    const response = await page.goto('http://localhost:3004/strategy', { waitUntil: 'networkidle0', timeout: 15000 });
    console.log('Page loaded. Status:', response.status());
    
    // Take screenshot of the top half
    await page.screenshot({ path: '/Users/yunhyeok/.gemini/antigravity/brain/61edfa5e-962b-4457-96b2-bd77408b3357/strategy_top.png' });
    console.log('Screenshot saved.');

    // Debug: Get SVG HTML
    const svgHtml = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      return svg ? svg.outerHTML : 'No SVG';
    });
    console.log('=== SVG HTML IN BROWSER ===');
    console.log(svgHtml);
    console.log('===========================');

    // Scroll down to Next MONO section (bottom) and take another screenshot
    await page.evaluate(() => {
      const el = document.getElementById('vision');
      if (el) el.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: '/Users/yunhyeok/.gemini/antigravity/brain/61edfa5e-962b-4457-96b2-bd77408b3357/strategy_bottom.png' });
    console.log('Bottom screenshot saved.');

  } catch (err) {
    console.error('Failed in Puppeteer:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

run();
