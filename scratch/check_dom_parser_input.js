const fs = require('fs');

const html = fs.readFileSync('scratch/head_app.html', 'utf8');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const templateStr = extractScript(html, '__bundler/template');
const parsed = JSON.parse(templateStr);

fs.writeFileSync('scratch/parsed_template.html', parsed, 'utf8');
console.log('Wrote parsed template of size:', parsed.length);

// Let's search parsed for d=\" or x=\"
const count1 = (parsed.match(/d=\\"/g) || []).length;
const count2 = (parsed.match(/x=\\"/g) || []).length;
console.log('Occurrences of d=\\" in parsed template HTML:', count1);
console.log('Occurrences of x=\\" in parsed template HTML:', count2);

if (count1 > 0) {
  console.log('d=\\" context:', JSON.stringify(parsed.substring(parsed.indexOf('d=\\"') - 20, parsed.indexOf('d=\\"') + 40)));
}
