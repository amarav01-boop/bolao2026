const express = require('express');

const { asyncRoute } = require('../utils/async-route');
const { successResponse } = require('../utils/api-response');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/require-auth');
const chatService = require('../services/chat-service');
const {
  chatMessageCreateSchema,
  chatMessageListSchema
} = require('../schemas/chat-schemas');

const router = express.Router();

router.get(
  '/messages',
  requireAuth,
  validate(chatMessageListSchema, 'query'),
  asyncRoute(async (req, res) => {
    const result = await chatService.listMessages(req.session, req.query);
    return res.json(successResponse(result));
  })
);

router.get(
  '/participants',
  requireAuth,
  asyncRoute(async (req, res) => {
    const result = await chatService.listParticipants(req.session);
    return res.json(successResponse(result));
  })
);

router.post(
  '/messages',
  requireAuth,
  validate(chatMessageCreateSchema),
  asyncRoute(async (req, res) => {
    const result = await chatService.createMessage(req.session, req.body);
    return res.status(201).json(successResponse(result));
  })
);

module.exports = router;
