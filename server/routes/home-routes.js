const express = require('express');

const { requireAuth } = require('../middleware/require-auth');
const { asyncRoute } = require('../utils/async-route');
const { successResponse } = require('../utils/api-response');
const homeService = require('../services/home-service');

const router = express.Router();

router.get(
  '/',
  requireAuth,
  asyncRoute(async (req, res) => {
    const home = await homeService.getHomeState(req.session);
    return res.json(successResponse(home));
  })
);

module.exports = router;
