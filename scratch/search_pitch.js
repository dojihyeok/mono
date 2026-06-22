const fs = require('fs');

const content = fs.readFileSync('public/pitch.html', 'utf8');

const keywords = ['STAGE 03', 'STAGE 3', 'GTM', 'BM', '수요 검증', '대여', '렌탈', '공유', '안전장비', '중장비', '패키지', '2라운드', 'R2', 'R1', '1라운드'];

keywords.forEach(kw => {
  let count = 0;
  let idx = 0;
  while (true) {
    idx = content.indexOf(kw, idx);
    if (idx === -1) break;
    count++;
    if (count <= 10) {
      // Find line number
      const lineNum = content.substring(0, idx).split('\n').length;
      console.log(`Keyword "${kw}" at line ${lineNum}:`);
      console.log(`  Context: ${JSON.stringify(content.substring(idx - 40, idx + 60))}`);
    }
    idx += kw.length;
  }
  if (count > 0) {
    console.log(`Total for "${kw}": ${count}\n`);
  }
});
