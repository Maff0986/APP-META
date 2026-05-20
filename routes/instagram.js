import express from 'express';
import { getIGAccounts, publishImage, publishReel, getRecentPosts } from '../services/instagram.js';

const router = express.Router();

// GET /instagram/accounts - cuentas conectadas
router.get('/accounts', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  try {
    const accounts = await getIGAccounts(userId);
    res.json({ success: true, accounts: accounts });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /instagram/publish/image
router.post('/publish/image', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const { igAccountId, imageUrl, caption } = req.body;
  if (!igAccountId || !imageUrl) return res.status(400).json({ error: 'Faltan datos: igAccountId, imageUrl' });
  try {
    const result = await publishImage(userId, igAccountId, imageUrl, caption || '');
    res.json(result);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /instagram/publish/reel
router.post('/publish/reel', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const { igAccountId, videoUrl, caption } = req.body;
  if (!igAccountId || !videoUrl) return res.status(400).json({ error: 'Faltan datos: igAccountId, videoUrl' });
  try {
    const result = await publishReel(userId, igAccountId, videoUrl, caption || '');
    res.json(result);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /instagram/posts/:igAccountId
router.get('/posts/:igAccountId', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  try {
    const posts = await getRecentPosts(userId, req.params.igAccountId);
    res.json({ success: true, posts: posts });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
