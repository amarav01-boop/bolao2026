const express = require('express');

const { loadEnv } = require('../config/env');
const { successResponse } = require('../utils/api-response');

const router = express.Router();

router.get('/', (req, res) => {
  const env = loadEnv();

  return res.json(
    successResponse({
      status: 'ok',
      environment: env.NODE_ENV,
      service: 'bolao2026-api'
    })
  );
});

module.exports = router;
