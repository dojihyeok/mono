const fs = require('fs');

const html = fs.readFileSync('scratch/original_app.html', 'utf8');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const templateStr = extractScript(html, '__bundler/template');
const parsed = JSON.parse(templateStr);

const regex = /rx="([^"]*)"/g;
let match;
console.log('Occurrences of rx="...":');
while ((match = regex.exec(parsed)) !== null) {
  console.log(`  Found rx="${match[1]}"`);
}

const regex2 = /rx='([^']*)'/g;
console.log("Occurrences of rx='...':");
while ((match = regex2.exec(parsed)) !== null) {
  console.log(`  Found rx='${match[1]}'`);
}
