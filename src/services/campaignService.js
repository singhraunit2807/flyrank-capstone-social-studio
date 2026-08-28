import { randomUUID } from 'node:crypto';
import { buildCampaignContent } from './contentService.js';
import { buildAllVariants } from '../imageVariants.js';

const campaigns = new Map();
const VALID_STATUSES = new Set(['queued', 'publishing', 'published', 'failed']);
const ALLOWED_TRANSITIONS = {
  queued: new Set(['queued', 'publishing', 'failed']),
  publishing: new Set(['publishing', 'published', 'failed']),
  published: new Set(['published']),
  failed: new Set(['queued', 'publishing', 'failed', 'published'])
};

export function createCampaign(input) {
  const id = randomUUID();
  const sourceImage = input.sourceImage || 'placeholder://blog-image';
  const platforms = input.platforms?.length ? input.platforms : ['instagram', 'x'];
  const content = buildCampaignContent(input, platforms);
  const variants = buildAllVariants(sourceImage);
  const posts = content.map((item) => ({
    id: randomUUID(),
    platform: item.platform,
    caption: item.caption,
    promptContext: item.promptContext,
    image: variants.find((variant) => variant.platform === item.platform),
    status: 'queued',
    idempotencyKey: `${id}:${item.platform}`,
    externalId: null,
    publishedAt: null,
    deliveredAt: null,
    error: null
  }));
  const campaign = { id, source: input, status: 'queued', posts, createdAt: new Date().toISOString() };
  campaigns.set(id, campaign);
  return campaign;
}

export function getCampaign(id) { return campaigns.get(id); }
export function listCampaigns() { return [...campaigns.values()]; }

export function updatePost(id, patch) {
  for (const campaign of campaigns.values()) {
    const post = campaign.posts.find((item) => item.id === id);
    if (!post) continue;
    if (patch.status && (!VALID_STATUSES.has(patch.status) || !ALLOWED_TRANSITIONS[post.status]?.has(patch.status))) {
      throw new Error(`invalid post status transition: ${post.status} -> ${patch.status}`);
    }
    Object.assign(post, patch);
    if (campaign.posts.every((item) => item.status === 'published')) campaign.status = 'published';
    else if (campaign.posts.some((item) => item.status === 'failed')) campaign.status = 'failed';
    else if (campaign.posts.some((item) => item.status === 'publishing')) campaign.status = 'publishing';
    else campaign.status = 'queued';
    return post;
  }
  return null;
}
