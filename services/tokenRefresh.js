import axios from 'axios';
import MetaToken from '../models/MetaToken.js';
import { Op } from 'sequelize';
const GRAPH = 'https://graph.facebook.com/v19.0';

export async function refreshToken(record) {
  try {
    const res = await axios.get(GRAPH + '/oauth/access_token', {
      params: { grant_type: 'fb_exchange_token', client_id: process.env.META_APP_ID, client_secret: process.env.META_APP_SECRET, fb_exchange_token: record.accessToken }
    });
    await record.update({ accessToken: res.data.access_token, expiresAt: new Date(Date.now() + res.data.expires_in * 1000) });
    console.log('[TokenRefresh] Token renovado para userId:', record.userId);
    return true;
  } catch(err) { console.error('[TokenRefresh] Error:', err.message); return false; }
}

export async function checkAndRefreshTokens() {
  const sevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const expiring = await MetaToken.findAll({ where: { expiresAt: { [Op.lt]: sevenDays } } });
  for (const record of expiring) { await refreshToken(record); }
}

export function startTokenRefreshJob() {
  console.log('[TokenRefresh] Job iniciado');
  checkAndRefreshTokens();
  setInterval(checkAndRefreshTokens, 24 * 60 * 60 * 1000);
}
