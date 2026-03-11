/**
 * Generates minimal valid PNG placeholder files for development.
 * Each is a 1x1 pixel PNG with a distinctive color per state.
 */
const fs = require('fs');
const path = require('path');

// Minimal 1x1 PNG generator (RGBA)
function createPNG(r, g, b, a = 255) {
  // PNG file structure: signature + IHDR + IDAT + IEND
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk: 1x1, 8-bit RGBA
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(1, 0);  // width
  ihdrData.writeUInt32BE(1, 4);  // height
  ihdrData[8] = 8;               // bit depth
  ihdrData[9] = 6;               // color type (RGBA)
  const ihdr = createChunk('IHDR', ihdrData);

  // IDAT chunk: raw pixel data with zlib
  // For a 1x1 RGBA image: filter byte (0) + R G B A
  const rawData = Buffer.from([0, r, g, b, a]);
  // Wrap in zlib: header(78 01) + raw block + adler32
  const zlibHeader = Buffer.from([0x78, 0x01]);
  // Final block, raw, len=5
  const blockHeader = Buffer.from([0x01, 0x05, 0x00, 0xFA, 0xFF]);
  const adler = adler32(rawData);
  const adlerBuf = Buffer.alloc(4);
  adlerBuf.writeUInt32BE(adler, 0);
  const compressed = Buffer.concat([zlibHeader, blockHeader, rawData, adlerBuf]);
  const idat = createChunk('IDAT', compressed);

  // IEND chunk
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBuffer, data, crc]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function adler32(buf) {
  let a = 1, b = 0;
  for (let i = 0; i < buf.length; i++) {
    a = (a + buf[i]) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function writePNG(filePath, r, g, b) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, createPNG(r, g, b));
  console.log(`Created: ${filePath}`);
}

const base = path.join(__dirname, '..', 'src', 'assets');

// Character images
const charColors = {
  'idle': [74, 144, 217],
  'battle': [255, 99, 71],
  'hot': [255, 0, 0],
  'awaken': [255, 215, 0],
  'critical': [255, 255, 255],
  'fizzle': [128, 128, 128],
};

for (const [name, [r, g, b]] of Object.entries(charColors)) {
  writePNG(path.join(base, 'characters', 'sarah', `${name}.png`), r, g, b);
}

// Beast images
const beastSizes = ['chibi', 'medium', 'large', 'fullscreen'];
for (const size of beastSizes) {
  writePNG(path.join(base, 'characters', 'sarah', `beast-${size}.png`), 255, 140, 0);
}

// Backgrounds
const bgColors = {
  'calm': [20, 20, 40],
  'sense': [30, 30, 50],
  'quickening': [60, 20, 20],
  'clash': [80, 10, 10],
  'intense': [120, 0, 0],
  'awakening': [150, 100, 0],
  'critical': [200, 200, 200],
};

for (const [name, [r, g, b]] of Object.entries(bgColors)) {
  writePNG(path.join(base, 'backgrounds', `${name}.png`), r, g, b);
}

// App icon and splash (required by app.json)
writePNG(path.join(__dirname, '..', 'assets', 'icon.png'), 255, 100, 50);

// Placeholder Lottie JSON (minimal valid lottie)
const minimalLottie = JSON.stringify({
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 30,
  w: 100,
  h: 100,
  nm: "placeholder",
  layers: []
});

ensureDir(path.join(base, 'effects', 'placeholder.json'));
fs.writeFileSync(path.join(base, 'effects', 'placeholder.json'), minimalLottie);
console.log('Created: placeholder lottie');

console.log('\nAll placeholder assets generated!');
