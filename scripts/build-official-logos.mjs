import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

/**
 * Generates the official monochrome black-and-white BARIN ENF logo assets.
 * Preserves the emblem, scales of justice, letter "B", classical column,
 * document, padlock, concentric rings, diamonds, and exact typography.
 * True monochrome: black on transparent for light theme, white on transparent for dark theme.
 */

function generateSvgLogo({ isEmblemOnly = false, isWhite = false }) {
  const primaryColor = isWhite ? '#FFFFFF' : '#000000';
  const secondaryColor = isWhite ? '#E5E5E5' : '#1A1A1A';
  const documentFill = isWhite ? '#171717' : '#FFFFFF';
  const keyholeFill = isWhite ? '#171717' : '#FFFFFF';

  // SVG emblem definitions
  const emblemSvg = `
    <!-- Top Apex Diamond (12 o'clock) -->
    <polygon points="500,55 522,112 500,168 478,112" fill="${primaryColor}" />

    <!-- Bottom Apex Diamond (6 o'clock) -->
    <polygon points="500,642 522,698 500,755 478,698" fill="${primaryColor}" />

    <!-- Outer Circular Ring (Concentric) -->
    <circle cx="500" cy="405" r="295" fill="none" stroke="${primaryColor}" stroke-width="24" />

    <!-- Inner Circular Ring (Concentric) -->
    <circle cx="500" cy="405" r="258" fill="none" stroke="${primaryColor}" stroke-width="17" />

    <!-- Scales of Justice: Arched Balance Beam -->
    <g id="scales-beam">
      <!-- Center Pivot Top Cap -->
      <path d="M 488,272 C 488,260 512,260 512,272 L 506,280 L 494,280 Z" fill="${primaryColor}" />
      <!-- Gracefully Arched Crossbeam -->
      <path d="M 276,336 C 350,270 435,274 500,278 C 565,274 650,270 724,336" 
            fill="none" stroke="${primaryColor}" stroke-width="13" stroke-linecap="round" />
      <!-- Left Beam End Knob -->
      <circle cx="276" cy="336" r="9" fill="${primaryColor}" />
      <!-- Right Beam End Knob -->
      <circle cx="724" cy="336" r="9" fill="${primaryColor}" />
    </g>

    <!-- Left Scale of Justice (Cords & Pan) -->
    <g id="left-scale">
      <line x1="276" y1="336" x2="204" y2="456" stroke="${primaryColor}" stroke-width="3.5" />
      <line x1="276" y1="336" x2="276" y2="458" stroke="${primaryColor}" stroke-width="3" />
      <line x1="276" y1="336" x2="348" y2="456" stroke="${primaryColor}" stroke-width="3.5" />
      <!-- Left Pan Saucer -->
      <path d="M 194,456 Q 276,498 358,456 Q 276,480 194,456 Z" fill="${primaryColor}" />
      <path d="M 194,456 Q 276,498 358,456" fill="none" stroke="${primaryColor}" stroke-width="7" stroke-linecap="round" />
    </g>

    <!-- Right Scale of Justice (Cords & Pan) -->
    <g id="right-scale">
      <line x1="724" y1="336" x2="652" y2="456" stroke="${primaryColor}" stroke-width="3.5" />
      <line x1="724" y1="336" x2="724" y2="458" stroke="${primaryColor}" stroke-width="3" />
      <line x1="724" y1="336" x2="796" y2="456" stroke="${primaryColor}" stroke-width="3.5" />
      <!-- Right Pan Saucer -->
      <path d="M 642,456 Q 724,498 806,456 Q 724,480 642,456 Z" fill="${primaryColor}" />
      <path d="M 642,456 Q 724,498 806,456" fill="none" stroke="${primaryColor}" stroke-width="7" stroke-linecap="round" />
    </g>

    <!-- Classical Column (Left Backbone of "B") -->
    <g id="classical-column">
      <!-- Abacus Top Molding -->
      <path d="M 390,210 L 536,210 C 540,210 542,212 542,216 L 542,228 L 384,228 L 384,216 C 384,212 386,210 390,210 Z" fill="${primaryColor}" />
      <!-- Ionic Volutes (Scrolls) -->
      <circle cx="398" cy="242" r="16" fill="none" stroke="${primaryColor}" stroke-width="7" />
      <circle cx="528" cy="242" r="16" fill="none" stroke="${primaryColor}" stroke-width="7" />
      <rect x="402" y="234" width="122" height="9" rx="3" fill="${primaryColor}" />
      <rect x="414" y="246" width="98" height="8" rx="2" fill="${primaryColor}" />

      <!-- Column Shaft: 4 Vertical Ribs with Fluting Channels -->
      <rect x="424" y="256" width="14" height="340" rx="3.5" fill="${primaryColor}" />
      <rect x="444" y="256" width="14" height="340" rx="3.5" fill="${primaryColor}" />
      <rect x="464" y="256" width="14" height="340" rx="3.5" fill="${primaryColor}" />
      <rect x="484" y="256" width="14" height="340" rx="3.5" fill="${primaryColor}" />

      <!-- Column Base Pedestal -->
      <rect x="410" y="598" width="106" height="11" rx="2" fill="${primaryColor}" />
      <rect x="394" y="611" width="138" height="15" rx="3" fill="${primaryColor}" />
    </g>

    <!-- Letter "B" Serif Bowls (Didone High Contrast) -->
    <g id="letter-b-bowls">
      <!-- Upper Bowl -->
      <path d="M 498,216 C 565,216 630,238 630,310 C 630,362 584,392 506,395 C 496,395 492,393 492,383 C 550,380 588,354 588,310 C 588,254 538,236 498,236 Z" 
            fill="${primaryColor}" />
      <!-- Lower Bowl with Sweeping Tail -->
      <path d="M 498,392 C 590,392 648,424 648,500 C 648,566 592,610 472,616 C 448,617 348,617 348,605 C 362,605 402,603 424,603 C 552,597 604,554 604,498 C 604,440 550,408 498,408 Z" 
            fill="${primaryColor}" />
    </g>

    <!-- Foreground Legal Document (Dog-Eared) -->
    <g id="legal-document">
      <!-- Document Base Sheet with White Fill to Occlude Elements Behind -->
      <path d="M 440,450 L 536,450 L 572,486 L 572,610 C 572,615 567,620 562,620 L 450,620 C 444,620 440,615 440,610 Z" 
            fill="${documentFill}" stroke="${primaryColor}" stroke-width="8" stroke-linejoin="round" />
      <!-- Folded Dog-Ear Corner -->
      <path d="M 536,450 L 536,486 L 572,486 Z" fill="${primaryColor}" />
      <!-- Text Lines on Document -->
      <rect x="466" y="500" width="58" height="7.5" rx="3.75" fill="${primaryColor}" />
      <rect x="466" y="524" width="52" height="7.5" rx="3.75" fill="${primaryColor}" />
      <rect x="466" y="548" width="48" height="7.5" rx="3.75" fill="${primaryColor}" />
      <rect x="466" y="572" width="42" height="7.5" rx="3.75" fill="${primaryColor}" />
    </g>

    <!-- Closed Padlock (Security / Cryptographic Lock) -->
    <g id="security-padlock">
      <!-- Padlock Shackle -->
      <path d="M 548,554 L 548,525 C 548,510 560,498 575,498 C 590,498 602,510 602,525 L 602,554" 
            fill="none" stroke="${primaryColor}" stroke-width="9.5" stroke-linecap="round" />
      <!-- Padlock Body -->
      <rect x="532" y="548" width="86" height="72" rx="14" fill="${primaryColor}" stroke="${documentFill}" stroke-width="3.5" />
      <!-- Padlock Keyhole -->
      <circle cx="575" cy="576" r="7.5" fill="${keyholeFill}" />
      <polygon points="570,576 580,576 582,598 568,598" fill="${keyholeFill}" />
    </g>
  `;

  if (isEmblemOnly) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="150 40 700 730" width="100%" height="100%" fill="none">
      ${emblemSvg}
    </svg>`;
  }

  // Full Logo with Official Typography: "BARIN ENF" and "ELECTRONIC NOTARIZATION FACILITY"
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%" fill="none">
    <defs>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@800&amp;family=Plus+Jakarta+Sans:wght@700&amp;display=swap');
        .serif-brand {
          font-family: 'Playfair Display', 'Times New Roman', 'FreeSerif', Georgia, serif;
          font-weight: 800;
          letter-spacing: 5px;
        }
        .sans-facility {
          font-family: 'Plus Jakarta Sans', 'Liberation Sans', Arial, Helvetica, sans-serif;
          font-weight: 700;
          letter-spacing: 6.5px;
        }
      </style>
    </defs>

    ${emblemSvg}

    <!-- Brand Header: BARIN ENF -->
    <text x="500" y="872" class="serif-brand" font-size="112" fill="${primaryColor}" text-anchor="middle">
      BARIN ENF
    </text>

    <!-- Subtitle: Horizontal Rules and "ELECTRONIC NOTARIZATION FACILITY" -->
    <!-- Left Accent Rule -->
    <rect x="50" y="910" width="94" height="5" rx="2.5" fill="${primaryColor}" />
    
    <!-- Subtitle Text -->
    <text x="500" y="918" class="sans-facility" font-size="24" fill="${primaryColor}" text-anchor="middle">
      ELECTRONIC NOTARIZATION FACILITY
    </text>

    <!-- Right Accent Rule -->
    <rect x="856" y="910" width="94" height="5" rx="2.5" fill="${primaryColor}" />
  </svg>`;
}

async function buildAllLogos() {
  console.log('Generating master vector SVG logo files...');

  const logoSvgBW = generateSvgLogo({ isEmblemOnly: false, isWhite: false });
  const emblemSvgBW = generateSvgLogo({ isEmblemOnly: true, isWhite: false });
  const logoSvgWhite = generateSvgLogo({ isEmblemOnly: false, isWhite: true });
  const emblemSvgWhite = generateSvgLogo({ isEmblemOnly: true, isWhite: true });

  fs.mkdirSync('src/assets/branding', { recursive: true });
  fs.mkdirSync('public/assets', { recursive: true });

  // Save SVGs
  fs.writeFileSync('src/assets/branding/barin-enf-logo-bw.svg', logoSvgBW);
  fs.writeFileSync('src/assets/branding/barin-enf-emblem-bw.svg', emblemSvgBW);
  fs.writeFileSync('src/assets/branding/barin-enf-logo-white.svg', logoSvgWhite);
  fs.writeFileSync('src/assets/branding/barin-enf-emblem-white.svg', emblemSvgWhite);

  fs.writeFileSync('public/assets/barin-logo-bw.svg', logoSvgBW);
  fs.writeFileSync('public/assets/barin-emblem-bw.svg', emblemSvgBW);
  fs.writeFileSync('public/favicon.svg', emblemSvgBW);

  console.log('SVGs created. Now rendering high-fidelity PNG & WebP assets with resvg & sharp...');

  // Helper to rasterize SVG via resvg
  function renderSvg(svgStr, targetWidth = 1024) {
    const resvg = new Resvg(svgStr, {
      fitTo: { mode: 'width', value: targetWidth },
      font: { loadSystemFonts: true },
    });
    return resvg.render().asPng();
  }

  // 1. Full Logo (Black on Transparent)
  const fullLogoPng1024 = renderSvg(logoSvgBW, 1024);
  fs.writeFileSync('src/assets/branding/barin-enf-logo-bw.png', fullLogoPng1024);
  console.log('✓ src/assets/branding/barin-enf-logo-bw.png (1024x1024)');

  // 1b. Full Logo WebP (Optimized for web)
  await sharp(fullLogoPng1024)
    .webp({ quality: 95 })
    .toFile('src/assets/branding/barin-enf-logo-bw.webp');
  console.log('✓ src/assets/branding/barin-enf-logo-bw.webp');

  // 2. Emblem-Only (Black on Transparent)
  const emblemPng800 = renderSvg(emblemSvgBW, 800);
  fs.writeFileSync('src/assets/branding/barin-enf-emblem-bw.png', emblemPng800);
  console.log('✓ src/assets/branding/barin-enf-emblem-bw.png (800x800)');

  await sharp(emblemPng800)
    .webp({ quality: 95 })
    .toFile('src/assets/branding/barin-enf-emblem-bw.webp');
  console.log('✓ src/assets/branding/barin-enf-emblem-bw.webp');

  // 3. Dark Mode Variants (White on Transparent)
  const fullLogoWhite1024 = renderSvg(logoSvgWhite, 1024);
  fs.writeFileSync('src/assets/branding/barin-enf-logo-white.png', fullLogoWhite1024);
  await sharp(fullLogoWhite1024)
    .webp({ quality: 95 })
    .toFile('src/assets/branding/barin-enf-logo-white.webp');

  const emblemWhite800 = renderSvg(emblemSvgWhite, 800);
  fs.writeFileSync('src/assets/branding/barin-enf-emblem-white.png', emblemWhite800);
  await sharp(emblemWhite800)
    .webp({ quality: 95 })
    .toFile('src/assets/branding/barin-enf-emblem-white.webp');
  console.log('✓ Dark mode white logo and emblem variants generated');

  // 4. Favicons & Apple Touch Icon
  // Favicon 32x32 PNG
  await sharp(emblemPng800)
    .resize(32, 32)
    .png()
    .toFile('public/favicon-32x32.png');
  console.log('✓ public/favicon-32x32.png');

  // Favicon 64x64 PNG (for public/favicon.png fallback)
  await sharp(emblemPng800)
    .resize(64, 64)
    .png()
    .toFile('public/favicon.png');
  console.log('✓ public/favicon.png');

  // Apple Touch Icon: 180x180 with clean safe padding on white background
  await sharp(emblemPng800)
    .resize(156, 156, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .extend({
      top: 12,
      bottom: 12,
      left: 12,
      right: 12,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('✓ public/apple-touch-icon.png (180x180)');

  // 5. Backwards Compatibility Copies in public/
  fs.copyFileSync('src/assets/branding/barin-enf-logo-bw.png', 'public/assets/barin-logo-bw.png');
  fs.copyFileSync('src/assets/branding/barin-enf-logo-bw.png', 'public/assets/barin-logo-hero.png');
  fs.copyFileSync('src/assets/branding/barin-enf-logo-bw.png', 'public/LOGO in PNG FILE.png');
  fs.copyFileSync('src/assets/branding/barin-enf-logo-bw.png', 'LOGO in PNG FILE.png');

  console.log('\n=============================================');
  console.log('ALL BARIN ENF BRANDING ASSETS BUILT CLEANLY!');
  console.log('=============================================\n');
}

buildAllLogos().catch((err) => {
  console.error('Error generating logos:', err);
  process.exit(1);
});
