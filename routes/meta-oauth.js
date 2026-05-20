import express from 'express';
import axios from 'axios';
import MetaToken from '../models/MetaToken.js';

const router = express.Router();
const { META_APP_ID, META_APP_SECRET, META_REDIRECT_URI } = process.env;

const SCOPES = [
  'pages_manage_posts',
  'pages_read_engagement',
  'instagram_basic',
  'instagram_content_publish',
].join(',');

// GET /auth/meta - Iniciar OAuth
router.get('/', (req, res) => {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const params = new URLSearchParams({
    client_id:     META_APP_ID,
    redirect_uri:  META_REDIRECT_URI,
    scope:         SCOPES,
    response_type: 'code',
    state:         userId,
  });
  res.redirect('https://www.facebook.com/v19.0/dialog/oauth?' + params);
});

// GET /auth/meta/callback
router.get('/callback', async function(req, res) {
  const code   = req.query.code;
  const userId = req.query.state;
  const error  = req.query.error;
  if (error) return res.redirect('/dashboard?error=meta_denied');
  if (!code || !userId) return res.status(400).json({ error: 'Parametros invalidos' });
  try {
    const shortRes = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
      params: { client_id: META_APP_ID, client_secret: META_APP_SECRET, redirect_uri: META_REDIRECT_URI, code: code }
    });
    const shortToken = shortRes.data.access_token;
    const longRes = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
      params: { grant_type: 'fb_exchange_token', client_id: META_APP_ID, client_secret: META_APP_SECRET, fb_exchange_token: shortToken }
    });
    const longToken = longRes.data.access_token;
    const expiresIn = longRes.data.expires_in;
    const userRes = await axios.get('https://graph.facebook.com/v19.0/me', {
      params: { fields: 'id,name', access_token: longToken }
    });
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    await MetaToken.upsert({
      userId:      userId,
      metaUserId:  userRes.data.id,
      metaName:    userRes.data.name,
      accessToken: longToken,
      expiresAt:   expiresAt
    });
    console.log('[Meta OAuth] Token guardado para usuario ' + userId);
    res.redirect('/dashboard?success=meta_connected');
  } catch(err) {
    console.error('[Meta OAuth] Error:', err.message);
    res.redirect('/dashboard?error=meta_oauth_failed');
  }
});

// GET /auth/meta/status
router.get('/status', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  try {
    const token = await MetaToken.findOne({ where: { userId: userId } });
    if (!token) return res.json({ connected: false });
    const isExpired = token.expiresAt && new Date() > new Date(token.expiresAt);
    res.json({ connected: true, metaName: token.metaName, expiresAt: token.expiresAt, isExpired: isExpired });
  } catch(err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// DELETE /auth/meta/disconnect
router.delete('/disconnect', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  try {
    await MetaToken.destroy({ where: { userId: userId } });
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
