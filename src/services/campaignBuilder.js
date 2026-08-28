import { randomUUID } from 'node:crypto';
import { composeCaption } from './contentService.js';
import { buildVariantSpec } from '../imageVariants.js';

export const SUPPORTED_PLATFORMS = ['instagram', 'x'];

export function buildCampaign({ title, body, url = '', sourceImage = 'assets/source.png', platforms = SUPPORTED_PLATFORMS }) {
  if (!title?.trim()) throw new Error('title is required');
  if (!body?.trim()) throw new Error('body is required');
  const selected = [...new Set(platforms)];
  if (!selected.length || selected.some((p) => !SUPPORTED_PLATFORMS.includes(p))) {
    throw new Error('platforms must contain instagram and/or x');
  }

  const posts = selected.map((platform) => ({
    id: randomUUID(),
    platform,
    caption: composeCaption({ title: title.trim(), body: body.trim(), url }, platform),
    image: buildVariantSpec(platform, sourceImage),
    status: 'draft'
  }));

  return {
    id: randomUUID(),
    source: { title: title.trim(), body: body.trim(), url, sourceImage },
    status: 'draft',
    posts,
    createdAt: new Date().toISOString()
  };
}
