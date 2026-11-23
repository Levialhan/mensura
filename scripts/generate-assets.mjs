import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/**
 * Generates Mensura's icon + splash assets from a single SVG "spirit level"
 * glyph. Run with: node scripts/generate-assets.mjs
 *
 * The glyph is drawn in a 1024x1024 coordinate space and scaled/translated
 * per asset so it stays centered and within the adaptive-icon safe zone.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'assets');

const NAVY_TOP = '#1D2B53';
const NAVY_BOTTOM = '#0B1220';

// The "spirit level": a white capsule with a green bubble and tick marks.
const GLYPH = `
  <rect x="162" y="412" width="700" height="200" rx="100" fill="#FFFFFF"/>
  <rect x="300" y="484" width="6" height="56" rx="3" fill="#94A3B8"/>
  <rect x="360" y="464" width="6" height="96" rx="3" fill="#94A3B8"/>
  <rect x="664" y="464" width="6" height="96" rx="3" fill="#94A3B8"/>
  <rect x="724" y="484" width="6" height="56" rx="3" fill="#94A3B8"/>
  <circle cx="512" cy="512" r="60" fill="#34D399" stroke="#059669" stroke-width="8"/>
  <circle cx="492" cy="492" r="16" fill="#A7F3D0"/>
`;

function makeSvg(size, scale, withBg) {
  const k = (size / 1024) * scale;
  const t = (size - 1024 * k) / 2;
  const bg = withBg
    ? `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${NAVY_TOP}"/><stop offset="1" stop-color="${NAVY_BOTTOM}"/></linearGradient></defs><rect width="${size}" height="${size}" fill="url(#g)"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${bg}<g transform="translate(${t} ${t}) scale(${k})">${GLYPH}</g></svg>`;
}

async function render(name, size, scale, withBg) {
  const svg = makeSvg(size, scale, withBg);
  await sharp(Buffer.from(svg)).resize(size, size, { fit: 'fill' }).png().toFile(join(assets, name));
  console.log(`wrote ${name} (${size}x${size})`);
}

await render('icon.png', 1024, 1, true);
await render('android-icon-foreground.png', 1080, 0.8, false);
await render('splash-icon.png', 1024, 0.9, false);
await render('favicon.png', 48, 1, true);

console.log('done');
