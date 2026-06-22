const fs = require('fs');
const zlib = require('zlib');

const html = fs.readFileSync('new mono/MoNo 사용자 앱.html', 'utf8');

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

const manifestStr = extractScript(html, '__bundler/manifest');
const manifest = JSON.parse(manifestStr);

const assetUuid = '1e847a8f-1a09-40e7-bdca-f3208f8ee4d8';
const assetEntry = manifest[assetUuid];

if (!assetEntry) {
  console.error(`Asset ${assetUuid} not found in manifest!`);
  process.exit(1);
}

const compressedBytes = Buffer.from(assetEntry.data, 'base64');
const decompressedBytes = zlib.gunzipSync(compressedBytes);
const assetCode = decompressedBytes.toString('utf8');

fs.writeFileSync('scratch/extracted_asset.js', assetCode, 'utf8');
console.log('Decompressed asset size:', assetCode.length);

// Search for M12 or SVG attributes
let lastIndex = 0;
let count = 0;
while (true) {
  const idx = assetCode.indexOf('M12', lastIndex);
  if (idx === -1) break;
  count++;
  if (count <= 5) {
    console.log(`Found M12 at index ${idx}:`);
    console.log(`  Context: ${JSON.stringify(assetCode.substring(idx - 20, idx + 40))}`);
  }
  lastIndex = idx + 1;
}
console.log('Total M12 in asset:', count);
