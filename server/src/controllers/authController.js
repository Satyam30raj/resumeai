/**
 * @file controllers/authController.js
 * @description Handles user authentication: signup, login, refresh, profile, and account deletion.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const config = require('../config/env');
const { HTTP } = require('../config/constants');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');

/**
 * Generates a signed JWT for the given user.
 * @param {Object} user - User document.
 * @returns {string} Signed JWT string.
 */
function signToken(user) {
  return jwt.sign(
    { id: user._id || user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

/**
 * Sets the JWT as an httpOnly cookie on the response.
 * @param {import('express').Response} res
 * @param {string} token
 */
function setTokenCookie(res, token) {
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });
}

/**
 * POST /api/auth/signup
 * Creates a new user account and returns a JWT.
 */
const signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for existing user
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(HTTP.CONFLICT).json(
      errorResponse('An account with this email already exists.')
    );
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ email, passwordHash });

  const token = signToken(user);
  setTokenCookie(res, token);

  return res.status(HTTP.CREATED).json(
    successResponse({ user: user.toJSON(), token }, 'Account created successfully.')
  );
});

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select passwordHash since it's excluded by default
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  if (!user) {
    return res.status(HTTP.UNAUTHORIZED).json(
      errorResponse('Invalid email or password.')
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(HTTP.UNAUTHORIZED).json(
      errorResponse('Invalid email or password.')
    );
  }

  const token = signToken(user);
  setTokenCookie(res, token);

  return res.status(HTTP.OK).json(
    successResponse({ user: user.toJSON(), token }, 'Logged in successfully.')
  );
});

/**
 * POST /api/auth/refresh
 * Issues a new JWT if the current one is still valid.
 */
const refresh = asyncHandler(async (req, res) => {
  // req.user is set by auth middleware
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(HTTP.UNAUTHORIZED).json(
      errorResponse('User no longer exists.')
    );
  }

  const token = signToken(user);
  setTokenCookie(res, token);

  return res.status(HTTP.OK).json(
    successResponse({ token }, 'Token refreshed.')
  );
});

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(HTTP.NOT_FOUND).json(
      errorResponse('User not found.')
    );
  }

  return res.status(HTTP.OK).json(successResponse({ user: user.toJSON() }));
});

/**
 * DELETE /api/auth/account
 * Permanently deletes the authenticated user and all their data.
 */
const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Find all resumes owned by this user
  const resumes = await Resume.find({ userId }).select('_id');
  const resumeIds = resumes.map((r) => r._id);

  // Delete analyses for those resumes
  if (resumeIds.length > 0) {
    await Analysis.deleteMany({ resumeId: { $in: resumeIds } });
  }

  // Delete all resumes
  await Resume.deleteMany({ userId });

  // Delete the user
  await User.findByIdAndDelete(userId);

  // Clear the auth cookie
  res.clearCookie('token', { path: '/' });

  return res.status(HTTP.OK).json(
    successResponse(null, 'Account and all associated data deleted.')
  );
});

module.exports = { signup, login, refresh, getMe, deleteAccount };
