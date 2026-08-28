import 'dotenv/config';
import express from 'express';
import { createCampaign, getCampaign, listCampaigns, updatePost } from './services/campaignService.js';
import { DEFAULT_FAKE_ACCESS_TOKEN } from './config.js';
import { publishToFakePlatform, getFakePlatformPosts } from './services/fakePlatformClient.js';
import { withRetry } from './retry.js';
import { verifyWebhookSignature } from './webhook.js';
import { WEBHOOK_SECRET, PORT } from './config.js';

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ ok: true, service: 'social-media-studio' }));
app.get('/api/campaigns', (_req, res) => res.json(listCampaigns()));

app.post('/api/campaigns', (req, res) => {
  const { title, body, url, sourceImage } = req.body ?? {};
  if (!title || !body || !url) return res.status(400).json({ error: 'title, body and url are required' });
  return res.status(201).json(createCampaign({ title, body, url, sourceImage }));
});

app.get('/api/campaigns/:id', (req, res) => {
  const campaign = getCampaign(req.params.id);
  if (!campaign) return res.status(404).json({ error: 'campaign not found' });
  return res.json(campaign);
});

app.post('/api/campaigns/:id/publish', async (req, res, next) => {
  try {
    const campaign = getCampaign(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'campaign not found' });
    const accessToken = req.body?.accessToken || DEFAULT_FAKE_ACCESS_TOKEN;
    const results = [];

    for (const post of campaign.posts) {
      if (post.status === 'published' && post.externalId) {
        results.push(post);
        continue;
      }
      updatePost(post.id, { status: 'publishing' });
      const result = await withRetry(
        () => publishToFakePlatform({
          platform: post.platform,
          caption: post.caption,
          imageUrl: post.image.sourceImage,
          idempotencyKey: post.idempotencyKey,
          accessToken
        }),
        { maxRetries: 3 }
      );
      const updated = updatePost(post.id, {
        status: result.status === 'published' ? 'published' : 'publishing',
        externalId: result.id || result.externalId || null
      });
      results.push(updated);
    }
    return res.json({ campaignId: campaign.id, posts: results });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/fake-platform/posts', async (_req, res, next) => {
  try { return res.json(await getFakePlatformPosts()); } catch (error) { return next(error); }
});

app.post('/webhook/social-delivery', (req, res) => {
  const signature = req.header('X-Webhook-Signature');
  if (!verifyWebhookSignature(req.body, signature, WEBHOOK_SECRET)) {
    return res.status(400).json({ error: 'invalid webhook signature' });
  }
  const { postId, externalId, status } = req.body;
  const post = postId ? updatePost(postId, { status, externalId, deliveredAt: new Date().toISOString() }) : null;
  if (!post) return res.status(404).json({ error: 'post not found' });
  return res.json({ ok: true, post });
});

app.use((err, _req, res, _next) => {
  console.error('request_error', err.message);
  res.status(err.status || 500).json({ error: err.message || 'internal server error' });
});

app.listen(PORT, () => console.log(`Social Media Studio listening on http://localhost:${PORT}`));
