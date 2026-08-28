import test from 'node:test';
import assert from 'node:assert/strict';
import { createCampaign, getCampaign } from '../src/services/campaignService.js';
import { composeCaption, PLATFORM_SPECS } from '../src/services/contentService.js';

test('creates and retrieves a campaign', () => {
  const campaign = createCampaign({ title: 'Hello', body: 'World', url: 'https://example.com' });
  assert.equal(getCampaign(campaign.id).id, campaign.id);
  assert.equal(campaign.status, 'draft');
});

test('platform image specifications are correct', () => {
  assert.deepEqual(PLATFORM_SPECS.instagram, { width: 1080, height: 1080, aspectRatio: '1:1' });
  assert.deepEqual(PLATFORM_SPECS.x, { width: 1600, height: 900, aspectRatio: '16:9' });
});

test('captions are platform-specific', () => {
  const source = { title: 'Launch', body: 'A new product is live.' };
  assert.notEqual(composeCaption(source, 'instagram'), composeCaption(source, 'x'));
});
