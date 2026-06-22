const fs = require('fs');
const { execSync } = require('child_process');

console.log('Reverting...');
execSync('git checkout 9ca32d8 -- "new mono/MoNo 사용자 앱.html"');

const filePath = 'new mono/MoNo 사용자 앱.html';
const originalHtml = fs.readFileSync(filePath, 'utf8');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const origTemplateStr = extractScript(originalHtml, '__bundler/template');
const origParsed = JSON.parse(origTemplateStr);

// Perform roundtrip
const serialized = JSON.stringify(origParsed).replace(/<\/script>/gi, '<\\/script>');
const targetScriptStart = originalHtml.indexOf('<script type="__bundler/template">');
const innerContentStart = targetScriptStart + '<script type="__bundler/template">'.length;
const nextClosingScript = originalHtml.indexOf('</script>', innerContentStart);

const roundtripHtml = originalHtml.substring(0, innerContentStart) + serialized + originalHtml.substring(nextClosingScript);
fs.writeFileSync(filePath, roundtripHtml, 'utf8');

// Read it back and parse
const readHtml = fs.readFileSync(filePath, 'utf8');
const readTemplateStr = extractScript(readHtml, '__bundler/template');
const readParsed = JSON.parse(readTemplateStr);

console.log('Original parsed length:', origParsed.length);
console.log('Roundtripped parsed length:', readParsed.length);

let diffs = 0;
const limit = Math.max(origParsed.length, readParsed.length);
for (let i = 0; i < limit; i++) {
  if (origParsed[i] !== readParsed[i]) {
    diffs++;
    if (diffs <= 5) {
      console.log(`Diff #${diffs} at parsed char ${i}:`);
      console.log(`  Original:    ${origParsed.charCodeAt(i)} (${JSON.stringify(origParsed[i])})`);
      console.log(`  Roundtripped: ${readParsed.charCodeAt(i)} (${JSON.stringify(readParsed[i])})`);
    }
  }
}
console.log('Total differences in parsed HTML:', diffs);
