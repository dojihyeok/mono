const fs = require('fs');

const html = fs.readFileSync('new mono/MoNo 사용자 앱.html', 'utf8');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const templateStr = extractScript(html, '__bundler/template');
const idx = templateStr.indexOf('class=');

console.log('Index of class= in roundtrip template:', idx);
if (idx !== -1) {
  const sub = templateStr.substring(idx - 5, idx + 15);
  console.log('String:', JSON.stringify(sub));
  console.log('Chars:', sub.split('').map(c => c + ':' + c.charCodeAt(0)).join(' '));
}
