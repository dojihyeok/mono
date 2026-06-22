const fs = require('fs');

const html = fs.readFileSync('scratch/original_app.html', 'utf8');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const templateStr = extractScript(html, '__bundler/template');
const parsed = JSON.parse(templateStr);

console.log('Original parsed length:', parsed.length);
const count = (parsed.match(/\\"/g) || []).length;
console.log('Occurrences of \\" in original parsed HTML:', count);

if (count > 0) {
  const idx = parsed.indexOf('\\"');
  console.log('Sample of \\" in original parsed HTML:', JSON.stringify(parsed.substring(idx - 20, idx + 40)));
}
