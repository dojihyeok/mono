const fs = require('fs');

const content = fs.readFileSync('public/pitch.html', 'utf8');
const lines = content.split('\n');

function searchKeyword(kw) {
  console.log(`=== Matches for "${kw}" ===`);
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(kw.toLowerCase())) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
}

searchKeyword('STAGE 03');
searchKeyword('STAGE 3');
searchKeyword('Growth BM');
searchKeyword('중장비');
searchKeyword('기어');
