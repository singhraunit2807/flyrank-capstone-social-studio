import { FAKE_PLATFORM_URL } from '../config.js';

export class FakePlatformError extends Error {
  constructor(message, { status, retryAfter, response } = {}) {
    super(message);
    this.name = 'FakePlatformError';
    this.status = status;
    this.retryAfter = retryAfter;
    this.response = response;
  }
}

export async function publishToFakePlatform({ platform, caption, imageUrl, idempotencyKey, accessToken }) {
  const response = await fetch(`${FAKE_PLATFORM_URL}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Idempotency-Key': idempotencyKey
    },
    body: JSON.stringify({ platform, caption, imageUrl })
  });

  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

  if (!response.ok && response.status !== 202) {
    const retryAfter = response.headers.get('Retry-After');
    throw new FakePlatformError(data.error || `Fake platform returned ${response.status}`, {
      status: response.status,
      retryAfter,
      response: data
    });
  }

  return data;
}

export async function getFakePlatformPosts() {
  const response = await fetch(`${FAKE_PLATFORM_URL}/posts`);
  if (!response.ok) throw new FakePlatformError('Could not inspect fake platform posts', { status: response.status });
  return response.json();
}
