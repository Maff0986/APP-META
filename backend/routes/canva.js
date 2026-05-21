const express = require('express');
const router = express.Router();
const {
  authenticate,
  exchangeCode,
  listTemplates,
  createDesign,
  exportImage,
  saveAsset,
  getAssetById,
  listAssets
} = require('../services/canva.service');

router.get('/auth', (req, res) => {
  try {
    const authUrl = authenticate();
    res.redirect(authUrl);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Missing authorization code' });
    }
    const tokenData = await exchangeCode(code);
    req.session.canvaToken = tokenData.access_token;
    req.session.canvaRefreshToken = tokenData.refresh_token;
    res.redirect('/canva');
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/templates', async (req, res) => {
  try {
    const accessToken = req.session.canvaToken;
    if (!accessToken) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    const result = await listTemplates(accessToken);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/designs', async (req, res) => {
  try {
    const accessToken = req.session.canvaToken;
    if (!accessToken) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    const { templateId, title, customization } = req.body;
    const result = await createDesign(accessToken, { templateId, title, customization });
    await saveAsset({
      ...result,
      name: title || 'Untitled Design',
      type: 'design'
    });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assets', async (req, res) => {
  try {
    const assets = await listAssets();
    res.json({ success: true, assets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/designs/:id/preview', async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await getAssetById(id);
    if (!asset) {
      return res.status(404).json({ success: false, error: 'Design not found' });
    }
    if (!asset.previewUrl && req.session.canvaToken) {
      const exportResult = await exportImage(req.session.canvaToken, asset.designId);
      asset.previewUrl = exportResult.url;
      await asset.save();
    }
    res.json({
      success: true,
      previewUrl: asset.previewUrl,
      editUrl: asset.editUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/export/:designId', async (req, res) => {
  try {
    const accessToken = req.session.canvaToken;
    if (!accessToken) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    const { designId } = req.params;
    const format = req.query.format || 'png';
    const result = await exportImage(accessToken, designId, format);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;