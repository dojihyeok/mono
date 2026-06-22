const fs = require('fs');

const originalHtml = fs.readFileSync('scratch/original_app.html', 'utf8');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const templateStr = extractScript(originalHtml, '__bundler/template');
const template = JSON.parse(templateStr);

const serialized = JSON.stringify(template);

// Check if the original template contains literal "</script>"
console.log('Original templateStr contains "</script>":', templateStr.toLowerCase().includes('</script>'));
console.log('Original templateStr contains "<\\u002Fscript>":', templateStr.toLowerCase().includes('<\\u002fscript>'));

// Let's check what occurrences of script tag endings exist in the serialized template
const regex = /<\/script>/gi;
let match;
console.log('Occurrences of </script> in serialized template (before replacement):');
while ((match = regex.exec(serialized)) !== null) {
  console.log(`  Found at index ${match.index}: ${match[0]} (context: ${serialized.substring(match.index - 10, match.index + 20)})`);
}

const replaced = serialized.replace(/<\/script>/gi, '<\\/script>');
console.log('Replaced contains "</script>":', replaced.toLowerCase().includes('</script>'));
// Wait, is there any other way a script tag can close?
// e.g. "</script " or with space?
const regexSpace = /<\/script\s*>/gi;
while ((match = regexSpace.exec(serialized)) !== null) {
  console.log(`  Found space-closing at index ${match.index}: ${match[0]}`);
}
