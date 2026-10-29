/**
 * @file config/constants.js
 * @description Application-wide constants.
 */

/** Supported resume template identifiers. */
const TEMPLATES = Object.freeze([
  'classic',
  'modern',
  'minimal',
  'professional',
  'creative',
]);

/** User role enum values. */
const USER_ROLES = Object.freeze(['user', 'mentor', 'admin']);

/** Maximum file upload size in bytes (5 MB). */
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

/** Allowed image MIME types for upload. */
const ALLOWED_IMAGE_TYPES = Object.freeze([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

/** Standard HTTP status codes used across the app. */
const HTTP = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL: 500,
});

/** Scoring weight split between deterministic and LLM grading. */
const SCORING_WEIGHTS = Object.freeze({
  deterministic: 0.6,
  llm: 0.4,
});

/** Individual dimension labels. */
const DIMENSIONS = Object.freeze([
  'skillsMatch',
  'experienceRelevance',
  'sectionCompleteness',
  'phrasingQuality',
  'quantifiedImpact',
]);

module.exports = {
  TEMPLATES,
  USER_ROLES,
  MAX_UPLOAD_SIZE,
  ALLOWED_IMAGE_TYPES,
  HTTP,
  SCORING_WEIGHTS,
  DIMENSIONS,
};
