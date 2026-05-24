const express = require('express');

const { asyncRoute } = require('../utils/async-route');
const { successResponse } = require('../utils/api-response');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/require-auth');
const predictionService = require('../services/prediction-service');
const { activePhasePredictionSaveSchema } = require('../schemas/prediction-schemas');

const router = express.Router();

router.get(
  '/active-phase',
  requireAuth,
  asyncRoute(async (req, res) => {
    const state = await predictionService.getActivePhasePredictionState(req.session);
    return res.json(successResponse(state));
  })
);

router.put(
  '/active-phase',
  requireAuth,
  validate(activePhasePredictionSaveSchema),
  asyncRoute(async (req, res) => {
    const state = await predictionService.saveActivePhasePredictions(req.session, req.body);
    return res.json(successResponse(state));
  })
);

module.exports = router;
