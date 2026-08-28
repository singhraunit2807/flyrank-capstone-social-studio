# Implementation Checklist

## Implemented in repository
- [x] Public dedicated repository
- [x] README / capstone manifest / evidence / build log
- [x] Environment example and gitignore
- [x] Platform specifications
- [x] Caption composition from shared + platform fragments
- [x] SocialPublisher interface + Instagram/X adapters
- [x] Sharp image-generation utility
- [x] Idempotency key and fake-platform guard
- [x] `429 Retry-After` parsing and exponential backoff utility
- [x] AES-256-GCM token encryption with random IV
- [x] Signed webhook verification
- [x] Durable scheduler primitives and stale-job recovery
- [x] Architecture diagram
- [x] Automated unit/acceptance test coverage
- [x] GitHub Actions CI workflow

## Required before final submission
- [ ] Run against the exact FlyRank-provided `starters/challenge-5-social/` server.
- [ ] Wire campaign persistence fully to the durable store and prove restart recovery.
- [ ] Wire the scheduled worker to real campaign publishing and verify crash-resume with zero duplicates.
- [ ] Run the actual image-generation command and inspect the resulting files.
- [ ] Capture real `npm test`, API, scheduler, webhook, and security outputs in `EVIDENCE.md`.
- [ ] Run all six acceptance probes from the brief.
- [ ] Rehearse the final demo.

## Audit rule

Unchecked items are intentionally not presented as complete. The capstone requires real evidence for the acceptance probes, and the supplied FlyRank starter server is not currently available in this conversation.
