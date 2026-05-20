import express from 'express';
import { getAdAccounts, createCampaign, getCampaignInsights, createProductAd } from '../services/marketing.js';

const router = express.Router();

router.get('/accounts', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  try {
    const accounts = await getAdAccounts(userId);
    res.json({ success: true, accounts });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.post('/campaign', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const { adAccountId, campaign } = req.body;
  if (!adAccountId || !campaign) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const result = await createCampaign(userId, adAccountId, campaign);
    res.json({ success: true, result });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.get('/insights/:campaignId', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  try {
    const insights = await getCampaignInsights(userId, req.params.campaignId);
    res.json({ success: true, insights });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.post('/product-ad', async function(req, res) {
  const userId = req.session && req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  const { adAccountId, catalogId, productId, budget } = req.body;
  try {
    const result = await createProductAd(userId, adAccountId, catalogId, productId, budget);
    res.json({ success: true, result });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

export default router;
