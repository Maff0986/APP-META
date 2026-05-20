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

module.exports = router;
