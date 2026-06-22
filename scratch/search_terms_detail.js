const fs = require('fs');

const content = fs.readFileSync('public/pitch.html', 'utf8');
const lines = content.split('\n');

function searchKeyword(kw) {
  console.log(`=== Matches for "${kw}" ===`);
  lines.forEach((line, idx) => {
    if (line.includes(kw)) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
}

searchKeyword('운송');
searchKeyword('작업복');
searchKeyword('STAGE');
