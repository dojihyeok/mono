const fs = require('fs');

const html = fs.readFileSync('new mono/MoNo 사용자 앱.html', 'utf8');

const targetScriptStart = html.indexOf('<script type="__bundler/template">');
const innerContentStart = targetScriptStart + '<script type="__bundler/template">'.length;
const nextClosingScript = html.indexOf('</script>', innerContentStart);

const templateContent = html.substring(innerContentStart, nextClosingScript);

console.log('Template content length:', templateContent.length);

// Check if templateContent contains "</script>" (case-insensitive)
const regex = /<\/script>/gi;
let match;
let found = 0;
while ((match = regex.exec(templateContent)) !== null) {
  found++;
  console.log(`Found unescaped </script> inside template at index ${match.index}:`);
  console.log(`  Context: ${JSON.stringify(templateContent.substring(match.index - 20, match.index + 20))}`);
}

console.log('Total unescaped </script> inside template:', found);
