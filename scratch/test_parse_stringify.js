const fs = require('fs');

const htmlContent = fs.readFileSync('new mono/MoNo 사용자 앱.html', 'utf8');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const templateStr = extractScript(htmlContent, '__bundler/template');
console.log('Original template raw string length:', templateStr.length);

const template = JSON.parse(templateStr);
console.log('Parsed template string length:', template.length);

const serialized = JSON.stringify(template);
console.log('Serialized template string length:', serialized.length);

// Compare their characters
console.log('Original start:', JSON.stringify(templateStr.substring(0, 150)));
console.log('Serialized start:', JSON.stringify(serialized.substring(0, 150)));

let diffCount = 0;
for (let i = 0; i < Math.min(templateStr.length, serialized.length); i++) {
  if (templateStr[i] !== serialized[i]) {
    diffCount++;
    if (diffCount <= 5) {
      console.log(`Diff #${diffCount} at char ${i}:`);
      console.log(`  Original: ${JSON.stringify(templateStr.substring(i - 10, i + 20))}`);
      console.log(`  Serialized: ${JSON.stringify(serialized.substring(i - 10, i + 20))}`);
    }
  }
}
console.log('Total diff count:', diffCount);
