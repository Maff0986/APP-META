const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'canva route OK' });
});

module.exports = router;
