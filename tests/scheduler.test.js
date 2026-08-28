import test from 'node:test';
import assert from 'node:assert/strict';
import { rm } from 'node:fs/promises';

process.env.STORE_FILE = './data/test-campaigns.json';
const { scheduleCampaign, claimDueJobs, completeJob, recoverStaleJobs } = await import('../src/scheduler.js');
const { loadStore } = await import('../src/services/durableStore.js');

test('scheduled job survives module reload and is claimable after its due time', async () => {
  await rm('./data/test-campaigns.json', { force: true });
  const campaignId = 'campaign-durable-1';
  const job = await scheduleCampaign(campaignId, new Date(Date.now() - 1000));
  const due = await claimDueJobs(new Date());
  assert.equal(due.length, 1);
  assert.equal(due[0].id, job.id);
  await completeJob(job.id);
});

test('stale running job is returned to scheduled state', async () => {
  const state = await loadStore();
  state.jobs.stale = { id: 'stale', campaignId: 'c', runAt: new Date().toISOString(), status: 'running', attempts: 1, claimedAt: new Date(Date.now() - 600000).toISOString() };
  const { replaceStore } = await import('../src/services/durableStore.js');
  await replaceStore(state);
  const jobs = await recoverStaleJobs(60000);
  assert.equal(jobs.stale.status, 'scheduled');
  await rm('./data/test-campaigns.json', { force: true });
});
