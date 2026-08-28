import { PLATFORM_SPECS } from '../platforms.js';

const SHARED_BRAND_VOICE = 'Clear, useful, practical, and trustworthy.';
const PLATFORM_RULES = {
  instagram: 'Visual-first, warm, concise, with a clear call to action and relevant hashtags.',
  x: 'Concise, direct, conversational, with the key idea and URL near the end.'
};

export function composeCaption({ title, body, url }, platform) {
  if (!PLATFORM_SPECS[platform]) throw new Error(`Unsupported platform: ${platform}`);
  const summary = `${title}: ${body}`.trim();
  if (platform === 'instagram') {
    return `${title}\n\n${body}\n\nRead more: ${url}\n\n#FlyRank #SocialMedia`;
  }
  return `${title} — ${body} Read more: ${url}`;
}

export function buildCampaignContent(source) {
  return Object.keys(PLATFORM_SPECS).map((platform) => ({
    platform,
    caption: composeCaption(source, platform),
    promptContext: {
      sharedBrandVoice: SHARED_BRAND_VOICE,
      platformRules: PLATFORM_RULES[platform],
      contentSummary: `${source.title}: ${source.body}`
    }
  }));
}
