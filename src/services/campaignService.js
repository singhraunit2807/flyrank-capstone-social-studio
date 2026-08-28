import { randomUUID } from 'node:crypto';

const campaigns = new Map();

export function createCampaign(input) {
  const id = randomUUID();
  const campaign = {
    id,
    source: input,
    status: 'draft',
    posts: [],
    createdAt: new Date().toISOString()
  };
  campaigns.set(id, campaign);
  return campaign;
}

export function getCampaign(id) {
  return campaigns.get(id);
}
