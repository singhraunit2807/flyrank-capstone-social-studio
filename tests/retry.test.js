import test from 'node:test';
import assert from 'node:assert/strict';
import { withRetry, parseRetryAfter } from '../src/retry.js';

test('Retry-After seconds are converted to milliseconds', () => {
  assert.equal(parseRetryAfter('30'), 30000);
});

test('429 waits for Retry-After then retries successfully', async () => {
  let calls = 0;
  const delays = [];
  const result = await withRetry(async () => {
    calls += 1;
    if (calls === 1) {
      const error = new Error('rate limited');
      error.status = 429;
      error.retryAfter = '30';
      throw error;
    }
    return 'published';
  }, { sleepFn: async (ms) => delays.push(ms) });

  assert.equal(result, 'published');
  assert.equal(calls, 2);
  assert.deepEqual(delays, [30000]);
});

test('transient 503 uses exponential backoff', async () => {
  let calls = 0;
  const delays = [];
  const result = await withRetry(async () => {
    calls += 1;
    if (calls < 3) {
      const error = new Error('temporary');
      error.status = 503;
      throw error;
    }
    return 'ok';
  }, { defaultBackoffMs: 100, sleepFn: async (ms) => delays.push(ms) });

  assert.equal(result, 'ok');
  assert.equal(calls, 3);
  assert.deepEqual(delays, [100, 200]);
});
