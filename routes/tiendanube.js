import express from 'express';
import { getTiendanubeProducts, getTiendanubeStore } from '../services/tiendanube.js';
import { syncFromTiendanube } from '../services/catalog.js';
const router = express.Router();

router.get('/products', async function(req, res) {
  const storeId = process.env.TN_STORE_ID;
  const token = process.env.TN_ACCESS_TOKEN;
  if (!storeId || !token) return res.status(400).json({ error: 'TN_STORE_ID y TN_ACCESS_TOKEN requeridos' });
  try {
    const products = await getTiendanubeProducts(storeId, token);
    res.json({ success: true, total: products.length, products });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.get('/store', async function(req, res) {
  const storeId = process.env.TN_STORE_ID;
  const token = process.env.TN_ACCESS_TOKEN;
  if (!storeId || !token) return res.status(400).json({ error: 'TN_STORE_ID y TN_ACCESS_TOKEN requeridos' });
  try {
    const store = await getTiendanubeStore(storeId, token);
    res.json({ success: true, store });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.post('/sync-meta', async function(req, res) {
  const userId = req.session && req.session.userId;
  const storeId = process.env.TN_STORE_ID;
  const token = process.env.TN_ACCESS_TOKEN;
  const catalogId = req.body.catalogId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  if (!catalogId) return res.status(400).json({ error: 'catalogId requerido' });
  try {
    const products = await getTiendanubeProducts(storeId, token);
    const results = await syncFromTiendanube(userId, catalogId, products);
    res.json({ success: true, synced: results.filter(r => r.status === 'ok').length, results });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

export default router;
