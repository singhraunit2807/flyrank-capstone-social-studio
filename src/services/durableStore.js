import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const FILE = process.env.STORE_FILE || './data/campaigns.json';
let state = { campaigns: {}, jobs: {} };
let loaded = false;
let writeQueue = Promise.resolve();

export async function loadStore() {
  if (loaded) return state;
  try { state = JSON.parse(await readFile(FILE, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  state.campaigns ??= {};
  state.jobs ??= {};
  loaded = true;
  return state;
}

export function snapshotStore() { return structuredClone(state); }

export function replaceStore(next) {
  state = next;
  state.campaigns ??= {};
  state.jobs ??= {};
  loaded = true;
  writeQueue = writeQueue.then(async () => {
    await mkdir(dirname(FILE), { recursive: true });
    const temp = `${FILE}.tmp`;
    await writeFile(temp, JSON.stringify(state, null, 2), 'utf8');
    await rename(temp, FILE);
  });
  return writeQueue;
}

export function getStorePath() { return FILE; }
