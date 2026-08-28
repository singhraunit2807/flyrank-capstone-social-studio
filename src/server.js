import 'dotenv/config';
import express from 'express';
import { createCampaign, getCampaign } from './services/campaignService.js';

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'social-media-studio' });
});

app.post('/api/campaigns', (req, res) => {
  const { title, body, url } = req.body ?? {};
  if (!title || !body || !url) {
    return res.status(400).json({ error: 'title, body and url are required' });
  }

  const campaign = createCampaign({ title, body, url });
  return res.status(201).json(campaign);
});

app.get('/api/campaigns/:id', (req, res) => {
  const campaign = getCampaign(req.params.id);
  if (!campaign) return res.status(404).json({ error: 'campaign not found' });
  return res.json(campaign);
});

app.use((err, _req, res, _next) => {
  console.error('request_error', err.message);
  res.status(500).json({ error: 'internal server error' });
});

app.listen(port, () => {
  console.log(`Social Media Studio listening on http://localhost:${port}`);
});
