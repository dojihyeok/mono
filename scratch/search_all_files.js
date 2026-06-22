const fs = require('fs');
const path = require('path');

function searchInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const keywords = ['Gear', '기어', '공구', '장비', '쉐어', '렌탈'];
  
  keywords.forEach(kw => {
    let count = 0;
    let idx = 0;
    while (true) {
      idx = content.indexOf(kw, idx);
      if (idx === -1) break;
      count++;
      if (count <= 3) {
        const line = content.substring(0, idx).split('\n').length;
        console.log(`[${path.basename(filePath)}] Found "${kw}" on line ${line}: ${content.substring(idx - 30, idx + 50).trim().replace(/\n/g, ' ')}`);
      }
      idx += kw.length;
    }
  });
}

const paths = [
  'public/pitch.html',
  'public/pitch.html.bak',
  'temp_pitch_only.html',
  'temp_pitch_only.html.bak',
  'test.html',
  'test.html.bak'
];

paths.forEach(p => {
  if (fs.existsSync(p)) {
    searchInFile(p);
  }
});
