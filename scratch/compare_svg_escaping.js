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

// Find first <svg in both
const origIdx = origTemplateStr.indexOf('<svg');
const roundtripIdx = roundtripTemplateStr.indexOf('<svg');

console.log('origIdx:', origIdx, 'roundtripIdx:', roundtripIdx);

if (origIdx !== -1) {
  const sub = origTemplateStr.substring(origIdx - 20, origIdx + 120);
  console.log('Original around <svg:');
  console.log(JSON.stringify(sub));
}

if (roundtripIdx !== -1) {
  const sub = roundtripTemplateStr.substring(roundtripIdx - 20, roundtripIdx + 120);
  console.log('Roundtrip around <svg:');
  console.log(JSON.stringify(sub));
}
