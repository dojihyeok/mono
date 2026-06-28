const fs = require('fs');
let html = fs.readFileSync('live_strategy.html', 'utf8');

// Remove the old lightbox HTML
html = html.replace(/<!-- ============================== LIGHTBOX ============================== -->[\s\S]*?<\/dialog>/, '');

// Remove the first openBigModal and openLightbox scripts
html = html.replace(/\/\/ Lightbox Zoom Logic for SVGs & Images[\s\S]*?window\.closeLightbox = function\(\) {[\s\S]*?\};/g, '');

// Remove the redundant bigModal HTML
html = html.replace(/<!-- Big Modal -->[\s\S]*?<\/div>[\s\r\n]*<\/body>/g, '</body>');

// Remove the redundant bigModal scripts
html = html.replace(/\/\/ Image Modal functionality[\s\S]*?window\.closeBigModal = function\(\) {[\s\S]*?\};/g, '');

fs.writeFileSync('live_strategy.html', html);
