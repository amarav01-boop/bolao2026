const { errorResponse } = require('../utils/api-response');

function notFoundHandler(req, res) {
  return res.status(404).json(errorResponse('NOT_FOUND', 'Rota não encontrada.'));
}

function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const code = err.code || (status === 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR');
  const message = status === 500 ? 'Erro inesperado no servidor.' : err.message || 'A requisição falhou.';
  const details = err.details || (process.env.NODE_ENV === 'production' ? undefined : { stack: err.stack });

  return res.status(status).json(errorResponse(code, message, details));
}

module.exports = {
  notFoundHandler,
  errorHandler
};
