import { randomUUID } from 'node:crypto';
import { loadStore, snapshotStore, replaceStore } from './services/durableStore.js';

export async function scheduleCampaign(campaignId, runAt) {
  const state = await loadStore();
  const id = randomUUID();
  state.jobs[id] = { id, campaignId, runAt: new Date(runAt).toISOString(), status: 'scheduled', attempts: 0, createdAt: new Date().toISOString() };
  await replaceStore(state);
  return state.jobs[id];
}

export async function claimDueJobs(now = new Date()) {
  const state = await loadStore();
  const due = Object.values(state.jobs).filter((job) => job.status === 'scheduled' && new Date(job.runAt) <= now);
  for (const job of due) { job.status = 'running'; job.attempts += 1; job.claimedAt = now.toISOString(); }
  if (due.length) await replaceStore(state);
  return due;
}

export async function completeJob(jobId, status = 'completed', error = null) {
  const state = await loadStore();
  const job = state.jobs[jobId];
  if (!job) return null;
  job.status = status;
  if (error) job.error = error;
  job.completedAt = new Date().toISOString();
  await replaceStore(state);
  return job;
}

export async function recoverStaleJobs(timeoutMs = 5 * 60 * 1000) {
  const state = await loadStore();
  const cutoff = Date.now() - timeoutMs;
  let changed = false;
  for (const job of Object.values(state.jobs)) {
    if (job.status === 'running' && job.claimedAt && Date.parse(job.claimedAt) < cutoff) {
      job.status = 'scheduled';
      job.recoveredAt = new Date().toISOString();
      changed = true;
    }
  }
  if (changed) await replaceStore(state);
  return snapshotStore().jobs;
}
