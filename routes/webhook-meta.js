import express from 'express';
import { verifySignature, processEvent } from '../services/webhook.js';

const router = express.Router();
const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'shopinista2026';

// GET /webhook - verificacion de Meta
router.get('/', function(req, res) {
  const mode  = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[Webhook] Verificado correctamente');
    return res.status(200).send(challenge);
  }
  res.status(403).json({ error: 'Token invalido' });
});

// POST /webhook - eventos de Meta
router.post('/', express.raw({ type: 'application/json' }), function(req, res) {
  if (!verifySignature(req)) {
    console.error('[Webhook] Firma invalida');
    return res.status(403).json({ error: 'Firma invalida' });
  }
  const body = JSON.parse(req.body);
  const event = processEvent(body);
  console.log('[Webhook] Evento procesado:', event);
  res.status(200).send('EVENT_RECEIVED');
});

export default router;
