import test from 'node:test';
import assert from 'node:assert/strict';
import { PLATFORM_SPECS, getPublisher } from '../src/platforms.js';
import { buildCampaignContent } from '../src/services/contentService.js';
import { buildAllVariants } from '../src/imageVariants.js';

const source = {
  title: 'Reliable Social Publishing',
  body: 'A short campaign about dependable publishing workflows.',
  url: 'https://example.com/post'
};

test('acceptance: both required image variants have exact dimensions', () => {
  const variants = buildAllVariants('assets/source.png');
  assert.deepEqual(variants.find((v) => v.platform === 'instagram').dimensions, {
    width: PLATFORM_SPECS.instagram.width,
    height: PLATFORM_SPECS.instagram.height
  });
  assert.deepEqual(variants.find((v) => v.platform === 'x').dimensions, {
    width: PLATFORM_SPECS.x.width,
    height: PLATFORM_SPECS.x.height
  });
});

test('acceptance: captions are platform-specific and share campaign context', () => {
  const content = buildCampaignContent(source, ['instagram', 'x']);
  const instagram = content.find((item) => item.platform === 'instagram');
  const x = content.find((item) => item.platform === 'x');
  assert.ok(instagram.caption.includes('#FlyRank'));
  assert.ok(x.caption.includes('Read more:'));
  assert.notEqual(instagram.caption, x.caption);
  assert.equal(instagram.promptContext.sharedBrandVoice, x.promptContext.sharedBrandVoice);
});

test('acceptance: adapter architecture exposes separate platform publishers', async () => {
  const calls = [];
  const client = { publish: async (post) => { calls.push(post); return { id: 'fake-1', status: 'published' }; } };
  const instagram = getPublisher('instagram', client);
  const x = getPublisher('x', client);
  assert.equal((await instagram.publish({ caption: 'a' })).status, 'published');
  assert.equal((await x.publish({ caption: 'b' })).status, 'published');
  assert.deepEqual(calls.map((call) => call.platform), ['instagram', 'x']);
});

test('acceptance: unsupported platform is rejected', () => {
  assert.throws(() => getPublisher('unknown', { publish: async () => ({}) }), /Unsupported platform/);
});
