const fs = require('fs');

const html = fs.readFileSync('scratch/original_app.html', 'utf8');

const idx = html.indexOf('M12 2.5V6h4');
console.log('Index of path in raw HTML:', idx);

if (idx !== -1) {
  const sub = html.substring(idx - 40, idx + 40);
  console.log('String representation of raw HTML around path:');
  console.log(JSON.stringify(sub));
  console.log('Chars:');
  console.log(sub.split('').map(c => c + ':' + c.charCodeAt(0)).join(' '));
}
