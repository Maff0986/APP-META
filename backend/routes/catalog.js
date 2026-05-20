const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'catalog route OK' });
});

module.exports = router;
