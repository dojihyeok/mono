const fs = require('fs');

const html = fs.readFileSync('scratch/original_app.html', 'utf8');

const regex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
while ((match = regex.exec(html)) !== null) {
  count++;
  const attrs = match[1];
  const content = match[2];
  console.log(`Script #${count}:`);
  console.log(`  Attributes: ${JSON.stringify(attrs.trim())}`);
  console.log(`  Content length: ${content.length}`);
  console.log(`  Start snippet: ${JSON.stringify(content.substring(0, 100))}`);
  console.log(`  End snippet:   ${JSON.stringify(content.substring(Math.max(0, content.length - 100)))}`);
}
