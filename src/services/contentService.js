export const PLATFORM_SPECS = {
  instagram: { width: 1080, height: 1080, aspectRatio: '1:1' },
  x: { width: 1600, height: 900, aspectRatio: '16:9' }
};

export function composeCaption({ title, body }, platform) {
  const rules = {
    instagram: `Visual-first caption: ${title}\n\n${body}`,
    x: `Concise update: ${title} — ${body}`
  };
  if (!rules[platform]) throw new Error(`Unsupported platform: ${platform}`);
  return rules[platform];
}
