import crypto from 'node:crypto';

function canonicalBody(payload) {
  return typeof payload === 'string' ? payload : JSON.stringify(payload ?? {});
}

export function createWebhookSignature(payload, secret) {
  if (!secret) throw new Error('WEBHOOK_SECRET is required');
  return crypto.createHmac('sha256', secret).update(canonicalBody(payload)).digest('hex');
}

export function verifyWebhookSignature(payload, signature, secret) {
  if (!signature || !secret) return false;
  const expected = createWebhookSignature(payload, secret);
  const a = Buffer.from(String(signature), 'utf8');
  const b = Buffer.from(expected, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
