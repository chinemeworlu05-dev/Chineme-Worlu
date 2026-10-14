const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const { writePNG } = require('./png-util.cjs');

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function unfilterPNG(width, height, decompressed) {
  const bpp = 4; // RGBA 8-bit
  const stride = width * bpp;
  const rgba = Buffer.alloc(width * height * 4);

  let srcOffset = 0;
  for (let y = 0; y < height; y++) {
    const filterType = decompressed[srcOffset++];
    const lineOffset = y * stride;
    const prevLineOffset = (y - 1) * stride;

    for (let x = 0; x < stride; x++) {
      const raw = decompressed[srcOffset++];
      const a = (x >= bpp) ? rgba[lineOffset + x - bpp] : 0;
      const b = (y > 0) ? rgba[prevLineOffset + x] : 0;
      const c = (y > 0 && x >= bpp) ? rgba[prevLineOffset + x - bpp] : 0;

      let val;
      switch (filterType) {
        case 0: val = raw; break;
        case 1: val = (raw + a) & 0xff; break;
        case 2: val = (raw + b) & 0xff; break;
        case 3: val = (raw + Math.floor((a + b) / 2)) & 0xff; break;
        case 4: val = (raw + paeth(a, b, c)) & 0xff; break;
        default: val = raw;
      }
      rgba[lineOffset + x] = val;
    }
  }
  return rgba;
}

console.log('Reading Screen 2.png...');
const buf = fs.readFileSync('Screen 2.png');
let offset = 8;
let idatBuffers = [];
let width, height;

while (offset < buf.length) {
  const len = buf.readUInt32BE(offset);
  const type = buf.slice(offset + 4, offset + 8).toString();
  if (type === 'IHDR') {
    width = buf.readUInt32BE(offset + 8);
    height = buf.readUInt32BE(offset + 12);
  } else if (type === 'IDAT') {
    idatBuffers.push(buf.slice(offset + 8, offset + 8 + len));
  } else if (type === 'IEND') {
    break;
  }
  offset += 12 + len;
}

console.log('Inflating IDAT...');
const decompressed = zlib.inflateSync(Buffer.concat(idatBuffers));

console.log('Unfiltering PNG (1612 x 32768)...');
const fullRgba = unfilterPNG(width, height, decompressed);

if (!fs.existsSync('public/crops')) {
  fs.mkdirSync('public/crops', { recursive: true });
}

console.log('Generating slices...');
const step = 3200;
for (let y = 0; y < height; y += step) {
  const yEnd = Math.min(y + step, height);
  const cropH = yEnd - y;
  const cropRgba = Buffer.alloc(width * cropH * 4);
  fullRgba.copy(cropRgba, 0, y * width * 4, yEnd * width * 4);

  const outPath = `public/crops/slice_${y}_${yEnd}.png`;
  writePNG(outPath, width, cropH, cropRgba);
  console.log('Saved', outPath);
}
console.log('Done!');
