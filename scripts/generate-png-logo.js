import fs from 'fs';
import zlib from 'zlib';

function createPng(width, height, drawFn) {
  const bytesPerPixel = 4;
  const rawData = Buffer.alloc((width * bytesPerPixel + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * bytesPerPixel + 1);
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function crc32(buf) {
    let c;
    const table = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[n] = c;
    }
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ (-1)) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crcBuf = Buffer.alloc(4 + len);
    crcBuf.write(type, 0, 4, 'ascii');
    data.copy(crcBuf, 4);
    buf.writeUInt32BE(crc32(crcBuf), 8 + len);
    return buf;
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // RGBA color type
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const chunks = [
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', deflated),
    makeChunk('IEND', Buffer.alloc(0))
  ];

  return Buffer.concat(chunks);
}

// Draw a crisp black and white circular legal seal with scales of justice
function drawSeal(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const rOuter = (w / 2) - 4;
  const rInner1 = rOuter - 8;
  const rInner2 = rOuter - 26;
  const rInner3 = rOuter - 32;

  // Background is transparent
  if (dist > rOuter) {
    return [0, 0, 0, 0];
  }

  // Outer primary ring
  if (dist <= rOuter && dist >= rOuter - 4) {
    return [0, 0, 0, 255];
  }
  // Gap
  if (dist < rOuter - 4 && dist > rInner1) {
    return [255, 255, 255, 255];
  }
  // Secondary thin ring
  if (dist <= rInner1 && dist >= rInner1 - 2) {
    return [0, 0, 0, 255];
  }

  // Text band
  if (dist < rInner1 - 2 && dist > rInner2) {
    // White background for text ring
    return [255, 255, 255, 255];
  }

  // Inner ring
  if (dist <= rInner2 && dist >= rInner2 - 3) {
    return [0, 0, 0, 255];
  }
  // Dash ring
  if (dist <= rInner3 && dist >= rInner3 - 2) {
    const angle = Math.atan2(dy, dx);
    const seg = Math.floor((angle + Math.PI) / (Math.PI / 16));
    if (seg % 2 === 0) return [0, 0, 0, 255];
    return [255, 255, 255, 255];
  }

  // Center field is white
  // Let's draw the center emblem: Pillar, Crossbeam, Scale pans, Open Codex
  // Normalizing coords in center: -1 to 1
  const nx = dx / (rInner3 - 10);
  const ny = dy / (rInner3 - 10);

  // Center vertical pillar
  if (Math.abs(nx) <= 0.06 && ny >= -0.65 && ny <= 0.5) {
    return [0, 0, 0, 255];
  }
  // Top finial circle
  const pDist = Math.sqrt(nx * nx + (ny + 0.68) * (ny + 0.68));
  if (pDist <= 0.08) {
    return [0, 0, 0, 255];
  }

  // Cross beam
  if (ny >= -0.52 && ny <= -0.46 && Math.abs(nx) <= 0.72) {
    return [0, 0, 0, 255];
  }

  // Left scale strings
  const leftPanX = -0.55;
  const rightPanX = 0.55;
  const panTopY = -0.1;
  const panBottomY = 0.05;

  // Left strings
  const dStrL1 = Math.abs((ny - (-0.48)) / (panTopY - (-0.48)) - (nx - (-0.7)) / ((-0.68) - (-0.7)));
  if (nx <= -0.45 && nx >= -0.72 && ny >= -0.48 && ny <= panTopY && (Math.abs(nx - (-0.55) - (ny - panTopY)*0.4) < 0.025 || Math.abs(nx - (-0.55) + (ny - panTopY)*0.4) < 0.025)) {
    return [0, 0, 0, 255];
  }
  // Left pan
  if (nx >= -0.72 && nx <= -0.38 && ny >= panTopY && ny <= panBottomY) {
    const panR = Math.sqrt(Math.pow((nx - leftPanX)/0.17, 2) + Math.pow((ny - panTopY)/0.15, 2));
    if (panR <= 1.0 && (panR >= 0.75 || ny >= panBottomY - 0.03)) {
      return [0, 0, 0, 255];
    }
  }

  // Right strings
  if (nx >= 0.45 && nx <= 0.72 && ny >= -0.48 && ny <= panTopY && (Math.abs(nx - (0.55) - (ny - panTopY)*0.4) < 0.025 || Math.abs(nx - (0.55) + (ny - panTopY)*0.4) < 0.025)) {
    return [0, 0, 0, 255];
  }
  // Right pan
  if (nx >= 0.38 && nx <= 0.72 && ny >= panTopY && ny <= panBottomY) {
    const panR = Math.sqrt(Math.pow((nx - rightPanX)/0.17, 2) + Math.pow((ny - panTopY)/0.15, 2));
    if (panR <= 1.0 && (panR >= 0.75 || ny >= panBottomY - 0.03)) {
      return [0, 0, 0, 255];
    }
  }

  // Base pedestal
  if (ny >= 0.5 && ny <= 0.62 && Math.abs(nx) <= 0.45) {
    return [0, 0, 0, 255];
  }
  if (ny >= 0.62 && ny <= 0.72 && Math.abs(nx) <= 0.6) {
    return [0, 0, 0, 255];
  }

  // Open Book of Law in center
  if (ny >= 0.15 && ny <= 0.45 && Math.abs(nx) <= 0.35) {
    // Left & right pages
    if (Math.abs(nx) <= 0.02) {
      return [0, 0, 0, 255]; // spine
    }
    // horizontal page lines
    const lineIndex = Math.floor((ny - 0.18) / 0.05);
    if (lineIndex >= 0 && lineIndex <= 4 && (ny - 0.18) % 0.05 < 0.015 && Math.abs(nx) >= 0.06 && Math.abs(nx) <= 0.30) {
      return [0, 0, 0, 255];
    }
    // border of pages
    if (ny <= 0.17 || ny >= 0.43 || Math.abs(nx) >= 0.33) {
      return [0, 0, 0, 255];
    }
  }

  return [255, 255, 255, 255];
}

const logo400 = createPng(400, 400, drawSeal);
const logo128 = createPng(128, 128, drawSeal);
const logo64 = createPng(64, 64, drawSeal);

fs.writeFileSync('./public/assets/barin-logo-bw.png', logo400);
fs.writeFileSync('./public/assets/barin-logo-hero.png', logo400);
fs.writeFileSync('./public/LOGO in PNG FILE.png', logo400);
fs.writeFileSync('./LOGO in PNG FILE.png', logo400);
fs.writeFileSync('./public/favicon.png', logo64);

console.log('Successfully generated clean black-and-white Barin Law Firm logo PNG assets.');
