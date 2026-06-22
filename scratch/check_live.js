const https = require('https');

https.get('https://mono.dojiung.com/mobile', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Fetched live page size:', data.length);
    
    function extractScript(html, type) {
      const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
      const match = html.match(regex);
      return match ? match[1].trim() : null;
    }

    const templateStr = extractScript(data, '__bundler/template');
    if (!templateStr) {
      console.log('No template found in live page!');
      return;
    }
    console.log('Live page template raw length:', templateStr.length);
    
    // Check if the templateStr contains triple backslashes: \\\"
    const count3 = (templateStr.match(/\\{3,}"/g) || []).length;
    console.log('Occurrences of 3+ backslashes followed by quote:', count3);
    
    // Print a sample of 3+ backslashes
    const match = templateStr.match(/\\{3,}"/);
    if (match) {
      const idx = match.index;
      console.log('Sample context of double escaping in live page:', JSON.stringify(templateStr.substring(idx - 20, idx + 40)));
    }
    
    try {
      const parsed = JSON.parse(templateStr);
      console.log('Successfully parsed template, length:', parsed.length);
      
      // Check if the parsed HTML string itself contains \" or \\"
      const countParsedBackslashQuote = (parsed.match(/\\"/g) || []).length;
      console.log('Occurrences of \\" in parsed template HTML:', countParsedBackslashQuote);
      if (countParsedBackslashQuote > 0) {
        const idx = parsed.indexOf('\\"');
        console.log('Sample of \\" in parsed HTML:', JSON.stringify(parsed.substring(idx - 20, idx + 40)));
      }
    } catch (e) {
      console.log('Failed to parse live template:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching live page:', err);
});
