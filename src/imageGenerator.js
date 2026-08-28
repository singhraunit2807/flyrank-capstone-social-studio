import sharp from 'sharp';
import { PLATFORM_SPECS } from './platforms.js';

export async function generatePlatformImage(sourcePath, platform, outputPath) {
  const spec = PLATFORM_SPECS[platform];
  if (!spec) throw new Error(`Unsupported platform: ${platform}`);

  await sharp(sourcePath)
    .resize(spec.width, spec.height, {
      fit: 'cover',
      position: 'centre'
    })
    .png()
    .toFile(outputPath);

  return {
    platform,
    path: outputPath,
    width: spec.width,
    height: spec.height,
    safeZone: 'center'
  };
}

export async function generateAllPlatformImages(sourcePath, outputDir) {
  const results = [];
  for (const platform of Object.keys(PLATFORM_SPECS)) {
    const outputPath = `${outputDir}/${platform}.png`;
    results.push(await generatePlatformImage(sourcePath, platform, outputPath));
  }
  return results;
}
