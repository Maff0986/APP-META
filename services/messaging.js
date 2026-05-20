import axios from 'axios';
import MetaToken from '../models/MetaToken.js';

const GRAPH = 'https://graph.facebook.com/v19.0';

async function getToken(userId) {
  const r = await MetaToken.findOne({ where: { userId } });
  if (!r) throw new Error('Meta no conectado');
  return r.accessToken;
}

// Enviar mensaje directo
export async function sendDM(userId, igAccountId, recipientId, message) {
  const token = await getToken(userId);
  const res = await axios.post(GRAPH + '/' + igAccountId + '/messages', {
    recipient: { id: recipientId },
    message:   { text: message }
  }, {
    params: { access_token: token }
  });
  return res.data;
}

// Respuesta automatica a comentarios
export async function replyToComment(userId, commentId, message) {
  const token = await getToken(userId);
  const res = await axios.post(GRAPH + '/' + commentId + '/replies', {
    message: message
  }, {
    params: { access_token: token }
  });
  return res.data;
}

// Obtener conversaciones
export async function getConversations(userId, igAccountId) {
  const token = await getToken(userId);
  const res = await axios.get(GRAPH + '/' + igAccountId + '/conversations', {
    params: { access_token: token, fields: 'id,participants,updated_time' }
  });
  return res.data.data || [];
}

// Auto-responder DMs con palabra clave
export async function autoReply(userId, igAccountId, senderId, incomingText, rules) {
  const text = incomingText.toLowerCase();
  for (const rule of rules) {
    if (text.includes(rule.keyword.toLowerCase())) {
      await sendDM(userId, igAccountId, senderId, rule.response);
      return { replied: true, rule: rule.keyword };
    }
  }
  return { replied: false };
}
