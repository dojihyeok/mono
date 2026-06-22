const fs = require('fs');
const { execSync } = require('child_process');
const puppeteer = require('puppeteer');

console.log('Reverting MoNo 사용자 앱.html...');
execSync('git checkout 9ca32d8 -- "new mono/MoNo 사용자 앱.html"');

const filePath = 'new mono/MoNo 사용자 앱.html';
let htmlContent = fs.readFileSync(filePath, 'utf8');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const templateStr = extractScript(htmlContent, '__bundler/template');
const template = JSON.parse(templateStr);

// Roundtrip with / escaped as \u002F
const newTemplateStr = JSON.stringify(template).replace(/\//g, '\\u002F');

const targetScriptStart = htmlContent.indexOf('<script type="__bundler/template">');
const innerContentStart = targetScriptStart + '<script type="__bundler/template">'.length;
const nextClosingScript = htmlContent.indexOf('</script>', innerContentStart);

htmlContent = htmlContent.substring(0, innerContentStart) + newTemplateStr + htmlContent.substring(nextClosingScript);

fs.writeFileSync(filePath, htmlContent, 'utf8');
console.log('Roundtrip with slash escaping complete. Running Puppeteer check...');

// Run Puppeteer
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
    console.log('Page loaded in browser.');
    console.log('Console errors during roundtrip check:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('First 5 errors:');
      console.log(consoleErrors.slice(0, 5));
    } else {
      console.log('SUCCESS: No console errors with slash-escaped roundtrip!');
    }
  } catch (err) {
    console.error('Puppeteer run failed:', err);
  } finally {
    await browser.close();
  }
}

runPuppeteer();
