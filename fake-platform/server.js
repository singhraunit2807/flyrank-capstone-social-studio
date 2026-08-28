const express = require('express');
const app = express();
app.use(express.json());
const posts = new Map();

app.get('/health', (_req, res) => res.json({ ok: true }));
app.post('/publish', (req, res) => {
  const key = req.header('Idempotency-Key');
  if (!key) return res.status(400).json({ error: 'Idempotency-Key required' });
  if (posts.has(key)) return res.status(200).json(posts.get(key));
  const post = { id: `fake-${posts.size + 1}`, platform: req.body.platform, status: 'queued' };
  posts.set(key, post);
  res.status(202).json(post);
});

app.listen(4000, () => console.log('Fake platform listening on :4000'));
