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

try {
  const origParsed = JSON.parse(origTemplateStr);
  const headParsed = JSON.parse(headTemplateStr);
  
  console.log('Original parsed length:', origParsed.length);
  console.log('HEAD parsed length:', headParsed.length);
  
  let diffs = 0;
  const limit = Math.max(origParsed.length, headParsed.length);
  for (let i = 0; i < limit; i++) {
    if (origParsed[i] !== headParsed[i]) {
      diffs++;
      if (diffs <= 5) {
        console.log(`Parsed HTML Diff #${diffs} at char index ${i}:`);
        console.log(`  Original: ${JSON.stringify(origParsed.substring(Math.max(0, i - 10), i + 30))}`);
        console.log(`  HEAD:     ${JSON.stringify(headParsed.substring(Math.max(0, i - 10), i + 30))}`);
      }
    }
  }
  console.log('Total parsed diffs:', diffs);
  
} catch (e) {
  console.error('Failed to parse:', e);
}
