const express = require('express');
const router = express.Router();
const authController = require('../controllers/authMetaController');

// Redirige al login de Meta usando la función loginUrl existente
router.get('/login', (req, res) => {
  const url = authController.loginUrl();
  res.redirect(url);
});

// Callback de Meta OAuth (ya implementado en tu controlador)
router.get('/callback', authController.callback);

// GET /oauth/meta/status - Check Meta connection status
router.get('/status', (req, res) => {
  const hasToken = req.session?.metaToken;
  res.json({
    success: true,
    connected: !!hasToken,
    pages: hasToken ? [{ id: 'page1', name: 'Mi Página' }] : []
  });
});

module.exports = router;
