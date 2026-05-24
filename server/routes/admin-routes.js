const express = require('express');

const { loadEnv } = require('../config/env');
const { asyncRoute } = require('../utils/async-route');
const { successResponse } = require('../utils/api-response');
const { validate } = require('../middleware/validate');
const { requireAdmin } = require('../middleware/require-admin');
const adminService = require('../services/admin-service');
const {
  adminLoginSchema,
  matchBaseSchema,
  matchUpdateSchema,
  phaseBaseSchema,
  phaseUpdateSchema,
  registrationStateSchema
} = require('../schemas/admin-schemas');

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
  '/session',
  asyncRoute(async (req, res) => {
    const admin = adminService.getAdminSession(req.session);
    return res.json(successResponse({ admin }));
  })
);

router.post(
  '/login',
  validate(adminLoginSchema),
  asyncRoute(async (req, res) => {
    const result = await adminService.loginAdmin(req.body);
    req.session.user = result.admin;
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

router.get(
  '/overview',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const overview = await adminService.getOverview();
    return res.json(successResponse(overview));
  })
);

router.get(
  '/registration-state',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const registrationState = await adminService.getOverview();
    return res.json(successResponse(registrationState.registrationState));
  })
);

router.patch(
  '/registration-state',
  requireAdmin,
  validate(registrationStateSchema),
  asyncRoute(async (req, res) => {
    const registrationState = await adminService.setRegistrationState(req.body.isRegistrationOpen);
    return res.json(successResponse(registrationState));
  })
);

router.get(
  '/phases',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const phases = await adminService.listPhases();
    return res.json(successResponse({ phases }));
  })
);

router.post(
  '/phases',
  requireAdmin,
  validate(phaseBaseSchema),
  asyncRoute(async (req, res) => {
    const phase = await adminService.createPhase(req.body);
    return res.status(201).json(successResponse({ phase }));
  })
);

router.patch(
  '/phases/:phaseId',
  requireAdmin,
  validate(phaseUpdateSchema),
  asyncRoute(async (req, res) => {
    const phase = await adminService.updatePhase(req.params.phaseId, req.body);
    return res.json(successResponse({ phase }));
  })
);

router.get(
  '/matches',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const matches = await adminService.listMatches();
    return res.json(successResponse({ matches }));
  })
);

router.post(
  '/ranking/recalculate',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const result = await adminService.recalculateRanking();
    return res.json(successResponse(result));
  })
);

router.post(
  '/matches',
  requireAdmin,
  validate(matchBaseSchema),
  asyncRoute(async (req, res) => {
    const match = await adminService.createMatch(req.body);
    return res.status(201).json(successResponse({ match }));
  })
);

router.patch(
  '/matches/:matchId',
  requireAdmin,
  validate(matchUpdateSchema),
  asyncRoute(async (req, res) => {
    const match = await adminService.updateMatch(req.params.matchId, req.body);
    return res.json(successResponse({ match }));
  })
);

module.exports = router;
