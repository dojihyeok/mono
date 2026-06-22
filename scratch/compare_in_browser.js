const fs = require('fs');
const { execSync } = require('child_process');
const puppeteer = require('puppeteer');

async function getBrowserTemplateTextContent() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  
  let textContent = '';
  try {
    await page.goto('http://localhost:3001/mobile', { waitUntil: 'networkidle0', timeout: 15000 });
    textContent = await page.evaluate(() => {
      const el = document.querySelector('script[type="__bundler/template"]');
      return el ? el.textContent : '';
    });
  } catch (err) {
    console.error('Puppeteer navigation failed:', err);
  } finally {
    await browser.close();
  }
  return textContent;
}

async function run() {
  console.log('1. Reverting file to original...');
  execSync('git checkout 9ca32d8 -- "new mono/MoNo 사용자 앱.html"');
  // Wait a moment for dev server to notice (just in case)
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('2. Fetching original template textContent from browser...');
  const origText = await getBrowserTemplateTextContent();
  console.log('Original text content length in browser:', origText.length);
  
  console.log('3. Performing roundtrip on disk...');
  const filePath = 'new mono/MoNo 사용자 앱.html';
  const htmlContent = fs.readFileSync(filePath, 'utf8');
  function extractScript(html, type) {
    const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
    const match = html.match(regex);
    return match ? match[1].trim() : null;
  }
  const templateStr = extractScript(htmlContent, '__bundler/template');
  const template = JSON.parse(templateStr);
  const serialized = JSON.stringify(template).replace(/<\/script>/gi, '<\\/script>');
  const targetScriptStart = htmlContent.indexOf('<script type="__bundler/template">');
  const innerContentStart = targetScriptStart + '<script type="__bundler/template">'.length;
  const nextClosingScript = htmlContent.indexOf('</script>', innerContentStart);
  const roundtripHtml = htmlContent.substring(0, innerContentStart) + serialized + htmlContent.substring(nextClosingScript);
  fs.writeFileSync(filePath, roundtripHtml, 'utf8');
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('4. Fetching roundtripped template textContent from browser...');
  const roundtripText = await getBrowserTemplateTextContent();
  console.log('Roundtripped text content length in browser:', roundtripText.length);
  
  // Parse both in Node
  let origParsed = '';
  let roundtripParsed = '';
  try {
    origParsed = JSON.parse(origText);
    console.log('Parsed original browser text successfully.');
  } catch (e) {
    console.error('Failed to parse original browser text:', e.message);
  }
  try {
    roundtripParsed = JSON.parse(roundtripText);
    console.log('Parsed roundtripped browser text successfully.');
  } catch (e) {
    console.error('Failed to parse roundtripped browser text:', e.message);
  }
  
  if (origParsed === roundtripParsed) {
    console.log('SUCCESS: The parsed templates are EXACTLY identical in the browser!');
  } else {
    console.log('DIFFERENCE DETECTED in parsed templates!');
    let diffs = 0;
    const limit = Math.max(origParsed.length, roundtripParsed.length);
    for (let i = 0; i < limit; i++) {
      if (origParsed[i] !== roundtripParsed[i]) {
        diffs++;
        if (diffs <= 5) {
          console.log(`Mismatch #${diffs} at index ${i}:`);
          console.log(`  Original:    ${origParsed.charCodeAt(i)} (${JSON.stringify(origParsed[i])})`);
          console.log(`  Roundtrip:   ${roundtripParsed.charCodeAt(i)} (${JSON.stringify(roundtripParsed[i])})`);
        }
      }
    }
    console.log('Total differences:', diffs);
  }
}

run();
