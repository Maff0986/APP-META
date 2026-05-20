const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'tiendanube route OK' });
});

module.exports = router;
