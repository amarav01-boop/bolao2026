const express = require('express');

const { requireAuth } = require('../middleware/require-auth');
const { asyncRoute } = require('../utils/async-route');
const { successResponse } = require('../utils/api-response');
const rankingService = require('../services/ranking-service');

const router = express.Router();

router.get(
  '/',
  requireAuth,
  asyncRoute(async (req, res) => {
    const ranking = await rankingService.getRanking();
    return res.json(successResponse(ranking));
  })
);

module.exports = router;
