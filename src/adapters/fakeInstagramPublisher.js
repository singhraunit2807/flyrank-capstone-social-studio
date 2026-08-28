import { SocialPublisher } from '../domain/socialPublisher.js';

export class FakeInstagramPublisher extends SocialPublisher {
  async publish(post) {
    return {
      platform: 'instagram',
      idempotencyKey: post.idempotencyKey,
      accepted: true,
      externalId: `ig_${post.idempotencyKey}`
    };
  }
}
