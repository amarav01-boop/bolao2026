const express = require('express');

const { loadEnv } = require('../config/env');
const { asyncRoute } = require('../utils/async-route');
const { successResponse } = require('../utils/api-response');
const { validate } = require('../middleware/validate');
const authService = require('../services/auth-service');
const { loginSchema, registrationSchema } = require('../schemas/auth-schemas');

const env = loadEnv();

const router = express.Router();

function saveSession(session) {
  return new Promise((resolve, reject) => {
    session.save((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function destroySession(session, res, cookieName) {
  return new Promise((resolve, reject) => {
    if (!session || typeof session.destroy !== 'function') {
      res.clearCookie(cookieName, { path: '/' });
      resolve();
      return;
    }

    session.destroy((error) => {
      if (error) {
        reject(error);
        return;
      }

      res.clearCookie(cookieName, { path: '/' });
      resolve();
    });
  });
}

router.get(
  '/registration-state',
  asyncRoute(async (req, res) => {
    const registrationState = await authService.getRegistrationState();
    return res.json(successResponse(registrationState));
  })
);

router.get(
  '/session',
  asyncRoute(async (req, res) => {
    const participant = await authService.getCurrentSessionParticipant(req.session);
    return res.json(successResponse({ participant }));
  })
);

router.post(
  '/login',
  validate(loginSchema),
  asyncRoute(async (req, res) => {
    const result = await authService.loginParticipant(req.body);
    req.session.user = result.participant;
    await saveSession(req.session);

    return res.json(successResponse(result));
  })
);

router.post(
  '/logout',
  asyncRoute(async (req, res) => {
    await destroySession(req.session, res, env.SESSION_COOKIE_NAME);

    return res.json(successResponse({ loggedOut: true }));
  })
);

router.post(
  '/register',
  validate(registrationSchema),
  asyncRoute(async (req, res) => {
    const result = await authService.registerParticipant(req.body);
    req.session.user = result.participant;
    await saveSession(req.session);

    return res.status(201).json(successResponse(result));
  })
);

module.exports = router;
