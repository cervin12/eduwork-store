// policyMiddleware.js
const { ForbiddenError } = require('@casl/ability');

function policy_check(action, subject) {
  return function(req, res, next) {
    const ability = req.ability; // Assuming req.ability is set by decodeToken middleware

    if (!ability) {
      return res.status(500).json({
        error: 1,
        message: 'Ability not defined. Ensure that decodeToken middleware is used.',
      });
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan(action, subject);
      next();
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return res.status(403).json({
          error: 1,
          message: `You are not allowed to ${action} ${subject}`,
        });
      }
      next(error); // Pass other errors to the global error handler
    }
  };
}

module.exports = {
  policy_check,
};
