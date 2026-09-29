import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

/**
 * Official JuriMbrella Corporate Branding Asset Generator
 * 
 * Official Brand Colors:
 * - Primary Deep Blue: #002D5B
 * - Ocean Blue: #0078CE
 * - Emerald Green: #2EAF4A
 * - Fresh Lime Green: #A8E063
 * - White: #FFFFFF
 * - Light Gray: #F4F7F9
 * - Medium Gray: #D9E1E8
 * - Charcoal: #17212B
 * - Golden Accent: #E8B949
 * 
 * Official Tagline: "Protection over every signature"
 */

/**
 * Generates the clean SVG inner content of the circular emblem.
 */
function getEmblemDefs(isDark, prefix = '') {
  return `
    <linearGradient id="${prefix}ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0078CE" />
      <stop offset="25%" stop-color="#A8E063" />
      <stop offset="50%" stop-color="#2EAF4A" />
      <stop offset="75%" stop-color="#E8B949" />
      <stop offset="100%" stop-color="#002D5B" />
    </linearGradient>

    <linearGradient id="${prefix}goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCE588" />
      <stop offset="50%" stop-color="#E8B949" />
      <stop offset="100%" stop-color="#D4AF37" />
    </linearGradient>

    <linearGradient id="${prefix}blueRibGrad" x1="0%" y1="100%" x2="50%" y2="0%">
      <stop offset="0%" stop-color="#002D5B" />
      <stop offset="50%" stop-color="#005A9C" />
      <stop offset="100%" stop-color="#0078CE" />
    </linearGradient>

    <linearGradient id="${prefix}greenLeafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1E7B34" />
      <stop offset="40%" stop-color="#2EAF4A" />
      <stop offset="100%" stop-color="#A8E063" />
    </linearGradient>

    <linearGradient id="${prefix}leafLeftGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1B6C2E" />
      <stop offset="50%" stop-color="#2EAF4A" />
      <stop offset="100%" stop-color="#9DE554" />
    </linearGradient>

    <linearGradient id="${prefix}sunburstGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="30%" stop-color="#FFF066" stop-opacity="0.95" />
      <stop offset="70%" stop-color="#A8E063" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#2EAF4A" stop-opacity="0" />
    </linearGradient>

    <linearGradient id="${prefix}anchorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0078CE" />
      <stop offset="50%" stop-color="#002D5B" />
      <stop offset="100%" stop-color="#0078CE" />
    </linearGradient>

    <radialGradient id="${prefix}discGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${isDark ? '#0C3B6E' : '#FFFFFF'}" />
      <stop offset="85%" stop-color="${isDark ? '#002D5B' : '#FFFFFF'}" />
      <stop offset="100%" stop-color="${isDark ? '#001833' : '#EDF3F9'}" />
    </radialGradient>

    <linearGradient id="${prefix}penNibGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#003D7A" />
      <stop offset="50%" stop-color="#002D5B" />
      <stop offset="100%" stop-color="#001833" />
    </linearGradient>

    <filter id="${prefix}emblemShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#002D5B" flood-opacity="${isDark ? '0.35' : '0.15'}" />
    </filter>

    <filter id="${prefix}sunGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  `;
}

function getEmblemShapes(isDark, prefix = '') {
  return `
  <!-- Outer Concentric Shield Rings -->
  <g filter="url(#${prefix}emblemShadow)">
    <!-- Outermost Multi-Tone Ring -->
    <circle cx="256" cy="256" r="246" fill="none" stroke="url(#${prefix}ringGrad)" stroke-width="8" />
    
    <!-- Thin Golden Accent Inset Ring -->
    <circle cx="256" cy="256" r="240" fill="none" stroke="url(#${prefix}goldAccent)" stroke-width="2.5" />
    
    <!-- Inner Deep Blue Framing Ring -->
    <circle cx="256" cy="256" r="236" fill="none" stroke="${isDark ? '#0078CE' : '#002D5B'}" stroke-width="5" />
    
    <!-- Main Circular Disc Canvas -->
    <circle cx="256" cy="256" r="232" fill="url(#${prefix}discGrad)" />
    
    <!-- Inner Soft Radial Ring -->
    <circle cx="256" cy="256" r="232" fill="none" stroke="${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,45,91,0.06)'}" stroke-width="1.5" />
  </g>

  <!-- Radiant Golden Sunburst Center -->
  <circle cx="256" cy="180" r="70" fill="url(#${prefix}sunburstGrad)" filter="url(#${prefix}sunGlow)" />

  <!-- The Open Sunburst Umbrella Canopy -->
  <g>
    <!-- Segment 1: Far Left Arch -->
    <path d="M 64,250 C 72,175 125,108 200,75 L 256,180 L 138,230 Z" fill="url(#${prefix}blueRibGrad)" opacity="0.95" />
    
    <!-- Segment 2: Mid-Left Outer -->
    <path d="M 132,232 L 256,180 L 195,78 C 172,92 145,116 122,148 Z" fill="url(#${prefix}greenLeafGrad)" />
    
    <!-- Segment 3: Mid-Left Inner -->
    <path d="M 195,78 L 256,180 L 228,68 C 216,72 205,76 195,78 Z" fill="url(#${prefix}blueRibGrad)" />

    <!-- Segment 4: Left-Center -->
    <path d="M 228,68 L 256,180 L 256,64 Z" fill="url(#${prefix}greenLeafGrad)" />

    <!-- Segment 5: Right-Center -->
    <path d="M 256,64 L 256,180 L 284,68 Z" fill="url(#${prefix}blueRibGrad)" />

    <!-- Segment 6: Mid-Right Inner -->
    <path d="M 284,68 L 256,180 L 317,78 C 306,75 295,71 284,68 Z" fill="url(#${prefix}greenLeafGrad)" />

    <!-- Segment 7: Mid-Right Outer -->
    <path d="M 317,78 L 256,180 L 380,232 C 390,195 365,130 317,78 Z" fill="url(#${prefix}blueRibGrad)" />

    <!-- Segment 8: Far Right Arch -->
    <path d="M 374,230 L 256,180 L 448,250 C 440,175 387,108 312,75 Z" fill="url(#${prefix}greenLeafGrad)" opacity="0.95" />

    <!-- Glossy Arc Highlights over Umbrella Canopy -->
    <path d="M 68,248 C 110,130 180,72 256,66 C 332,72 402,130 444,248 C 392,204 330,176 256,176 C 182,176 120,204 68,248 Z" 
          fill="none" stroke="${isDark ? '#A8E063' : '#FFFFFF'}" stroke-width="2.5" opacity="0.45" />

    <!-- Center Finial Knob (Apex of the Pen/Umbrella) -->
    <circle cx="256" cy="180" r="14" fill="#002D5B" stroke="${isDark ? '#0078CE' : '#FFFFFF'}" stroke-width="3" />
    <circle cx="256" cy="180" r="6" fill="#A8E063" />
  </g>

  <!-- The Fountain Pen Nib -->
  <g>
    <!-- Upper Neck / Shaft of Pen Nib -->
    <path d="M 247,192 L 265,192 L 268,228 L 244,228 Z" fill="url(#${prefix}penNibGrad)" />

    <!-- Pen Nib Head Silhouette -->
    <path d="M 244,228 L 222,254 C 220,272 232,306 256,356 C 280,306 292,272 290,254 L 268,228 Z" 
          fill="url(#${prefix}penNibGrad)" stroke="${isDark ? '#0078CE' : '#002D5B'}" stroke-width="2" stroke-linejoin="round" />

    <!-- Pen Nib Slit & Center Breather Hole -->
    <circle cx="256" cy="274" r="5" fill="${isDark ? '#002D5B' : '#FFFFFF'}" />
    <line x1="256" y1="279" x2="256" y2="354" stroke="${isDark ? '#002D5B' : '#FFFFFF'}" stroke-width="2.5" stroke-linecap="round" />

    <!-- Nib Shoulder Engraving Arches -->
    <path d="M 234,260 Q 256,278 278,260" fill="none" stroke="${isDark ? '#0078CE' : '#FFFFFF'}" stroke-width="1.8" opacity="0.7" />
  </g>

  <!-- Two Vibrant Green Leaves Flanking Nib -->
  <g>
    <!-- Left Leaf -->
    <path d="M 244,342 C 205,338 168,298 178,258 C 218,252 242,298 244,342 Z" 
          fill="url(#${prefix}leafLeftGrad)" stroke="#1B6C2E" stroke-width="1.5" />
    <!-- Left Leaf Center Vein -->
    <path d="M 244,342 Q 212,302 188,268" fill="none" stroke="#FFFFFF" stroke-width="1.8" opacity="0.65" stroke-linecap="round" />

    <!-- Right Leaf -->
    <path d="M 268,342 C 307,338 344,298 334,258 C 294,252 270,298 268,342 Z" 
          fill="url(#${prefix}greenLeafGrad)" stroke="#1B6C2E" stroke-width="1.5" />
    <!-- Right Leaf Center Vein -->
    <path d="M 268,342 Q 300,302 324,268" fill="none" stroke="#FFFFFF" stroke-width="1.8" opacity="0.65" stroke-linecap="round" />
  </g>

  <!-- Anchor Cradle & Flukes -->
  <g>
    <!-- Main Sweeping Anchor Crescent Beam -->
    <path d="M 152,306 C 180,366 220,388 256,388 C 292,388 332,366 360,306 C 330,344 290,364 256,364 C 222,364 182,344 152,306 Z" 
          fill="url(#${prefix}anchorGrad)" stroke="${isDark ? '#0078CE' : '#002D5B'}" stroke-width="1.5" />

    <!-- Left Fluke Arrowhead -->
    <path d="M 152,306 L 164,320 L 140,326 Z" fill="${isDark ? '#0078CE' : '#002D5B'}" />
    <!-- Right Fluke Arrowhead -->
    <path d="M 360,306 L 348,320 L 372,326 Z" fill="${isDark ? '#0078CE' : '#002D5B'}" />
  </g>
  `;
}

/**
 * Returns circular emblem SVG.
 */
function generateEmblemSvg({ isDark = false, size = 512 }) {
  const prefix = isDark ? 'emb_d_' : 'emb_l_';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}" fill="none">
  <defs>
    ${getEmblemDefs(isDark, prefix)}
  </defs>
  ${getEmblemShapes(isDark, prefix)}
</svg>`;
}

/**
 * Returns full official logo with emblem at the top, and wordmark + tagline cleanly positioned below it.
 * ABSOLUTELY ZERO OVERLAPPING: Generous spacing between emblem, wordmark, and tagline.
 */
function generateFullLogoSvg({ isDark = false, size = 512 }) {
  const prefix = isDark ? 'full_d_' : 'full_l_';
  const textColorJuri = isDark ? '#FFFFFF' : '#002D5B';
  const textColorMbrella = isDark ? '#A8E063' : '#2EAF4A';
  const taglineColor = isDark ? '#E2E8F0' : '#17212B';
  const descriptorColor = isDark ? '#38BDF8' : '#0078CE';
  const accentLineColor = '#2EAF4A';

  // Total viewBox height: 600
  // Emblem: center at (256, 175), size 320x320 (scale 320/512 = 0.625)
  // Emblem bounds: y from 15 to 335
  // Gap: 35px
  // Wordmark: y = 405
  // Gap: 20px
  // Tagline: y = 455
  // Sub-descriptor: y = 495
  const height = Math.round(size * (540 / 512));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 540" width="${size}" height="${height}" fill="none">
  <defs>
    ${getEmblemDefs(isDark, prefix)}
  </defs>

  <!-- Top Emblem (cleanly scaled and centered, ends at y = 335) -->
  <g transform="translate(96, 15) scale(0.625)">
    ${getEmblemShapes(isDark, prefix)}
  </g>

  <!-- Wordmark: JuriMbrella (cleanly separated at y = 405) -->
  <g id="wordmark" text-anchor="middle">
    <text x="256" y="405" font-family="'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="54" font-weight="800" letter-spacing="-1.2">
      <tspan fill="${textColorJuri}">Juri</tspan><tspan fill="${textColorMbrella}">Mbrella</tspan>
    </text>
  </g>

  <!-- Tagline: "Protection over every signature" (cleanly separated at y = 452) -->
  <g id="tagline" text-anchor="middle">
    <!-- Left Accent Line -->
    <line x1="50" y1="447" x2="95" y2="447" stroke="${accentLineColor}" stroke-width="2.5" stroke-linecap="round" />
    
    <!-- Tagline Text -->
    <text x="256" y="452" font-family="'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600" letter-spacing="0.2" fill="${taglineColor}">
      Protection over every signature
    </text>
    
    <!-- Right Accent Line -->
    <line x1="417" y1="447" x2="462" y2="447" stroke="${accentLineColor}" stroke-width="2.5" stroke-linecap="round" />
  </g>

  <!-- Statutory Service Descriptor (cleanly placed at y = 490) -->
  <text x="256" y="490" text-anchor="middle" font-family="'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" letter-spacing="2.8" fill="${descriptorColor}">
    PHILIPPINE eNOTARIZATION
  </text>
</svg>`;
}

/**
 * Returns horizontal lockup for navbar, header, and compact views.
 * Left: circular emblem. Right: Wordmark + tagline.
 * ABSOLUTELY ZERO OVERLAPPING: emblem and text are cleanly separated side-by-side.
 */
function generateHorizontalLogoSvg({ isDark = false, height = 48 }) {
  const prefix = isDark ? 'horiz_d_' : 'horiz_l_';
  const textColorJuri = isDark ? '#FFFFFF' : '#002D5B';
  const textColorMbrella = isDark ? '#A8E063' : '#2EAF4A';
  const taglineColor = isDark ? '#CBD5E1' : '#475569';
  const width = Math.round(height * 4.4);

  // viewBox: 440 x 100
  // Emblem at x = 10, y = 10, size = 80x80 (scale = 80/512 = 0.15625)
  // Emblem ends at x = 90
  // Gap = 22px
  // Wordmark starts at x = 112, y = 48
  // Tagline starts at x = 112, y = 74
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 100" width="${width}" height="${height}" fill="none">
  <defs>
    ${getEmblemDefs(isDark, prefix)}
  </defs>

  <!-- Small Emblem on Left (ends at x = 90) -->
  <g transform="translate(10, 10) scale(0.15625)">
    ${getEmblemShapes(isDark, prefix)}
  </g>

  <!-- Wordmark (x starts at 112) -->
  <text x="112" y="48" font-family="'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="800" letter-spacing="-0.8">
    <tspan fill="${textColorJuri}">Juri</tspan><tspan fill="${textColorMbrella}">Mbrella</tspan>
  </text>

  <!-- Tagline below wordmark (clean, non-overlapping) -->
  <line x1="112" y1="71" x2="128" y2="71" stroke="#2EAF4A" stroke-width="2" stroke-linecap="round" />
  <text x="135" y="75" font-family="'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="600" letter-spacing="0.2" fill="${taglineColor}">
    Protection over every signature
  </text>
  <line x1="344" y1="71" x2="360" y2="71" stroke="#2EAF4A" stroke-width="2" stroke-linecap="round" />
</svg>`;
}

async function buildAllAssets() {
  console.log('Generating official JuriMbrella branding assets...');

  const outputDirs = [
    path.resolve('src/assets/branding'),
    path.resolve('public/assets/branding'),
    path.resolve('public'),
  ];

  for (const d of outputDirs) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  }

  // 1. Generate SVGs
  const fullLightSvg = generateFullLogoSvg({ isDark: false, size: 512 });
  const fullDarkSvg = generateFullLogoSvg({ isDark: true, size: 512 });
  const emblemLightSvg = generateEmblemSvg({ isDark: false, size: 512 });
  const emblemDarkSvg = generateEmblemSvg({ isDark: true, size: 512 });
  const horizLightSvg = generateHorizontalLogoSvg({ isDark: false, height: 60 });
  const horizDarkSvg = generateHorizontalLogoSvg({ isDark: true, height: 60 });

  // Save SVGs to src/assets/branding and public/assets/branding
  const svgMap = [
    { name: 'jurimbrella-logo.svg', content: fullLightSvg },
    { name: 'jurimbrella-logo-white.svg', content: fullDarkSvg },
    { name: 'jurimbrella-emblem.svg', content: emblemLightSvg },
    { name: 'jurimbrella-emblem-white.svg', content: emblemDarkSvg },
    { name: 'jurimbrella-horizontal.svg', content: horizLightSvg },
    { name: 'jurimbrella-horizontal-white.svg', content: horizDarkSvg },
  ];

  for (const { name, content } of svgMap) {
    fs.writeFileSync(path.resolve('src/assets/branding', name), content, 'utf8');
    fs.writeFileSync(path.resolve('public/assets/branding', name), content, 'utf8');
  }

  // Also write favicon.svg
  fs.writeFileSync(path.resolve('public/favicon.svg'), emblemLightSvg, 'utf8');

  // 2. Render High-Resolution Raster PNGs using @resvg/resvg-js
  console.log('Rendering raster PNGs from vector SVG...');

  const resvgEmblem = new Resvg(emblemLightSvg, {
    fitTo: { mode: 'width', value: 1024 },
  });
  const emblemPngBuffer = resvgEmblem.render().asPng();

  const resvgFull = new Resvg(fullLightSvg, {
    fitTo: { mode: 'width', value: 1024 },
  });
  const fullPngBuffer = resvgFull.render().asPng();

  // Save main logo PNGs
  fs.writeFileSync(path.resolve('src/assets/branding/jurimbrella-emblem.png'), emblemPngBuffer);
  fs.writeFileSync(path.resolve('public/assets/branding/jurimbrella-emblem.png'), emblemPngBuffer);
  fs.writeFileSync(path.resolve('src/assets/branding/jurimbrella-logo.png'), fullPngBuffer);
  fs.writeFileSync(path.resolve('public/assets/branding/jurimbrella-logo.png'), fullPngBuffer);
  fs.writeFileSync(path.resolve('public/LOGO in PNG FILE.png'), fullPngBuffer);
  fs.writeFileSync(path.resolve('LOGO in PNG FILE.png'), fullPngBuffer);

  // 3. Generate Favicons and App Icons using Sharp
  console.log('Generating multi-size favicons (16x16, 32x32, 48x48, 180x180, 192x192, 512x512)...');

  const faviconSizes = [
    { size: 16, file: 'public/favicon-16x16.png' },
    { size: 32, file: 'public/favicon-32x32.png' },
    { size: 48, file: 'public/favicon-48x48.png' },
    { size: 180, file: 'public/apple-touch-icon.png' },
    { size: 192, file: 'public/icon-192.png' },
    { size: 512, file: 'public/icon-512.png' },
    { size: 32, file: 'public/favicon.png' },
    { size: 32, file: 'public/favicon.ico' },
  ];

  for (const { size, file } of faviconSizes) {
    await sharp(emblemPngBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.resolve(file));
  }

  console.log('Official JuriMbrella branding assets generated successfully with ZERO overlapping!');
}

buildAllAssets().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
