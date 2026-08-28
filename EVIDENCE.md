# Evidence

This file follows the capstone rule that claims must be backed by reproducible test output, a curl transcript, or a log excerpt. The repository currently contains implementation and automated test coverage, but runtime acceptance evidence has not been fabricated.

## Automated implementation coverage

- Platform image specifications: covered by `tests/capstoneAcceptance.test.js`.
- Platform-specific captions: covered by `tests/capstoneAcceptance.test.js`.
- Adapter separation: covered by `tests/capstoneAcceptance.test.js`.
- Idempotency behavior: covered by `tests/idempotency.test.js`.
- `429 Retry-After` and transient backoff: covered by `tests/retry.test.js`.
- Signed webhook verification: covered by `tests/webhook.test.js`.
- Token encryption: covered by `tests/tokenVault.test.js`.
- Durable job scheduling primitives: covered by `tests/scheduler.test.js`.

## Runtime acceptance probes — pending real execution

- [ ] Probe 1 — same campaign twice + simulated timeout => exactly one post per platform.
- [ ] Probe 2 — fake platform returns `429 Retry-After: 30` => wait and retry safely.
- [ ] Probe 3 — scheduled job + worker kill/restart => zero duplicates.
- [ ] Probe 4 — forged webhook => HTTP 400 and unchanged status; valid webhook => published.
- [ ] Probe 5 — inspect actual generated files: Instagram 1080×1080, X 1600×900, distinct captions.
- [ ] Probe 6 — inspect persisted data/logs for plaintext tokens.

## Verification note

Do not mark the pending probes complete until the supplied FlyRank fake-platform starter and the local runtime have been run. The brief explicitly states that claims without evidence score as not done.
