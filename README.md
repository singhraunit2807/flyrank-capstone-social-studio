# Social Media Studio

Backend capstone project for turning one blog post into a platform-aware social campaign.

## Implementation status

Core backend modules, platform-aware content generation, image variant specifications, adapter-based publishing, idempotency keys, retry/backoff handling, durable scheduling foundation, encrypted token utilities, signed webhooks, acceptance tests, and CI are implemented.

End-to-end verification against the FlyRank-provided fake social platform must be run in the supplied starter environment before claiming the corresponding acceptance probe as passed.

## Core flow

```text
Blog Post
   |
   +--> Content / Caption Composer --> platform-specific captions
   |
   +--> Image Variant Pipeline -----> platform-specific images
   |
   +--> Durable Scheduler ----------> Publishing Worker
                                           |
                                           v
                                   SocialPublisher
                                    /           \
                             Instagram          X
                                    \           /
                                     Fake Platform
                                           |
                                           v
                                   Signed Delivery Webhook
```

## Architecture principles

- Keep HTTP, business logic, scheduling, and platform adapters separated.
- Use `SocialPublisher` adapters so platform-specific publishing does not leak into business logic.
- Use stable idempotency keys per campaign/platform publish operation.
- Honor `Retry-After` for rate limits and use exponential backoff for transient failures.
- Encrypt stored credentials and never log raw tokens.
- Treat delivery callbacks as untrusted input and verify signatures before changing status.
- Test failure paths as well as the happy path.

## Local setup

Requirements: Node.js 20+.

```bash
npm install
cp .env.example .env
npm test
npm start
```

The API starts on `http://localhost:3000` by default.

### Useful commands

```bash
npm test
npm run lint
npm run generate:images
```

### Health check

```bash
curl http://localhost:3000/health
```

### Create a campaign

```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"title":"Example post","body":"Example body","url":"https://example.com"}'
```

### Publish a campaign

```bash
curl -X POST http://localhost:3000/api/campaigns/CAMPAIGN_ID/publish \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Acceptance coverage

The automated suite covers platform image dimensions/specifications, platform-specific captions, adapter separation, unsupported platforms, idempotency behavior, `429 Retry-After`, transient retries/backoff, token encryption, and signed webhook verification.

The CI workflow runs syntax checks and the full Node test suite on pushes and pull requests to `main`.

## Security

Never commit `.env`, API keys, OAuth tokens, passwords, or other secrets. Use `.env.example` only as a template.
