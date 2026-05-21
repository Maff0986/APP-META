require('dotenv').config();

const scheduler = require('../services/scheduler.service');

const POLL_INTERVAL_MS = 60 * 1000;

async function runOnce() {
  try {
    const duePosts = await scheduler.duePosts();
    if (!duePosts.length) {
      console.log(`[worker] ${new Date().toISOString()} — 0 due posts`);
      return;
    }
    console.log(`[worker] ${new Date().toISOString()} — ${duePosts.length} due post(s) found`);

    for (const post of duePosts) {
      console.log(`[worker] Publishing post ${post.id} …`);
      const result = await scheduler.publishNow(post.id);
      console.log(`[worker] Post ${post.id} → ${result.status}`, result.metaResponse || '');
    }
  } catch (err) {
    console.error('[worker] Error:', err.message);
  }
}

function startWorker() {
  console.log('[worker] Scheduler worker started — polling every', POLL_INTERVAL_MS / 1000, 's');
  runOnce();
  setInterval(runOnce, POLL_INTERVAL_MS);
}

startWorker();
