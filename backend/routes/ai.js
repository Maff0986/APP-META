const express = require('express');
const router = express.Router();
const aiService = require('../services/ai.service');

// POST /ai/suggest — {content, platform} → calls suggestContent, returns AI-generated caption variants + hashtags
router.post('/suggest', async (req, res) => {
  try {
    const { productName, productImage, platform } = req.body;
    if (!productName) {
      return res.status(400).json({ success: false, error: 'productName is required' });
    }
    
    const result = await aiService.suggestContent({ productName, productImage, platform });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /ai/validate — {content, platform} → returns validation result from validateContent
router.post('/validate', async (req, res) => {
  try {
    const { content, platform } = req.body;
    if (content === undefined || !platform) {
      return res.status(400).json({ success: false, error: 'content and platform are required' });
    }
    
    const result = aiService.validateContent({ content, platform });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /ai/chat — {message, context} → calls ask() with message+context, returns AI response
router.post('/chat', async (req, res) => {
  try {
    const { message, context = '', platform = 'instagram' } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'message is required' });
    }
    
    const result = await aiService.ask({ prompt: message, context, platform });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /ai/health — checks AI_BASE_URL connectivity (Ollama: GET /api/tags, OpenAI: GET /models) returns {status, provider, model}
router.get('/health', async (req, res) => {
  try {
    const result = await aiService.healthCheck();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;