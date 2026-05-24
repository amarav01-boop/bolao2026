const { errorResponse } = require('../utils/api-response');

function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    return next();
  }

  return res.status(403).json(errorResponse('ADMIN_REQUIRED', 'Acesso de administrador necessário.'));
}

module.exports = {
  requireAdmin
};
