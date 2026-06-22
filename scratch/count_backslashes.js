const fs = require('fs');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const origHtml = fs.readFileSync('scratch/original_app.html', 'utf8');
const origTemplateStr = extractScript(origHtml, '__bundler/template');
const origParsed = JSON.parse(origTemplateStr);

console.log('Original parsed template size:', origParsed.length);
const origBackslashCount = (origParsed.match(/\\/g) || []).length;
console.log('Total backslashes in original parsed template:', origBackslashCount);

if (origBackslashCount > 0) {
  let lastIndex = 0;
  for (let i = 0; i < 5; i++) {
    const idx = origParsed.indexOf('\\', lastIndex);
    if (idx === -1) break;
    console.log(`Backslash #${i+1} at index ${idx}:`);
    console.log(`  Context: ${JSON.stringify(origParsed.substring(idx - 20, idx + 40))}`);
    lastIndex = idx + 1;
  }
}
