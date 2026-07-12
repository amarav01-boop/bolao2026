const express = require('express');

const { collectMetrics } = require('../observability/metrics');

const router = express.Router();

router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  return res.status(200).send(collectMetrics());
});

module.exports = router;
