const fs = require('fs');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const originalHtml = fs.readFileSync('scratch/original_app.html', 'utf8');
const headHtml = fs.readFileSync('scratch/head_app.html', 'utf8');

const origTemplateStr = extractScript(originalHtml, '__bundler/template');
const headTemplateStr = extractScript(headHtml, '__bundler/template');

console.log('Original template raw length:', origTemplateStr.length);
console.log('HEAD template raw length:', headTemplateStr.length);

// Compare characters
let diffs = 0;
const limit = Math.max(origTemplateStr.length, headTemplateStr.length);
for (let i = 0; i < limit; i++) {
  if (origTemplateStr[i] !== headTemplateStr[i]) {
    diffs++;
    if (diffs <= 10) {
      console.log(`Diff #${diffs} at char index ${i}:`);
      console.log(`  Original char code: ${origTemplateStr.charCodeAt(i)} (${JSON.stringify(origTemplateStr[i])})`);
      console.log(`  HEAD char code: ${headTemplateStr.charCodeAt(i)} (${JSON.stringify(headTemplateStr[i])})`);
      console.log(`  Original context: ${JSON.stringify(origTemplateStr.substring(Math.max(0, i - 10), i + 20))}`);
      console.log(`  HEAD context:     ${JSON.stringify(headTemplateStr.substring(Math.max(0, i - 10), i + 20))}`);
    }
  }
}
console.log('Total diff count:', diffs);
