const fs = require('fs');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const html = fs.readFileSync('scratch/original_app.html', 'utf8');
const templateStr = extractScript(html, '__bundler/template');

console.log('First 300 characters of origTemplateStr raw:');
for (let i = 0; i < 300; i++) {
  const char = templateStr[i];
  const code = templateStr.charCodeAt(i);
  console.log(`${i}: ${JSON.stringify(char)} (code: ${code})`);
}
