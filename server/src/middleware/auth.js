/**
 * @file middleware/auth.js
 * @description JWT authentication middleware.
 *
 * Extracts the token from:
 *   1. `Authorization: Bearer <token>` header
 *   2. `token` httpOnly cookie
 *
 * Attaches `req.user = { id, role }` on success.
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { HTTP } = require('../config/constants');

/**
 * Express middleware that verifies the JWT and populates `req.user`.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function authMiddleware(req, res, next) {
  let token = null;

  // 1. Try Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }

  // 2. Fall back to cookie
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(HTTP.UNAUTHORIZED).json({
      success: false,
      message: 'Authentication required. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Token has expired. Please log in again.'
        : 'Invalid authentication token.';
    return res.status(HTTP.UNAUTHORIZED).json({ success: false, message });
  }
}

module.exports = authMiddleware;
