const express = require('express');

const { requireAuth } = require('../middleware/require-auth');
const { asyncRoute } = require('../utils/async-route');
const { successResponse } = require('../utils/api-response');
const revealService = require('../services/reveal-service');

const router = express.Router();

router.get(
  '/',
  requireAuth,
  asyncRoute(async (req, res) => {
    const reveal = await revealService.getRevealState(req.session, req.query.participantId);
    return res.json(successResponse(reveal));
  })
);

module.exports = router;
