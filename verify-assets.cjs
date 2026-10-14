const fs = require('fs');
const path = require('path');

const jsx = fs.readFileSync('src/components/HomeFindCaseStudy.jsx', 'utf8');
const regex = /src=["'](\/case-study\/[^"']+)["']/g;
let match;
const assets = new Set();
while ((match = regex.exec(jsx)) !== null) {
  assets.add(match[1]);
}

console.log(`Checking ${assets.size} referenced assets in HomeFindCaseStudy.jsx:`);
let allOk = true;
for (const rel of assets) {
  const diskPath = path.join('public', rel.replace(/^\//, ''));
  if (fs.existsSync(diskPath)) {
    const stats = fs.statSync(diskPath);
    console.log(`✓ ${rel} (${stats.size} bytes)`);
  } else {
    console.error(`✗ MISSING: ${rel} -> ${diskPath}`);
    allOk = false;
  }
}

if (allOk) {
  console.log('\nAll case study assets verified successfully!');
} else {
  console.error('\nSome assets are missing!');
  process.exit(1);
}
