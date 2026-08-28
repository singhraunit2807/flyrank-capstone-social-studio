# Implementation Checklist

## Core
- [x] Public dedicated repository
- [x] README / capstone manifest / evidence / build log
- [x] Environment example and gitignore
- [x] Platform specifications
- [x] Caption composition from shared + platform fragments
- [x] SocialPublisher interface + Instagram/X adapters
- [x] Idempotency guard
- [x] 429 Retry-After backoff utility
- [x] AES-256-GCM token encryption with random IV
- [x] Signed webhook verification
- [x] Scheduler foundation
- [x] Database schema
- [x] Local fake-platform foundation
- [x] Architecture diagram
- [x] Automated tests for core reliability/security behavior

## Before submission
- [ ] Connect the exact FlyRank-provided fake server at `starters/challenge-5-social/`
- [ ] Implement real image file generation with Sharp and dimension assertions
- [ ] Persist scheduler jobs and worker state across process restarts
- [ ] Wire the HTTP routes to persistence and adapters end-to-end
- [ ] Capture real command/test output in EVIDENCE.md
- [ ] Run all acceptance probes from the brief
- [ ] Rehearse the six-minute demo

The unchecked items are intentionally not claimed as complete until the provided FlyRank starter server and runtime environment are available and tested.
