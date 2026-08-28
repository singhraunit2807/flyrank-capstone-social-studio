# Social Media Studio

Backend capstone project for turning one blog post into a platform-aware social campaign.

## Current status

This repository contains the initial backend foundation. The implementation will be completed incrementally around the current Social Media Studio capstone brief.

## Planned core flow

```text
Blog Post
   |
   +--> Content / Caption Composer --> platform-specific captions
   |
   +--> Image Variant Pipeline -----> platform-specific images
   |
   +--> Campaign Scheduler ----------> Publishing Worker
                                           |
                                           v
                                   SocialPublisher
                                    /           \
                             Platform A      Platform B
```

## Architecture principles

- Keep HTTP, business logic, and platform adapters separated.
- Use adapters so platform-specific publishing does not leak into business logic.
- Make publish operations idempotent.
- Handle rate limits with `Retry-After` and safe backoff.
- Store secrets only through environment/configuration and never log credentials.
- Treat delivery callbacks/webhooks as untrusted input and verify signatures before changing status.
- Keep tests focused on failure cases as well as the happy path.

## Local setup

```bash
npm install
npm test
npm start
```

The API starts on `http://localhost:3000` by default.

Health check:

```bash
curl http://localhost:3000/health
```

Create a campaign:

```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"title":"Example post","body":"Example body","url":"https://example.com"}'
```

## Important scope note

The repository is being built against the current Social Media Studio assignment shown in the capstone portal. The portal states that the current version is the applicable brief when starting now. Platform-specific implementation details will be added from that current brief rather than assuming requirements from an older version.

## Required submission documentation

- `README.md` — system overview, architecture, setup, and limitations.
- `capstone.yaml` — run/test/endpoint manifest.
- `EVIDENCE.md` — proof for completed acceptance requirements.
- `BUILDLOG.md` — honest record of AI assistance, mistakes, and changes.
- `.env.example` — safe configuration template.

## Security

Never commit `.env`, API keys, OAuth tokens, passwords, or other secrets.
