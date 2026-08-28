import { PLATFORM_SPECS } from './platforms.js';

export function buildVariantSpec(platform, sourceImage) {
  const spec = PLATFORM_SPECS[platform];
  if (!spec) throw new Error(`Unsupported platform: ${platform}`);
  return {
    platform,
    sourceImage,
    width: spec.width,
    height: spec.height,
    aspectRatio: spec.aspectRatio,
    fit: 'cover',
    safeZone: 'center'
  };
}

export function buildAllVariants(sourceImage) {
  return Object.keys(PLATFORM_SPECS).map((platform) => buildVariantSpec(platform, sourceImage));
}
