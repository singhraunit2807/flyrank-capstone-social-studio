import { randomUUID } from 'node:crypto';
import { buildCampaignContent } from './contentService.js';
import { buildAllVariants } from '../imageVariants.js';

const campaigns = new Map();

export function createCampaign(input) {
  const id = randomUUID();
  const sourceImage = input.sourceImage || 'placeholder://blog-image';
  const content = buildCampaignContent(input);
  const variants = buildAllVariants(sourceImage);
  const posts = content.map((item) => ({
    id: randomUUID(),
    platform: item.platform,
    caption: item.caption,
    image: variants.find((variant) => variant.platform === item.platform),
    status: 'queued',
    idempotencyKey: `${id}:${item.platform}`,
    externalId: null,
    publishedAt: null
  }));

  const campaign = {
    id,
    source: input,
    status: 'queued',
    posts,
    createdAt: new Date().toISOString()
  };
  campaigns.set(id, campaign);
  return campaign;
}

export function getCampaign(id) {
  return campaigns.get(id);
}

export function listCampaigns() {
  return [...campaigns.values()];
}

export function updatePost(id, patch) {
  for (const campaign of campaigns.values()) {
    const post = campaign.posts.find((item) => item.id === id);
    if (post) {
      Object.assign(post, patch);
      if (campaign.posts.every((item) => item.status === 'published')) campaign.status = 'published';
      return post;
    }
  }
  return null;
}
