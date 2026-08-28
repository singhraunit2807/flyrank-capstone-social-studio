const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseRetryAfter(value) {
  if (value == null || value === '') return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const dateMs = Date.parse(value);
  return Number.isFinite(dateMs) ? Math.max(0, dateMs - Date.now()) : null;
}

export async function withRetry(operation, {
  maxRetries = 3,
  defaultBackoffMs = 250,
  sleepFn = sleep,
  shouldRetry = (error) => [429, 502, 503, 504].includes(error?.status)
} = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await operation(attempt);
    } catch (error) {
      if (!shouldRetry(error) || attempt >= maxRetries) throw error;
      const retryAfterMs = error?.status === 429 ? parseRetryAfter(error.retryAfter) : null;
      const delay = retryAfterMs ?? defaultBackoffMs * (2 ** attempt);
      await sleepFn(delay);
      attempt += 1;
    }
  }
}

export { parseRetryAfter };
