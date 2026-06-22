const fs = require('fs');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const originalHtml = fs.readFileSync('scratch/original_app.html', 'utf8');
const roundtripHtml = fs.readFileSync('new mono/MoNo 사용자 앱.html', 'utf8');

const origTemplateStr = extractScript(originalHtml, '__bundler/template');
const roundtripTemplateStr = extractScript(roundtripHtml, '__bundler/template');

const origIdx = origTemplateStr.indexOf('M12 2.5V6h4');
const roundtripIdx = roundtripTemplateStr.indexOf('M12 2.5V6h4');

console.log('origIdx:', origIdx, 'roundtripIdx:', roundtripIdx);

if (origIdx !== -1) {
  const sub = origTemplateStr.substring(origIdx - 40, origIdx + 40);
  console.log('Original around path:', JSON.stringify(sub));
}

if (roundtripIdx !== -1) {
  const sub = roundtripTemplateStr.substring(roundtripIdx - 40, roundtripIdx + 40);
  console.log('Roundtrip around path:', JSON.stringify(sub));
}
