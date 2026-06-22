const { execSync } = require('child_process');
const html = execSync('git show 9ca32d8:"new mono/MoNo 사용자 앱.html"', { maxBuffer: 30 * 1024 * 1024 }).toString('utf8');

const searchList = ['react', 'dom', 'unpkg', 'cdnjs', 'jsdelivr', 'script', 'http'];
searchList.forEach(search => {
  let idx = 0;
  let count = 0;
  while (true) {
    idx = html.indexOf(search, idx);
    if (idx === -1) break;
    count++;
    if (count <= 3) {
      console.log(`Found [${search}] at position ${idx}: ${html.substring(idx - 40, idx + 60).replace(/\n/g, ' ')}`);
    }
    idx += search.length;
  }
  console.log(`Total [${search}] occurrences: ${count}`);
});
