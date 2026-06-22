const fs = require('fs');
const path = require('path');

const dir = 'new mono';
const files = fs.readdirSync(dir);

const keywords = ['Gear', '기어', '공구', '장비', '쉐어', '렌탈'];

files.forEach(file => {
  if (!file.endsWith('.html')) return;
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\nFile: ${file} (size: ${content.length} chars)`);
  
  keywords.forEach(kw => {
    let count = 0;
    let idx = 0;
    while (true) {
      idx = content.indexOf(kw, idx);
      if (idx === -1) break;
      count++;
      if (count <= 3) {
        console.log(`  Found keyword "${kw}" at index ${idx}:`);
        console.log(`    Context: ${JSON.stringify(content.substring(idx - 40, idx + 40))}`);
      }
      idx += kw.length;
    }
    if (count > 0) {
      console.log(`  Total for "${kw}": ${count}`);
    }
  });
});
