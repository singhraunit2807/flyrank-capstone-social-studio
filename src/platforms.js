export const PLATFORM_SPECS = {
  instagram: { width: 1080, height: 1080, aspectRatio: '1:1' },
  x: { width: 1600, height: 900, aspectRatio: '16:9' }
};

export class SocialPublisher {
  async publish(_post) {
    throw new Error('publish() must be implemented');
  }
}

export class FakePlatformPublisher extends SocialPublisher {
  constructor(platform, client) {
    super();
    this.platform = platform;
    this.client = client;
  }

  async publish(post) {
    return this.client.publish({ platform: this.platform, ...post });
  }
}

export class FakeInstagramPublisher extends FakePlatformPublisher {
  constructor(client) { super('instagram', client); }
}

export class FakeXPublisher extends FakePlatformPublisher {
  constructor(client) { super('x', client); }
}

export function getPublisher(platform, client) {
  if (platform === 'instagram') return new FakeInstagramPublisher(client);
  if (platform === 'x') return new FakeXPublisher(client);
  throw new Error(`Unsupported platform: ${platform}`);
}
