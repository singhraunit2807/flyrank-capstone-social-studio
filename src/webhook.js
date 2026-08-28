import crypto from 'node:crypto';

export function verifyWebhookSignature(payload, signature, secret) {
  if (!signature || !secret) return false;
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const a = Buffer.from(signature, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
