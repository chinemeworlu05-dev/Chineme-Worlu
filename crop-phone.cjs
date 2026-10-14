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

// In row 3, column 3:
// The black gap between phone 6 (Chat) and phone 9 (Saved) is around y = 1000..1200
// Let's find the orange top border of phone 9:
let phoneTop = 0;
for (let y = 1000; y < 1300; y++) {
  let hasOrange = false;
  for (let x = 1100; x < 1250; x++) {
    const r = rgba[y * stride + x * 4];
    const g = rgba[y * stride + x * 4 + 1];
    const b = rgba[y * stride + x * 4 + 2];
    if (r > 180 && g > 70 && b < 50) {
      hasOrange = true;
      break;
    }
  }
  if (hasOrange) {
    phoneTop = y;
    break;
  }
}

// Find bottom border
let phoneBottom = 0;
for (let y = 1750; y > 1400; y--) {
  let hasOrange = false;
  for (let x = 1100; x < 1250; x++) {
    const r = rgba[y * stride + x * 4];
    const g = rgba[y * stride + x * 4 + 1];
    const b = rgba[y * stride + x * 4 + 2];
    if (r > 180 && g > 70 && b < 50) {
      hasOrange = true;
      break;
    }
  }
  if (hasOrange) {
    phoneBottom = y;
    break;
  }
}

// Find left and right
let phoneLeft = 9999, phoneRight = 0;
for (let y = phoneTop; y <= phoneBottom; y++) {
  for (let x = 1000; x < 1400; x++) {
    const r = rgba[y * stride + x * 4];
    const g = rgba[y * stride + x * 4 + 1];
    const b = rgba[y * stride + x * 4 + 2];
    if (r > 20 || g > 20 || b > 20) {
      if (x < phoneLeft) phoneLeft = x;
      if (x > phoneRight) phoneRight = x;
    }
  }
}

console.log('Detected Phone 9 Bounds:', { phoneTop, phoneBottom, phoneLeft, phoneRight, w: phoneRight - phoneLeft + 1, h: phoneBottom - phoneTop + 1 });

const cropW = phoneRight - phoneLeft + 1;
const cropH = phoneBottom - phoneTop + 1;
const cropBuf = Buffer.alloc(cropW * cropH * 4);
for (let cy = 0; cy < cropH; cy++) {
  rgba.copy(cropBuf, cy * cropW * 4, (phoneTop + cy) * stride + phoneLeft * 4, (phoneTop + cy) * stride + (phoneRight + 1) * 4);
}
writePNG('public/case-study/saved.png', cropW, cropH, cropBuf);
console.log('Saved exact crop!');
