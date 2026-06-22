const fs = require('fs');
const { execSync } = require('child_process');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const originalHtml = fs.readFileSync('scratch/original_app.html', 'utf8');
const origTemplateStr = extractScript(originalHtml, '__bundler/template');

let headHtmlContent;
try {
  headHtmlContent = execSync('git show HEAD:"new mono/MoNo 사용자 앱.html"', { encoding: 'utf8' });
} catch (e) {
  console.log('Error reading HEAD via git, reading from file instead');
  headHtmlContent = fs.readFileSync('new mono/MoNo 사용자 앱.html', 'utf8');
}
const headTemplateStr = extractScript(headHtmlContent, '__bundler/template');

// Let's find class="scr" in both
const origIdx = origTemplateStr.indexOf('class=\\"scr\\"');
const headIdx = headTemplateStr.indexOf('class=\\"scr\\"');
console.log('origIdx:', origIdx, 'headIdx:', headIdx);

if (origIdx !== -1) {
  console.log('Original around class=\\"scr\\":');
  const sub = origTemplateStr.substring(origIdx - 5, origIdx + 15);
  console.log('String:', JSON.stringify(sub));
  console.log('Chars:', sub.split('').map(c => c + ':' + c.charCodeAt(0)).join(' '));
}

if (headIdx !== -1) {
  console.log('HEAD around class=\\"scr\\":');
  const sub = headTemplateStr.substring(headIdx - 5, headIdx + 15);
  console.log('String:', JSON.stringify(sub));
  console.log('Chars:', sub.split('').map(c => c + ':' + c.charCodeAt(0)).join(' '));
} else {
  // Let's search for just "class" in headTemplateStr
  const idx = headTemplateStr.indexOf('class');
  console.log('HEAD index of "class":', idx);
  if (idx !== -1) {
    const sub = headTemplateStr.substring(idx - 5, idx + 25);
    console.log('HEAD near "class":', JSON.stringify(sub));
    console.log('Chars:', sub.split('').map(c => c + ':' + c.charCodeAt(0)).join(' '));
  }
}
