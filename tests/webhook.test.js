import test from 'node:test';
import assert from 'node:assert/strict';
import { createWebhookSignature, verifyWebhookSignature } from '../src/webhook.js';

const secret = 'webhook-test-secret';
const payload = { postId: 'post-1', status: 'published' };

test('valid webhook signature is accepted', () => {
  const signature = createWebhookSignature(payload, secret);
  assert.equal(verifyWebhookSignature(payload, signature, secret), true);
});

test('forged webhook signature is rejected', () => {
  assert.equal(verifyWebhookSignature(payload, 'forged-signature', secret), false);
});

test('missing signature is rejected', () => {
  assert.equal(verifyWebhookSignature(payload, undefined, secret), false);
});

test('changed payload is rejected', () => {
  const signature = createWebhookSignature(payload, secret);
  assert.equal(verifyWebhookSignature({ ...payload, status: 'failed' }, signature, secret), false);
});
