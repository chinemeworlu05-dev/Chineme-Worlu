const fs = require('fs');
const zlib = require('zlib');
const { writePNG } = require('./png-util.cjs');

function readPNG(filePath) {
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

const inputPath = 'C:/Users/USER/.gemini/antigravity-ide/brain/5c762aeb-34e8-43f1-93d8-0a1370f9e221/.user_uploaded/media_1791790697069.png';
const { width, height, rgba, stride } = readPNG(inputPath);

function cropBox(outName, x1, y1, x2, y2, scale = 3) {
  const w = x2 - x1;
  const h = y2 - y1;
  const outW = w * scale;
  const outH = h * scale;
  const outBuf = Buffer.alloc(outW * outH * 4);
  
  for (let dy = 0; dy < outH; dy++) {
    const sy = y1 + Math.floor(dy / scale);
    for (let dx = 0; dx < outW; dx++) {
      const sx = x1 + Math.floor(dx / scale);
      const srcIdx = sy * stride + sx * 4;
      const dstIdx = (dy * outW + dx) * 4;
      rgba.copy(outBuf, dstIdx, srcIdx, srcIdx + 4);
    }
  }
  writePNG('public/merit/slices/' + outName, outW, outH, outBuf);
}

cropBox('prob_card1.png', 75, 200, 145, 245, 4);
cropBox('prob_card2.png', 148, 200, 218, 245, 4);
cropBox('prob_card3.png', 220, 200, 290, 245, 4);
cropBox('prob_card4.png', 0, 250, 105, 295, 4);
cropBox('prob_card5.png', 110, 250, 175, 295, 4);

cropBox('sol_card1.png', 0, 420, 90, 465, 4);
cropBox('sol_card2.png', 93, 420, 175, 465, 4);
cropBox('sol_card3.png', 178, 420, 252, 465, 4);
cropBox('sol_card4.png', 137, 470, 212, 515, 4);
cropBox('sol_card5.png', 215, 470, 295, 515, 4);

cropBox('screens_header.png', 25, 630, 275, 665, 4);

const logoPNG = readPNG('The Logos/Merif MFB Logo.png');
const lW = Math.round(logoPNG.height * 0.96);
const lH = logoPNG.height;
const lBuf = Buffer.alloc(lW * lH * 4);
for (let y = 0; y < lH; y++) {
  logoPNG.rgba.copy(lBuf, y * lW * 4, y * logoPNG.stride, y * logoPNG.stride + lW * 4);
}
writePNG('public/merit/merit_icon.png', lW, lH, lBuf);
console.log('Done detail extraction and merit_icon.png');
