const http = require('http');
const fs = require('fs');

http.get('http://localhost:3001/mobile', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('scratch/served_app.html', data, 'utf8');
    console.log('Served HTML size:', data.length);
    
    const fileHtml = fs.readFileSync('new mono/MoNo 사용자 앱.html', 'utf8');
    console.log('File on disk size:', fileHtml.length);
    
    if (data === fileHtml) {
      console.log('SUCCESS: Served HTML is EXACTLY identical to the file on disk!');
    } else {
      console.log('DIFFERENCE DETECTED between served HTML and disk HTML!');
      let diffs = 0;
      for (let i = 0; i < Math.max(data.length, fileHtml.length); i++) {
        if (data[i] !== fileHtml[i]) {
          diffs++;
          if (diffs <= 5) {
            console.log(`Mismatch #${diffs} at char ${i}:`);
            console.log(`  Served: ${JSON.stringify(data.substring(i - 10, i + 20))}`);
            console.log(`  Disk:   ${JSON.stringify(fileHtml.substring(i - 10, i + 20))}`);
          }
        }
      }
      console.log('Total differences:', diffs);
    }
  });
});
