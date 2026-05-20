import axios from 'axios';
import MetaToken from '../models/MetaToken.js';

const GRAPH = 'https://graph.facebook.com/v19.0';

async function getToken(userId) {
  const r = await MetaToken.findOne({ where: { userId } });
  if (!r) throw new Error('Meta no conectado');
  return r.accessToken;
}

// Obtener catalogo del negocio
export async function getCatalogs(userId) {
  const token = await getToken(userId);
  const res = await axios.get(GRAPH + '/me/owned_product_catalogs', {
    params: { access_token: token, fields: 'id,name,product_count' }
  });
  return res.data.data || [];
}

// Crear producto en catalogo
export async function createProduct(userId, catalogId, product) {
  const token = await getToken(userId);
  const res = await axios.post(GRAPH + '/' + catalogId + '/products', {
    retailer_id: product.sku || product.id,
    name:        product.name,
    description: product.description || '',
    price:       Math.round(product.price * 100),
    currency:    'MXN',
    availability: 'in stock',
    condition:   'new',
    image_url:   product.imageUrl,
    url:         product.url
  }, {
    params: { access_token: token }
  });
  return res.data;
}

// Actualizar producto
export async function updateProduct(userId, productId, fields) {
  const token = await getToken(userId);
  const res = await axios.post(GRAPH + '/' + productId, fields, {
    params: { access_token: token }
  });
  return res.data;
}

// Eliminar producto
export async function deleteProduct(userId, productId) {
  const token = await getToken(userId);
  await axios.delete(GRAPH + '/' + productId, {
    params: { access_token: token }
  });
  return { success: true };
}

// Sync batch de productos desde Tiendanube
export async function syncFromTiendanube(userId, catalogId, products) {
  const results = [];
  for (const product of products) {
    try {
      const r = await createProduct(userId, catalogId, product);
      results.push({ id: product.id, status: 'ok', metaId: r.id });
    } catch(err) {
      results.push({ id: product.id, status: 'error', error: err.message });
    }
  }
  return results;
}
