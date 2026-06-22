const fs = require('fs');

// Restore original_app.html to work dir
const originalHtml = fs.readFileSync('scratch/original_app.html', 'utf8');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const templateStr = extractScript(originalHtml, '__bundler/template');
console.log('Original template raw length:', templateStr.length);

const template = JSON.parse(templateStr);
console.log('Parsed template length:', template.length);

const serialized = JSON.stringify(template).replace(/<\/script>/gi, '<\\/script>');
console.log('Serialized template raw length:', serialized.length);

if (templateStr === serialized) {
  console.log('SUCCESS: The serialized string is EXACTLY identical to the original!');
} else {
  console.log('DIFFERENCE DETECTED!');
  console.log('Original first diff context:');
  for (let i = 0; i < Math.max(templateStr.length, serialized.length); i++) {
    if (templateStr[i] !== serialized[i]) {
      console.log(`First mismatch at index ${i}:`);
      console.log(`  Original:   ${JSON.stringify(templateStr.substring(i - 10, i + 30))}`);
      console.log(`  Serialized: ${JSON.stringify(serialized.substring(i - 10, i + 30))}`);
      break;
    }
  }
}
