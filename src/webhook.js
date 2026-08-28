const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const a = Buffer.from(signature, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function handleDeliveryWebhook(rawBody, signature, secret, statusStore) {
  if (!verifySignature(rawBody, signature, secret)) return { statusCode: 400, body: { error: 'Invalid webhook signature' } };
  const event = JSON.parse(rawBody);
  statusStore.set(event.postId, event.platform, event.status);
  return { statusCode: 200, body: { accepted: true } };
}

module.exports = { verifySignature, handleDeliveryWebhook };
