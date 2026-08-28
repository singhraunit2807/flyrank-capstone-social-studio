import 'dotenv/config';
import { claimDueJobs, completeJob, recoverStaleJobs } from './scheduler.js';

const pollMs = Number(process.env.WORKER_POLL_MS || 1000);
let running = true;

export async function processDueJobs(handler, now = new Date()) {
  await recoverStaleJobs();
  const jobs = await claimDueJobs(now);
  for (const job of jobs) {
    try {
      await handler(job);
      await completeJob(job.id, 'completed');
    } catch (error) {
      await completeJob(job.id, 'failed', error.message);
    }
  }
  return jobs;
}

export function startWorker(handler, intervalMs = pollMs) {
  const tick = async () => {
    if (!running) return;
    await processDueJobs(handler).catch((error) => console.error('worker_error', error));
    if (running) setTimeout(tick, intervalMs);
  };
  tick();
  return () => { running = false; };
}

if (process.argv[1]?.endsWith('/worker.js')) {
  startWorker(async (job) => console.log(`processing scheduled campaign ${job.campaignId}`));
}
