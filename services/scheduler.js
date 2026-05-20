import { publishImage, publishReel } from './instagram.js';

// Cola de publicaciones programadas (en memoria - mejorar con DB)
const queue = [];
let schedulerRunning = false;

// Agregar a la cola
export function schedulePost(post) {
  queue.push({ ...post, createdAt: new Date() });
  console.log('[Scheduler] Post agregado a la cola. Total:', queue.length);
  if (!schedulerRunning) startScheduler();
}

// Ver cola actual
export function getQueue() {
  return queue;
}

// Iniciar scheduler
export function startScheduler() {
  schedulerRunning = true;
  console.log('[Scheduler] Iniciado');

  setInterval(async () => {
    const now = new Date();
    const pending = queue.filter(p => new Date(p.scheduledAt) <= now && p.status !== 'published');

    for (const post of pending) {
      try {
        let result;
        if (post.type === 'reel') {
          result = await publishReel(post.userId, post.igAccountId, post.videoUrl, post.caption);
        } else {
          result = await publishImage(post.userId, post.igAccountId, post.imageUrl, post.caption);
        }
        post.status = 'published';
        post.publishedAt = new Date();
        post.postId = result.postId;
        console.log('[Scheduler] Publicado:', post.postId);
      } catch(err) {
        post.status = 'error';
        post.error = err.message;
        console.error('[Scheduler] Error:', err.message);
      }
    }
  }, 60000); // revisa cada minuto
}
