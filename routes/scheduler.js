import express from 'express';
import { schedulePost, getQueue, startScheduler } from '../services/scheduler.js';

const router = express.Router();

router.post('/schedule', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const { igAccountId, type, imageUrl, videoUrl, caption, scheduledAt } = req.body;
  if (!igAccountId || !scheduledAt) return res.status(400).json({ error: 'Faltan datos' });
  try {
    schedulePost({ userId, igAccountId, type: type || 'image', imageUrl, videoUrl, caption, scheduledAt, status: 'pending' });
    res.json({ success: true, message: 'Post programado' });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.get('/queue', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const queue = getQueue().filter(p => p.userId === userId);
  res.json({ success: true, queue });
});

export default router;
