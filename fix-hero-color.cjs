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

const { width: fullW, height: fullH, rgba: fullRgba, stride: fullStride } = readFullPNG('Screen 2.png');

// Crop rect: y1=215, y2=905, x1=850, x2=1580
const x1 = 850, y1 = 215, x2 = 1580, y2 = 905;
const w = x2 - x1 + 1;
const h = y2 - y1 + 1;
const rgba = Buffer.alloc(w * h * 4);
for (let y = 0; y < h; y++) {
  fullRgba.copy(rgba, y * w * 4, (y1 + y) * fullStride + x1 * 4, (y1 + y) * fullStride + (x2 + 1) * 4);
}
const stride = w * 4;
console.log('Cropped fresh hero-phones:', w, 'x', h);

// Target bg color from corner (0,0)
const bgR = rgba[0], bgG = rgba[1], bgB = rgba[2];
console.log('Background color:', bgR, bgG, bgB);

// Flood fill starting from all 4 borders
const visited = new Uint8Array(w * h);
const queue = [];

function pushIfBg(x, y) {
  if (x < 0 || x >= w || y < 0 || y >= h) return;
  const idx = y * w + x;
  if (visited[idx]) return;
  const pix = y * stride + x * 4;
  const r = rgba[pix], g = rgba[pix + 1], b = rgba[pix + 2];
  const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
  if (dist < 22) {
    visited[idx] = 1;
    queue.push(x, y);
  }
}

// Add all border pixels to queue if matching bg
for (let x = 0; x < w; x++) {
  pushIfBg(x, 0);
  pushIfBg(x, h - 1);
}
for (let y = 0; y < h; y++) {
  pushIfBg(0, y);
  pushIfBg(w - 1, y);
}

let head = 0;
while (head < queue.length) {
  const qx = queue[head++];
  const qy = queue[head++];

  // Make transparent
  const pix = qy * stride + qx * 4;
  rgba[pix + 3] = 0;

  // Neighbors
  pushIfBg(qx + 1, qy);
  pushIfBg(qx - 1, qy);
  pushIfBg(qx, qy + 1);
  pushIfBg(qx, qy - 1);
}

console.log('Flood filled', head / 2, 'outer background pixels to transparent');
writePNG('public/case-study/hero-phones.png', w, h, rgba);
console.log('Saved pristine hero-phones.png');
