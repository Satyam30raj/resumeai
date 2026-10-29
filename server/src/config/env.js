/**
 * @file config/env.js
 * @description Loads and validates environment variables with sensible defaults.
 */

const dotenv = require('dotenv');
const path = require('path');

// Load .env from the server root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Reads an environment variable with an optional default.
 * Throws if the variable is required and missing.
 * @param {string} key - Environment variable name.
 * @param {string|undefined} fallback - Default value.
 * @returns {string}
 */
function getEnv(key, fallback) {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/** Application configuration derived from environment variables. */
const config = Object.freeze({
  /** Server port */
  port: parseInt(getEnv('PORT', '5001'), 10),

  /** MongoDB connection URI */
  mongoUri: getEnv('MONGODB_URI', 'mongodb://localhost:27017/resumeai'),

  /** JSON Web Token secret key */
  jwtSecret: getEnv('JWT_SECRET', 'resumeai-development-jwt-secret-key-32chars!'),

  /** JWT token expiry duration */
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '7d'),

  /** Google Gemini API key */
  geminiApiKey: getEnv('GEMINI_API_KEY', ''),

  /** ImageKit public key */
  imagekitPublicKey: getEnv('IMAGEKIT_PUBLIC_KEY', ''),

  /** ImageKit private key */
  imagekitPrivateKey: getEnv('IMAGEKIT_PRIVATE_KEY', ''),

  /** ImageKit URL endpoint */
  imagekitUrlEndpoint: getEnv('IMAGEKIT_URL_ENDPOINT', ''),

  /** Allowed CORS origin */
  corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:5173'),

  /** Current environment (development | production | test) */
  nodeEnv: getEnv('NODE_ENV', 'development'),

  /** Maximum AI analysis scans per user per day */
  aiScansPerDay: parseInt(getEnv('AI_SCANS_PER_DAY', '10'), 10),
});

module.exports = config;
