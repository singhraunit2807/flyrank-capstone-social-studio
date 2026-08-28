# Build Log

## 2026-08-28 — Repository foundation and reliability work

- Created the dedicated public capstone repository and required submission files.
- Added Express API, campaign generation, platform specifications, and adapter abstractions.
- Added Instagram and X publisher adapters.
- Added platform-aware caption composition and Sharp image-generation utilities.
- Added idempotency keys, retry/backoff handling, and `Retry-After` parsing.
- Added AES-256-GCM token encryption with random IVs and token redaction.
- Added HMAC-SHA256 webhook signing/verification and delivery-state transition checks.
- Added a durable JSON store and scheduler/worker foundation for scheduled jobs and stale-job recovery.
- Added automated unit/acceptance tests and GitHub Actions CI.

## Audit findings

- The first CI run failed during Node setup because npm caching was configured without a committed lockfile. The cache dependency was removed so CI can proceed with `npm install`.
- The repository currently contains a local fake-platform implementation for development, but the exact FlyRank-provided `starters/challenge-5-social/` server has not been supplied in this conversation. Its exact endpoint contract therefore has not been verified.
- The campaign HTTP service still needs its in-memory campaign map wired fully to the durable store before the crash/restart acceptance probe can honestly be marked passed.
- `EVIDENCE.md` intentionally does not claim runtime acceptance probes as passed until real command output is captured.

## AI assistance

AI was used to scaffold, review, implement, and document the project. Generated code was reviewed against the capstone brief during the audit. Where implementation or environment details could not be verified, they were recorded as limitations rather than presented as completed evidence.
