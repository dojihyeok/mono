const fs = require('fs');
const content = fs.readFileSync('test.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(1490, 1540).join('\n'));
