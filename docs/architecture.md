# Architecture

```text
Blog Post
   |
   +--> Caption Composer (shared + platform fragments)
   |
   +--> Image Variant Pipeline (platform dimensions + safe zone)
   |
   v
Campaign / Social Posts
   |
   v
Durable Scheduler / Worker
   |
   v
SocialPublisher interface
   +--> FakeInstagramPublisher --> Fake Platform
   +--> FakeXPublisher         --> Fake Platform
                         |
                         v
                 Signed delivery webhook
                         |
                  HMAC verification
                    /           \
                 valid          forged
                   |               |
              update status      400
```

Core boundaries: HTTP/API, application services, platform adapters, persistence, background jobs, and security utilities are kept separate so a new platform can be added as an adapter rather than changing campaign logic.
