/**
 * @file middleware/rateLimiter.js
 * @description Pre-configured rate-limiter instances for different route groups.
 */

const rateLimit = require('express-rate-limit');
const { HTTP } = require('../config/constants');
const config = require('../config/env');

/**
 * Factory that builds a rate limiter with a consistent error format.
 * @param {import('express-rate-limit').Options} opts
 * @returns {import('express').RequestHandler}
 */
function buildLimiter(opts) {
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    handler(_req, res) {
      res.status(HTTP.TOO_MANY_REQUESTS).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    },
    ...opts,
  });
}

/** General API rate limiter — 1000 requests per 15 minutes per IP. */
const generalLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

/** Auth endpoints — 100 requests per 15 minutes per IP (dev-friendly). */
const authLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

/**
 * AI analysis limiter — limited per user per day.
 * Uses the authenticated user's ID as the key so the limit is per-account,
 * not per-IP.
 */
const analysisLimiter = buildLimiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: config.aiScansPerDay,
  keyGenerator(req) {
    // req.user is populated by the auth middleware that runs before this
    return req.user ? req.user.id : req.ip;
  },
  message: `You have exceeded the daily limit of ${config.aiScansPerDay} AI analyses. Please try again tomorrow.`,
});

module.exports = {
  generalLimiter,
  authLimiter,
  analysisLimiter,
};
