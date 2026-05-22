const express = require('express');
const router = express.Router();
const { fetchProducts, syncProducts, getFeedImageUrls } = require('../services/tiendanube.service');

const storeUrl = process.env.TIENDANUBE_STORE_URL || '';
const hasToken = !!process.env.TIENDANUBE_API_TOKEN;

// GET /tiendanube/health
router.get('/health', (req, res) => {
  try {
    const ok = storeUrl.length > 0 && hasToken;
    res.json({
      success: true,
      status: ok ? 'ok' : 'misconfigured',
      store_url: storeUrl || null,
      token_present: hasToken,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /tiendanube/products
router.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const products = await fetchProducts({ limit });
    res.json({ success: true, products, count: products.length });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /tiendanube/sync
router.post('/sync', async (req, res) => {
  try {
    const limit = typeof req.body.limit === 'number' ? req.body.limit : 50;
    const { synced, errors } = await syncProducts({ limit });
    res.json({
      success: true,
      synced,
      errors,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /tiendanube/images/feed
router.get('/images/feed', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const imageUrls = await getFeedImageUrls({ limit, publishedOnly: true });
    res.json({ success: true, imageUrls, count: imageUrls.length });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
