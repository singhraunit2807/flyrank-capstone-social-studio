class IdempotencyStore {
  constructor() { this.results = new Map(); }
  key(postId, platform) { return `${postId}:${platform}`; }
  has(postId, platform) { return this.results.has(this.key(postId, platform)); }
  get(postId, platform) { return this.results.get(this.key(postId, platform)); }
  set(postId, platform, result) { this.results.set(this.key(postId, platform), result); return result; }
}

async function publishIdempotently(store, postId, platform, publishFn) {
  if (store.has(postId, platform)) return store.get(postId, platform);
  const result = await publishFn();
  return store.set(postId, platform, result);
}

module.exports = { IdempotencyStore, publishIdempotently };
