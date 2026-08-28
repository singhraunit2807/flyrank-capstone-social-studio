import { PLATFORM_SPECS } from '../platforms.js';

const SHARED_BRAND_VOICE = 'Clear, useful, practical, and trustworthy.';
const PLATFORM_RULES = {
  instagram: 'Visual-first, warm, concise, with a clear call to action and relevant hashtags.',
  x: 'Concise, direct, conversational, with the key idea and URL near the end.'
};

function normalize(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

export function composeCaption({ title, body, url = '' }, platform) {
  if (!PLATFORM_SPECS[platform]) throw new Error(`Unsupported platform: ${platform}`);
  const cleanTitle = normalize(title);
  const cleanBody = normalize(body);
  const cleanUrl = normalize(url);
  if (!cleanTitle || !cleanBody) throw new Error('title and body are required');

  if (platform === 'instagram') {
    const parts = [cleanTitle, cleanBody, cleanUrl ? `Read more: ${cleanUrl}` : '', '#FlyRank #SocialMedia'];
    return parts.filter(Boolean).join('\n\n');
  }

  const suffix = cleanUrl ? ` Read more: ${cleanUrl}` : '';
  return `${cleanTitle} — ${cleanBody}${suffix}`;
}

export function buildCampaignContent(source, platforms = Object.keys(PLATFORM_SPECS)) {
  const selected = [...new Set(platforms)];
  if (!selected.length || selected.some((platform) => !PLATFORM_SPECS[platform])) {
    throw new Error('unsupported platform');
  }
  return selected.map((platform) => ({
    platform,
    caption: composeCaption(source, platform),
    promptContext: {
      sharedBrandVoice: SHARED_BRAND_VOICE,
      platformRules: PLATFORM_RULES[platform],
      contentSummary: `${normalize(source.title)}: ${normalize(source.body)}`
    }
  }));
}
