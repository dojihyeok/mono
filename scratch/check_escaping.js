const fs = require('fs');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const originalHtml = fs.readFileSync('scratch/original_app.html', 'utf8');
const headHtml = fs.readFileSync('new mono/MoNo 사용자 앱.html', 'utf8'); // Wait, current working dir is same as original right now? Let's check HEAD version.

const origTemplateStr = extractScript(originalHtml, '__bundler/template');
// Let's get the HEAD version of the HTML file
let headHtmlContent;
try {
  const { execSync } = require('child_process');
  headHtmlContent = execSync('git show HEAD:"new mono/MoNo 사용자 앱.html"', { encoding: 'utf8' });
} catch (e) {
  headHtmlContent = headHtml;
}
const headTemplateStr = extractScript(headHtmlContent, '__bundler/template');

console.log('Original template matches for "class=\\"":');
const origMatches = origTemplateStr.match(/class=\\"[a-zA-Z0-9_\-\s]+\\"/g) || [];
console.log('Found:', origMatches.slice(0, 5));

console.log('HEAD template matches for "class=\\"" or similar:');
const headMatches1 = headTemplateStr.match(/class=\\\"[a-zA-Z0-9_\-\s]+\\\"/g) || [];
const headMatches2 = headTemplateStr.match(/class=\\"[a-zA-Z0-9_\-\s]+\\"/g) || [];
console.log('Found with triple backslash (\\\\\\"):', headMatches1.slice(0, 5));
console.log('Found with single backslash (\\\\"):', headMatches2.slice(0, 5));

console.log('Sample context in original:');
const idxOrig = origTemplateStr.indexOf('class=\\"scr\\"');
if (idxOrig !== -1) {
  console.log(JSON.stringify(origTemplateStr.substring(idxOrig - 20, idxOrig + 40)));
} else {
  console.log('Not found class=\\"scr\\" in original');
}

console.log('Sample context in HEAD:');
const idxHead = headTemplateStr.indexOf('class=\\\\"');
const idxHead2 = headTemplateStr.indexOf('class=\\"');
console.log('index of class=\\\\":', idxHead, 'index of class=\\":', idxHead2);
if (idxHead2 !== -1) {
  console.log(JSON.stringify(headTemplateStr.substring(idxHead2 - 20, idxHead2 + 40)));
}
