import axios from 'axios';
const TN_API = 'https://api.tiendanube.com/v1';

export async function getTiendanubeProducts(storeId, token) {
  const res = await axios.get(TN_API + '/' + storeId + '/products', {
    headers: { 'Authentication': 'bearer ' + token, 'User-Agent': 'Shopinista Meta' },
    params: { per_page: 50 }
  });
  return res.data.map(p => ({
    id: p.id.toString(),
    sku: p.variants && p.variants[0] ? p.variants[0].sku : p.id.toString(),
    name: p.name && p.name.es ? p.name.es : p.name,
    description: p.description && p.description.es ? p.description.es : '',
    price: p.variants && p.variants[0] ? parseFloat(p.variants[0].price) : 0,
    imageUrl: p.images && p.images[0] ? p.images[0].src : '',
    url: p.canonical_url || ''
  }));
}

export async function getTiendanubeStore(storeId, token) {
  const res = await axios.get(TN_API + '/' + storeId + '/store', {
    headers: { 'Authentication': 'bearer ' + token, 'User-Agent': 'Shopinista Meta' }
  });
  return res.data;
}
