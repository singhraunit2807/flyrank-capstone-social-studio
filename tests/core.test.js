const assert = require('node:assert/strict');
const test = require('node:test');
const { PLATFORM_SPECS } = require('../src/platforms');
const { composeCaption } = require('../src/captions');
const { IdempotencyStore, publishIdempotently } = require('../src/idempotency');
const { withRetry } = require('../src/retry');
const { verifySignature } = require('../src/webhook');
const { encryptToken, decryptToken } = require('../src/encryption');
const crypto = require('crypto');

test('platform image dimensions are correct', () => {
  assert.deepEqual(PLATFORM_SPECS.instagram, { width: 1080, height: 1080, aspectRatio: '1:1' });
  assert.deepEqual(PLATFORM_SPECS.x, { width: 1600, height: 900, aspectRatio: '16:9' });
});

test('captions differ by platform', () => {
  const input = { title: 'Test', summary: 'Summary', url: 'https://example.com' };
  assert.notEqual(composeCaption({ platform: 'instagram', ...input }), composeCaption({ platform: 'x', ...input }));
});

test('duplicate publish returns one stored result', async () => {
  const store = new IdempotencyStore(); let calls = 0;
  const publish = () => { calls += 1; return Promise.resolve({ id: 'post-1' }); };
  await publishIdempotently(store, 'campaign-1', 'x', publish);
  await publishIdempotently(store, 'campaign-1', 'x', publish);
  assert.equal(calls, 1);
});

test('429 Retry-After is honored', async () => {
  let calls = 0; const delays = [];
  const result = await withRetry(async () => {
    calls += 1;
    if (calls === 1) { const e = new Error('rate limited'); e.status = 429; e.retryAfter = 30; throw e; }
    return 'ok';
  }, { sleepFn: async (ms) => delays.push(ms) });
  assert.equal(result, 'ok'); assert.equal(calls, 2); assert.deepEqual(delays, [30000]);
});

test('forged webhook signature is rejected', () => {
  const body = JSON.stringify({ postId: '1', platform: 'x', status: 'published' });
  assert.equal(verifySignature(body, 'bad-signature', 'secret'), false);
});

test('valid webhook signature verifies', () => {
  const body = JSON.stringify({ postId: '1', platform: 'x', status: 'published' });
  const sig = crypto.createHmac('sha256', 'secret').update(body).digest('hex');
  assert.equal(verifySignature(body, sig, 'secret'), true);
});

test('tokens encrypt and decrypt with random IVs', () => {
  const a = encryptToken('token', 'secret'); const b = encryptToken('token', 'secret');
  assert.notEqual(a, b); assert.equal(decryptToken(a, 'secret'), 'token'); assert.equal(decryptToken(b, 'secret'), 'token');
});
