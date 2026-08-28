import test from 'node:test';
import assert from 'node:assert/strict';

function publishWithIdempotency(store, key) {
  if (store.has(key)) return store.get(key);
  const post = { id: `fake-${store.size + 1}`, key };
  store.set(key, post);
  return post;
}

test('same idempotency key produces one external post', () => {
  const store = new Map();
  const first = publishWithIdempotency(store, 'campaign-1:instagram');
  const second = publishWithIdempotency(store, 'campaign-1:instagram');
  assert.equal(store.size, 1);
  assert.deepEqual(second, first);
});

test('different platform keys remain independently idempotent', () => {
  const store = new Map();
  publishWithIdempotency(store, 'campaign-1:instagram');
  publishWithIdempotency(store, 'campaign-1:x');
  assert.equal(store.size, 2);
});
