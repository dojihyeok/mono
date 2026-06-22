const fs = require('fs');
const path = require('path');

const filePath = '/Users/yunhyeok/mono/new mono/MoNo 사용자 앱.html';
const htmlContent = fs.readFileSync(filePath, 'utf8');

// Simulate the DOM parser unpacking
const manifestEl = htmlContent.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/i);
const templateEl = htmlContent.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/i);
const extResEl = htmlContent.match(/<script type="__bundler\/ext_resources">([\s\S]*?)<\/script>/i);

if (!manifestEl || !templateEl) {
  console.error('Missing manifest or template script tags!');
  process.exit(1);
}

try {
  const manifest = JSON.parse(manifestEl[1]);
  let template = JSON.parse(templateEl[1]);
  console.log('Manifest and Template parsed successfully in simulation.');
  
  // Perform replacement simulation
  const uuids = Object.keys(manifest);
  const blobUrls = {};
  uuids.forEach(uuid => {
    blobUrls[uuid] = `blob:null/${uuid}`;
  });
  
  for (const uuid of uuids) {
    template = template.split(uuid).join(blobUrls[uuid]);
  }
  
  template = template.replace(/\s+integrity="[^"]*"/gi, '').replace(/\s+crossorigin="[^"]*"/gi, '');
  
  console.log('Unpacked template size:', template.length);
  
  // Find script tags inside the template and verify if they are valid
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let count = 0;
  while ((match = scriptRegex.exec(template)) !== null) {
    count++;
    const openingTag = match[0].substring(0, match[0].indexOf('>') + 1);
    console.log(`Inner Script #${count}: ${openingTag} (length: ${match[1].length})`);
    
    // Check if it's the component script and try to parse it
    if (openingTag.includes('text/x-dc') || match[1].includes('class Component')) {
      console.log('Component script found. Evaluating syntax...');
      try {
        // We can check if it parses as valid JS by wrapping it in a function if needed,
        // but note that it might use ES6 features or React.
        // Let's print the first 300 chars of the Component script to verify
        console.log(match[1].substring(0, 500));
      } catch (err) {
        console.error('Component script syntax error:', err);
      }
    }
  }
} catch (err) {
  console.error('Unpack failed in simulation:', err);
}
