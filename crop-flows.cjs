const fs = require('fs');
const zlib = require('zlib');
const { writePNG } = require('./png-util.cjs');

function readFullPNG(filePath) {
  const buf = fs.readFileSync(filePath);
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
  return { width, height, rgba, stride };
}

console.log('Loading Screen 2.png for flow crops...');
const { width, height, rgba, stride } = readFullPNG('Screen 2.png');

function cropRect(outName, x1, y1, x2, y2) {
  const w = x2 - x1 + 1;
  const h = y2 - y1 + 1;
  const outBuf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    rgba.copy(outBuf, y * w * 4, (y1 + y) * stride + x1 * 4, (y1 + y) * stride + (x2 + 1) * 4);
  }
  writePNG(outName, w, h, outBuf);
  console.log('Cropped', outName, w + 'x' + h);
}

// Let's crop:
// 1. Flow 1: in Screen 2.png, around y = 17500 to 19200
cropRect('public/case-study/flow-1.png', 100, 17400, 1512, 19180);

// 2. Flow 2: in Screen 2.png, around y = 19200 to 21650
cropRect('public/case-study/flow-2.png', 100, 19220, 1512, 21650);

// 3. Flow 3: in Screen 2.png, around y = 21650 to 23550
cropRect('public/case-study/flow-3.png', 100, 21700, 1512, 23550);

// 4. Hero Phones cluster from hero banner (x: 800..1550, y: 100..1000)
cropRect('public/case-study/hero-phones.png', 850, 95, 1580, 960);

console.log('All crops complete!');
