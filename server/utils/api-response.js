function successResponse(data = {}, meta = {}) {
  return {
    data,
    ...(meta && Object.keys(meta).length ? { meta } : {})
  };
}

function errorResponse(code, message, details = undefined) {
  return {
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  };
}

module.exports = {
  successResponse,
  errorResponse
};
