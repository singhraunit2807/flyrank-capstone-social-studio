const crypto = require('node:crypto');
const express = require('express');

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 4000);
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'dev-webhook-secret';
const posts = new Map();
const tokens = new Map();
let rateLimitOnce = false;
let failOnce = false;
let nextId = 1;

function sign(payload) {
  return crypto.createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
}

app.get('/health', (_req, res) => res.json({ ok: true, service: 'fake-social-platform' }));

// Minimal OAuth simulation used by local integration tests.
app.post('/oauth/token', (req, res) => {
  const { platform = 'unknown', code = 'demo-code' } = req.body || {};
  const accessToken = `fake-token-${crypto.randomUUID()}`;
  tokens.set(accessToken, { platform, code });
  res.json({ access_token: accessToken, token_type: 'Bearer', expires_in: 3600 });
});

// Test controls: these deliberately exercise the failure modes required by the capstone.
app.post('/admin/rate-limit-once', (_req, res) => {
  rateLimitOnce = true;
  res.json({ enabled: true });
});

app.post('/admin/fail-once', (_req, res) => {
  failOnce = true;
  res.json({ enabled: true });
});

app.get('/admin/posts', (_req, res) => res.json([...posts.values()]));

app.post('/publish', (req, res) => {
  const key = req.header('Idempotency-Key');
  const authorization = req.header('Authorization');
  if (!key) return res.status(400).json({ error: 'Idempotency-Key required' });
  if (!authorization?.startsWith('Bearer ')) return res.status(401).json({ error: 'Bearer token required' });

  if (rateLimitOnce) {
    rateLimitOnce = false;
    res.set('Retry-After', '1');
    return res.status(429).json({ error: 'rate limited' });
  }

  if (failOnce) {
    failOnce = false;
    return res.status(503).json({ error: 'simulated transient failure' });
  }

  if (posts.has(key)) return res.status(200).json(posts.get(key));

  const post = {
    id: `fake-${nextId++}`,
    platform: req.body.platform,
    status: 'queued',
    idempotency_key: key,
    created_at: new Date().toISOString()
  };
  posts.set(key, post);

  const webhookPayload = JSON.stringify({
    event: 'delivery',
    post_id: post.id,
    platform: post.platform,
    status: 'published',
    idempotency_key: key
  });

  // Delivery is asynchronous, matching the trust boundary in the capstone.
  setTimeout(() => {
    fetch(process.env.CALLBACK_URL || 'http://host.docker.internal:3000/webhook/social-delivery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': sign(webhookPayload)
      },
      body: webhookPayload
    }).catch(() => {});
  }, 25);

  return res.status(202).json(post);
});

app.listen(PORT, () => console.log(`Fake platform listening on :${PORT}`));
