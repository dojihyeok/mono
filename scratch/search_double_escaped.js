const fs = require('fs');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const html = fs.readFileSync('scratch/head_app.html', 'utf8');

const manifestStr = extractScript(html, '__bundler/manifest');
const templateStr = extractScript(html, '__bundler/template');
const extResourcesStr = extractScript(html, '__bundler/ext_resources');

function checkSection(name, str) {
  if (!str) {
    console.log(`Section ${name} not found`);
    return;
  }
  // We want to find if the raw text contains three backslashes before a quote: \\\"
  // Wait, in a raw file content:
  // - \" is a single backslash and a quote.
  // - \\\" is three backslashes and a quote.
  // - \\\\\" is five backslashes and a quote.
  
  // Let's count how many times different backslash levels appear before a double quote
  const count1 = (str.match(/[^\\]\\"/g) || []).length; // matches a single backslash + quote (preceded by non-backslash)
  const count3 = (str.match(/[^\\]\\\\\\"/g) || []).length; // matches three backslashes + quote (preceded by non-backslash)
  const count5 = (str.match(/[^\\]\\\\\\\\\\"/g) || []).length; // matches five backslashes + quote (preceded by non-backslash)
  
  console.log(`Section ${name}:`);
  console.log(`  Single backslash \\" count: ${count1}`);
  console.log(`  Triple backslash \\\\\\" count: ${count3}`);
  console.log(`  Quintuple backslash \\\\\\\\\\" count: ${count5}`);
  
  // Let's find a sample of triple backslash
  const idx = str.indexOf('\\\\\\\"');
  if (idx !== -1) {
    console.log(`  Sample triple backslash context: ${JSON.stringify(str.substring(idx - 20, idx + 40))}`);
  }
}

checkSection('manifest', manifestStr);
checkSection('template', templateStr);
checkSection('ext_resources', extResourcesStr);
