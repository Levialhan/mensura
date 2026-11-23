import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/**
 * Generates Play Console store assets: a 512x512 icon and a 1024x500
 * feature graphic. Run with: node scripts/generate-store-assets.mjs
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const store = join(root, 'store');

// 1) Play Console requires exactly a 512x512 icon.
await sharp(join(root, 'assets', 'icon.png'))
  .resize(512, 512)
  .png()
  .toFile(join(store, 'play-icon-512.png'));
console.log('wrote store/play-icon-512.png');

// 2) Feature graphic (1024x500).
const GLYPH = `
  <rect x="162" y="412" width="700" height="200" rx="100" fill="#FFFFFF"/>
  <rect x="300" y="484" width="6" height="56" rx="3" fill="#94A3B8"/>
  <rect x="360" y="464" width="6" height="96" rx="3" fill="#94A3B8"/>
  <rect x="664" y="464" width="6" height="96" rx="3" fill="#94A3B8"/>
  <rect x="724" y="484" width="6" height="56" rx="3" fill="#94A3B8"/>
  <circle cx="512" cy="512" r="60" fill="#34D399" stroke="#059669" stroke-width="8"/>
  <circle cx="492" cy="492" r="16" fill="#A7F3D0"/>
`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1D2B53"/>
      <stop offset="1" stop-color="#0B1220"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#bg)"/>
  <g transform="translate(30 45) scale(0.4)">${GLYPH}</g>
  <text x="430" y="225" font-family="Arial, sans-serif" font-size="96" font-weight="700" fill="#FFFFFF">Mensura</text>
  <text x="432" y="278" font-family="Arial, sans-serif" font-size="28" fill="#AEB9CF">Your pocket measurement toolkit</text>
  <text x="432" y="320" font-family="Arial, sans-serif" font-size="20" fill="#34D399">Offline · No account · No tracking</text>
</svg>`;

await sharp(Buffer.from(svg)).resize(1024, 500, { fit: 'fill' }).png().toFile(join(store, 'feature-graphic.png'));
console.log('wrote store/feature-graphic.png');
