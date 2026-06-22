const fs = require('fs');

const html = fs.readFileSync('scratch/original_app.html', 'utf8');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const templateStr = extractScript(html, '__bundler/template');
const parsed = JSON.parse(templateStr);

console.log('Searching for "1.4" inside parsed template...');
let idx = parsed.indexOf('1.4');
if (idx !== -1) {
  console.log(`Found at index ${idx}:`);
  console.log(JSON.stringify(parsed.substring(idx - 30, idx + 30)));
} else {
  console.log('Not found "1.4" in parsed template!');
}
