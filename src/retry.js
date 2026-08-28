async function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function withRetry(operation, { maxRetries = 3, defaultBackoffMs = 1000, sleepFn = sleep } = {}) {
  let attempt = 0;
  while (true) {
    try { return await operation(attempt); }
    catch (error) {
      if (error?.status !== 429 || attempt >= maxRetries) throw error;
      const retryAfter = Number(error.retryAfter);
      const delay = Number.isFinite(retryAfter) ? retryAfter * 1000 : defaultBackoffMs * (2 ** attempt);
      await sleepFn(delay);
      attempt += 1;
    }
  }
}

module.exports = { withRetry };
