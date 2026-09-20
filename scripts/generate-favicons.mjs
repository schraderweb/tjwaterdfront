import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const src = path.join(rootDir, "public", "favicon.png");

async function generateSuite() {
  if (!fs.existsSync(src)) {
    console.error("Error: Source file public/favicon.png not found!");
    process.exit(1);
  }

  console.log("Generating modern favicon suite from public/favicon.png...");

  // 1. favicon-32x32.png
  await sharp(src)
    .resize(32, 32, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toFile(path.join(rootDir, "public", "favicon-32x32.png"));
  console.log("✓ public/favicon-32x32.png");

  // 2. favicon-96x96.png (Google Search multiple of 48, high-DPI desktop tabs)
  await sharp(src)
    .resize(96, 96, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toFile(path.join(rootDir, "public", "favicon-96x96.png"));
  console.log("✓ public/favicon-96x96.png");

  // 3. favicon.ico (multi-resolution container: 16x16, 32x32, 48x48)
  const icoSizes = [16, 32, 48];
  const pngBuffers = [];
  for (const s of icoSizes) {
    const buf = await sharp(src)
      .resize(s, s, { kernel: sharp.kernel.lanczos3 })
      .png()
      .toBuffer();
    pngBuffers.push({ size: s, buffer: buf });
  }

  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4); // count

  let offset = 6 + count * 16;
  const dirEntries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size >= 256 ? 0 : item.size, 0);
    entry.writeUInt8(item.size >= 256 ? 0 : item.size, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(item.buffer.length, 8); // size in bytes
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += item.buffer.length;
  }
  const icoBuffer = Buffer.concat([header, ...dirEntries, ...pngBuffers.map((p) => p.buffer)]);
  fs.writeFileSync(path.join(rootDir, "public", "favicon.ico"), icoBuffer);
  console.log("✓ public/favicon.ico");

  // 4. apple-touch-icon.png (180x180, solid brand navy #071a2b background, centered with safe margin)
  const badge144 = await sharp(src)
    .resize(144, 144, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();
  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 7, g: 26, b: 43, alpha: 1 }, // #071a2b
    },
  })
    .composite([{ input: badge144, top: 18, left: 18 }])
    .png()
    .toFile(path.join(rootDir, "public", "apple-touch-icon.png"));
  console.log("✓ public/apple-touch-icon.png");

  // 5. web-app-manifest-192x192.png (Android Chrome / PWA)
  const badge152 = await sharp(src)
    .resize(152, 152, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();
  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 7, g: 26, b: 43, alpha: 1 },
    },
  })
    .composite([{ input: badge152, top: 20, left: 20 }])
    .png()
    .toFile(path.join(rootDir, "public", "web-app-manifest-192x192.png"));
  console.log("✓ public/web-app-manifest-192x192.png");

  // 6. web-app-manifest-512x512.png (Android splash / PWA store)
  const badge410 = await sharp(src)
    .resize(410, 410, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 7, g: 26, b: 43, alpha: 1 },
    },
  })
    .composite([{ input: badge410, top: 51, left: 51 }])
    .png()
    .toFile(path.join(rootDir, "public", "web-app-manifest-512x512.png"));
  console.log("✓ public/web-app-manifest-512x512.png");

  console.log("All favicon suite assets generated successfully!");
}

generateSuite().catch((err) => {
  console.error("Failed to generate favicons:", err);
  process.exit(1);
});
