import axios from 'axios';
import MetaToken from '../models/MetaToken.js';

const GRAPH_URL = 'https://graph.facebook.com/v19.0';

// Obtener token del usuario
async function getToken(userId) {
  const record = await MetaToken.findOne({ where: { userId: userId } });
  if (!record) throw new Error('Usuario no tiene Meta conectado');
  return record.accessToken;
}

// Obtener cuentas de Instagram conectadas
export async function getIGAccounts(userId) {
  const token = await getToken(userId);
  const res = await axios.get(GRAPH_URL + '/me/accounts', {
    params: { access_token: token, fields: 'id,name,instagram_business_account' }
  });
  const pages = res.data.data || [];
  const igAccounts = pages
    .filter(p => p.instagram_business_account)
    .map(p => ({ pageId: p.id, pageName: p.name, igId: p.instagram_business_account.id }));
  return igAccounts;
}

// Publicar imagen en Instagram
export async function publishImage(userId, igAccountId, imageUrl, caption) {
  const token = await getToken(userId);

  // Paso 1: Crear contenedor
  const containerRes = await axios.post(GRAPH_URL + '/' + igAccountId + '/media', null, {
    params: { image_url: imageUrl, caption: caption, access_token: token }
  });
  const containerId = containerRes.data.id;

  // Paso 2: Publicar contenedor
  const publishRes = await axios.post(GRAPH_URL + '/' + igAccountId + '/media_publish', null, {
    params: { creation_id: containerId, access_token: token }
  });

  return { success: true, postId: publishRes.data.id };
}

// Publicar reel en Instagram
export async function publishReel(userId, igAccountId, videoUrl, caption) {
  const token = await getToken(userId);

  // Paso 1: Crear contenedor de video
  const containerRes = await axios.post(GRAPH_URL + '/' + igAccountId + '/media', null, {
    params: { media_type: 'REELS', video_url: videoUrl, caption: caption, access_token: token }
  });
  const containerId = containerRes.data.id;

  // Paso 2: Esperar que Meta procese el video
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Paso 3: Verificar estado
  const statusRes = await axios.get(GRAPH_URL + '/' + containerId, {
    params: { fields: 'status_code', access_token: token }
  });

  if (statusRes.data.status_code !== 'FINISHED') {
    throw new Error('Video aun procesando, intenta publicar en unos segundos');
  }

  // Paso 4: Publicar
  const publishRes = await axios.post(GRAPH_URL + '/' + igAccountId + '/media_publish', null, {
    params: { creation_id: containerId, access_token: token }
  });

  return { success: true, postId: publishRes.data.id };
}

// Obtener publicaciones recientes
export async function getRecentPosts(userId, igAccountId) {
  const token = await getToken(userId);
  const res = await axios.get(GRAPH_URL + '/' + igAccountId + '/media', {
    params: { fields: 'id,caption,media_type,timestamp,permalink', access_token: token }
  });
  return res.data.data || [];
}
