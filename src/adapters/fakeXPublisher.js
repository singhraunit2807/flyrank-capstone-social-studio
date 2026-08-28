import { SocialPublisher } from '../domain/socialPublisher.js';

export class FakeXPublisher extends SocialPublisher {
  async publish(post) {
    return {
      platform: 'x',
      idempotencyKey: post.idempotencyKey,
      accepted: true,
      externalId: `x_${post.idempotencyKey}`
    };
  }
}
