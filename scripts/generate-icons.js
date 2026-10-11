import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPngBuffer(width, height, r, g, b) {
  // Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(2, 9); // color type 2: truecolor (RGB)
  ihdrData.writeUInt8(0, 10); // compression method 0
  ihdrData.writeUInt8(0, 11); // filter method 0
  ihdrData.writeUInt8(0, 12); // interlace method 0

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines: filter type 0 followed by width * 3 bytes
  const rowBytes = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowBytes);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter 0: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      // Draw a subtle border & center candlestick motif in green/navy
      const isBorder = x < 6 || x >= width - 6 || y < 6 || y >= height - 6;
      const isCandleWick = Math.abs(x - Math.floor(width / 2)) < Math.max(1, Math.floor(width / 60)) && y > height * 0.2 && y < height * 0.8;
      const isCandleBody = Math.abs(x - Math.floor(width / 2)) < Math.max(3, Math.floor(width / 12)) && y > height * 0.35 && y < height * 0.65;
      
      if (isBorder) {
        rawData[pixelOffset] = 37; // #2563EB Blue
        rawData[pixelOffset + 1] = 99;
        rawData[pixelOffset + 2] = 235;
      } else if (isCandleBody || isCandleWick) {
        rawData[pixelOffset] = 16; // #10B981 Emerald
        rawData[pixelOffset + 1] = 185;
        rawData[pixelOffset + 2] = 129;
      } else {
        rawData[pixelOffset] = r; // Deep navy #0B0F19
        rawData[pixelOffset + 1] = g;
        rawData[pixelOffset + 2] = b;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const buffer = Buffer.alloc(8 + length + 4);
  buffer.writeUInt32BE(length, 0);
  buffer.write(type, 4, 4, 'ascii');
  data.copy(buffer, 8);

  const crcBuffer = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = crc32(crcBuffer);
  buffer.writeUInt32BE(crc, 8 + length);
  return buffer;
}

// Standard IEEE 802.3 CRC32
function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const screenshotsDir = path.join(publicDir, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Generate pwa-192x192.png, pwa-512x512.png, apple-touch-icon.png (180x180), favicon.ico (32x32)
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPngBuffer(192, 192, 11, 15, 25));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPngBuffer(512, 512, 11, 15, 25));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPngBuffer(180, 180, 11, 15, 25));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPngBuffer(32, 32, 11, 15, 25));

// Play Store & PWA screenshots
fs.writeFileSync(path.join(screenshotsDir, 'screenshot-desktop.png'), createPngBuffer(640, 360, 11, 15, 25));
fs.writeFileSync(path.join(screenshotsDir, 'screenshot-mobile.png'), createPngBuffer(360, 640, 11, 15, 25));

console.log('PWA png icon assets and screenshots created successfully in /public');
