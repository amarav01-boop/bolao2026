const { errorResponse } = require('../utils/api-response');

function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  return res.status(401).json(errorResponse('AUTH_REQUIRED', 'É necessário fazer login.'));
}

module.exports = {
  requireAuth
};
