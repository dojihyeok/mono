const fs = require('fs');
const { execSync } = require('child_process');
const puppeteer = require('puppeteer');

console.log('Reverting...');
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
const newTemplateStr = JSON.stringify(template).replace(/<\/script>/gi, '<\\/script>');

const targetScriptStart = htmlContent.indexOf('<script type="__bundler/template">');
const innerContentStart = targetScriptStart + '<script type="__bundler/template">'.length;
const nextClosingScript = htmlContent.indexOf('</script>', innerContentStart);

htmlContent = htmlContent.substring(0, innerContentStart) + newTemplateStr + htmlContent.substring(nextClosingScript);
fs.writeFileSync(filePath, htmlContent, 'utf8');
console.log('Roundtrip written.');

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[Browser ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error('[Browser PageError]', err.toString());
  });

  try {
    await page.goto('http://localhost:3001/mobile', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    console.log('Done.');
  } catch (err) {
    console.error('Puppeteer failed:', err);
  } finally {
    await browser.close();
  }
}

run();
