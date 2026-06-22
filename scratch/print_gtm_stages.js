const fs = require('fs');

const content = fs.readFileSync('public/pitch.html', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('STAGE') && (line.includes('class="text-') || line.includes('class="font-') || line.includes('span class="text-'))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
