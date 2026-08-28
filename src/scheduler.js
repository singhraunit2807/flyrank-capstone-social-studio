class DurableScheduler {
  constructor() { this.jobs = new Map(); }
  schedule(id, runAt, handler) {
    if (this.jobs.has(id)) return false;
    const delay = Math.max(0, new Date(runAt).getTime() - Date.now());
    const timer = setTimeout(async () => {
      try { await handler(); } finally { this.jobs.delete(id); }
    }, delay);
    this.jobs.set(id, { runAt, timer });
    return true;
  }
  cancel(id) {
    const job = this.jobs.get(id);
    if (!job) return false;
    clearTimeout(job.timer);
    this.jobs.delete(id);
    return true;
  }
}

module.exports = { DurableScheduler };
