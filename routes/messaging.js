import express from 'express';
import { sendDM, replyToComment, getConversations, autoReply } from '../services/messaging.js';

const router = express.Router();

router.post('/dm', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const { igAccountId, recipientId, message } = req.body;
  if (!igAccountId || !recipientId || !message) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const result = await sendDM(userId, igAccountId, recipientId, message);
    res.json({ success: true, result });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.post('/reply/:commentId', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const { message } = req.body;
  try {
    const result = await replyToComment(userId, req.params.commentId, message);
    res.json({ success: true, result });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.get('/conversations/:igAccountId', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  try {
    const convs = await getConversations(userId, req.params.igAccountId);
    res.json({ success: true, conversations: convs });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

export default router;
