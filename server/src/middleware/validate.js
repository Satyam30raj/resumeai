/**
 * @file middleware/validate.js
 * @description Express-validator wrapper that sends a consistent error response
 *              when validation fails.
 */

const { validationResult } = require('express-validator');
const { HTTP } = require('../config/constants');

/**
 * Returns an Express middleware that runs the provided validation chains
 * and, if any fail, responds with a 422 error listing all problems.
 *
 * @param {import('express-validator').ValidationChain[]} validations
 *   Array of express-validator validation chains.
 * @returns {import('express').RequestHandler}
 *
 * @example
 *   router.post('/signup', validate([
 *     body('email').isEmail(),
 *     body('password').isLength({ min: 8 }),
 *   ]), authController.signup);
 */
function validate(validations) {
  return async (req, res, next) => {
    // Run every validation chain in parallel
    await Promise.all(validations.map((v) => v.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(HTTP.UNPROCESSABLE).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  };
}

module.exports = validate;
