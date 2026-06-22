const fs = require('fs');

const content = fs.readFileSync('test.html', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('STAGE')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
