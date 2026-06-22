const fs = require('fs');

const html = fs.readFileSync('scratch/original_app.html', 'utf8');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const templateStr = extractScript(html, '__bundler/template');
const parsed = JSON.parse(templateStr);

console.log('Searching parsed template for paths:');
let lastIndex = 0;
let count = 0;
while (true) {
  const idx = parsed.indexOf('M12', lastIndex);
  if (idx === -1) break;
  count++;
  console.log(`Found "M12" at index ${idx}:`);
  console.log(`  Context: ${JSON.stringify(parsed.substring(idx - 20, idx + 40))}`);
  lastIndex = idx + 1;
}
console.log('Total M12 in parsed template:', count);
