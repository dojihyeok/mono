const fs = require('fs');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const html = fs.readFileSync('scratch/head_app.html', 'utf8');
const templateStr = extractScript(html, '__bundler/template');

try {
  const parsed = JSON.parse(templateStr);
  console.log('Parsed template length:', parsed.length);
  
  // Let's search for 12.3 in parsed template
  let lastIndex = 0;
  while (true) {
    const idx = parsed.indexOf('12.3', lastIndex);
    if (idx === -1) break;
    console.log(`Found "12.3" at index ${idx}:`);
    console.log(`  Context: ${JSON.stringify(parsed.substring(idx - 30, idx + 30))}`);
    lastIndex = idx + 1;
  }
  
  // Let's search for \\" in parsed template
  lastIndex = 0;
  let count = 0;
  while (true) {
    const idx = parsed.indexOf('\\"', lastIndex);
    if (idx === -1) break;
    count++;
    if (count <= 10) {
      console.log(`Found \\" at index ${idx}:`);
      console.log(`  Context: ${JSON.stringify(parsed.substring(idx - 30, idx + 30))}`);
    }
    lastIndex = idx + 1;
  }
  console.log(`Total \\" in parsed template:`, count);

} catch (e) {
  console.error('Failed to parse:', e);
}
