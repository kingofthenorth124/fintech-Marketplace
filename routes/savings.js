
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Savings endpoint' });
});

module.exports = router;
