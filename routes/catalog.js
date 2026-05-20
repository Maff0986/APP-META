import express from 'express';
import { getCatalogs, createProduct, updateProduct, deleteProduct, syncFromTiendanube } from '../services/catalog.js';

const router = express.Router();

router.get('/list', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  try {
    const catalogs = await getCatalogs(userId);
    res.json({ success: true, catalogs });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.post('/product', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const { catalogId, product } = req.body;
  if (!catalogId || !product) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const result = await createProduct(userId, catalogId, product);
    res.json({ success: true, result });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.post('/sync/tiendanube', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const { catalogId, products } = req.body;
  if (!catalogId || !products) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const results = await syncFromTiendanube(userId, catalogId, products);
    res.json({ success: true, results });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.put('/product/:id', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  try {
    const result = await updateProduct(userId, req.params.id, req.body);
    res.json({ success: true, result });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.delete('/product/:id', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  try {
    await deleteProduct(userId, req.params.id);
    res.json({ success: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

export default router;
