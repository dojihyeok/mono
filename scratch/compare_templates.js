const fs = require('fs');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const originalHtml = fs.readFileSync('scratch/original_app.html', 'utf8');
const currentHtml = fs.readFileSync('new mono/MoNo 사용자 앱.html', 'utf8');

const origTemplateStr = extractScript(originalHtml, '__bundler/template');
const currTemplateStr = extractScript(currentHtml, '__bundler/template');

console.log('Original template raw length:', origTemplateStr.length);
console.log('Current template raw length:', currTemplateStr.length);

try {
  const origParsed = JSON.parse(origTemplateStr);
  console.log('Original template parses successfully, length:', origParsed.length);
} catch (e) {
  console.log('Original template failed to parse:', e.message);
}

try {
  const currParsed = JSON.parse(currTemplateStr);
  console.log('Current template parses successfully, length:', currParsed.length);
} catch (e) {
  console.log('Current template failed to parse:', e.message);
}

// Compare the first few characters of the raw string where quotes appear.
console.log('Original template start (raw):');
console.log(origTemplateStr.substring(0, 300));
console.log('Current template start (raw):');
console.log(currTemplateStr.substring(0, 300));
