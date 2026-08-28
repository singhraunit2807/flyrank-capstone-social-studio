export class SocialPublisher {
  async publish(_post) {
    throw new Error('SocialPublisher.publish must be implemented by an adapter');
  }
}
