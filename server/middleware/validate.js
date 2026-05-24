const { errorResponse } = require('../utils/api-response');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json(
        errorResponse('VALIDATION_ERROR', 'A validação da requisição falhou.', {
          issues: result.error.issues
        })
      );
    }

    req[source] = result.data;
    return next();
  };
}

module.exports = {
  validate
};
