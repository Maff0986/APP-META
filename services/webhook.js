import crypto from 'crypto';

const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'shopinista2026';

// Verificar firma de Meta
export function verifySignature(req) {
  const sig = req.headers['x-hub-signature-256'];
  if (!sig) return false;
  const expected = 'sha256=' + crypto
    .createHmac('sha256', process.env.META_APP_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

// Procesar eventos de webhook
export function processEvent(body) {
  const entry = body.entry && body.entry[0];
  if (!entry) return null;

  const changes = entry.changes && entry.changes[0];
  if (!changes) return null;

  const field = changes.field;
  const value = changes.value;

  switch(field) {
    case 'mentions':
      console.log('[Webhook] Mencion recibida:', value);
      return { type: 'mention', data: value };

    case 'comments':
      console.log('[Webhook] Comentario recibido:', value);
      return { type: 'comment', data: value };

    case 'messages':
      console.log('[Webhook] Mensaje recibido:', value);
      return { type: 'message', data: value };

    case 'feed':
      console.log('[Webhook] Cambio en feed:', value);
      return { type: 'feed', data: value };

    default:
      console.log('[Webhook] Evento:', field, value);
      return { type: field, data: value };
  }
}
