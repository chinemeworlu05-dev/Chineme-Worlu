const fs = require('fs');
const zlib = require('zlib');
const { writePNG } = require('./png-util.cjs');

const buf = fs.readFileSync('public/crops/slice_28800_32000.png');
let offset = 8;
let idatBuffers = [];
let width, height;
while (offset < buf.length) {
  const len = buf.readUInt32BE(offset);
  const type = buf.slice(offset + 4, offset + 8).toString();
  if (type === 'IHDR') {
    width = buf.readUInt32BE(offset + 8);
    height = buf.readUInt32BE(offset + 12);
  } else if (type === 'IDAT') idatBuffers.push(buf.slice(offset + 8, offset + 8 + len));
  else if (type === 'IEND') break;
  offset += 12 + len;
}
const dec = zlib.inflateSync(Buffer.concat(idatBuffers));
const stride = width * 4;
const rgba = Buffer.alloc(width * height * 4);
let srcOff = 0;
for (let y = 0; y < height; y++) {
  const filter = dec[srcOff++];
  for (let x = 0; x < stride; x++) {
    const raw = dec[srcOff++];
    const a = (x >= 4) ? rgba[y * stride + x - 4] : 0;
    const b = (y > 0) ? rgba[(y - 1) * stride + x] : 0;
    const c = (y > 0 && x >= 4) ? rgba[(y - 1) * stride + x - 4] : 0;
    let v;
    if (filter === 0) v = raw;
    else if (filter === 1) v = (raw + a) & 0xff;
    else if (filter === 2) v = (raw + b) & 0xff;
    else if (filter === 3) v = (raw + Math.floor((a + b) / 2)) & 0xff;
    else if (filter === 4) {
      const p = a + b - c;
      const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      const pr = (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      v = (raw + pr) & 0xff;
    }
    rgba[y * stride + x] = v;
  }
}

// Phone 8 in middle: x: 550..800
// Phone 9 on right: x: 880..1150 or similar
// Let's scan y from 1200 to 1800 to find Phone 9 boundaries
let minX = 9999, maxX = 0, minY = 9999, maxY = 0;
// We know from earlier view that Phone 9 was inside x: 1039..1301
// And y was from top curve to bottom curve
for (let y = 1200; y < 1850; y++) {
  for (let x = 1035; x < 1310; x++) {
    const r = rgba[y * stride + x * 4];
    const g = rgba[y * stride + x * 4 + 1];
    const b = rgba[y * stride + x * 4 + 2];
    if (r > 20 || g > 20 || b > 20) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
console.log('Phone 9 exact bounds:', { minX, maxX, minY, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

const cropW = maxX - minX + 1;
const cropH = maxY - minY + 1;
const cropBuf = Buffer.alloc(cropW * cropH * 4);
for (let cy = 0; cy < cropH; cy++) {
  rgba.copy(cropBuf, cy * cropW * 4, (minY + cy) * stride + minX * 4, (minY + cy) * stride + (maxX + 1) * 4);
}
writePNG('public/case-study/saved.png', cropW, cropH, cropBuf);
console.log('Done!');
