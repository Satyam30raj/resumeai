/**
 * @file utils/helpers.js
 * @description Shared utility functions used across the application.
 */

/**
 * Wraps an async Express route handler so that rejected promises are
 * forwarded to Express's error-handling middleware.
 *
 * @param {Function} fn - Async route handler `(req, res, next) => Promise`.
 * @returns {import('express').RequestHandler}
 */
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

/**
 * Creates a standardised success response object.
 * @param {*} data - Payload to include.
 * @param {string} [message] - Optional message.
 * @returns {{ success: true, message?: string, data: * }}
 */
function successResponse(data, message) {
  const body = { success: true, data };
  if (message) body.message = message;
  return body;
}

/**
 * Creates a standardised error response object.
 * @param {string} message - Human-readable error description.
 * @param {Array} [errors] - Optional array of field-level errors.
 * @returns {{ success: false, message: string, errors?: Array }}
 */
function errorResponse(message, errors) {
  const body = { success: false, message };
  if (errors && errors.length) body.errors = errors;
  return body;
}

/**
 * Clamps a number between 0 and 100 and rounds to one decimal.
 * @param {number} n
 * @returns {number}
 */
function clampScore(n) {
  return Math.round(Math.min(100, Math.max(0, Number(n) || 0)) * 10) / 10;
}

/**
 * Extracts all text content from the resume sections into a single
 * lower-cased string for keyword matching.
 * @param {Object} sections - Resume sections object.
 * @returns {string}
 */
function flattenResumeText(sections) {
  const parts = [];

  if (sections.personalInfo) {
    parts.push(
      sections.personalInfo.fullName,
      sections.personalInfo.email,
      sections.personalInfo.location
    );
  }

  if (sections.summary && sections.summary.content) {
    parts.push(sections.summary.content);
  }

  if (Array.isArray(sections.education)) {
    sections.education.forEach((e) => {
      parts.push(e.institution, e.degree, e.field, e.description);
    });
  }

  if (Array.isArray(sections.skills)) {
    sections.skills.forEach((s) => {
      parts.push(s.category, ...(s.items || []));
    });
  }

  if (Array.isArray(sections.experience)) {
    sections.experience.forEach((e) => {
      parts.push(e.company, e.position, e.description, ...(e.highlights || []));
    });
  }

  if (Array.isArray(sections.projects)) {
    sections.projects.forEach((p) => {
      parts.push(p.title, p.description, ...(p.technologies || []), ...(p.highlights || []));
    });
  }

  if (Array.isArray(sections.achievements)) {
    sections.achievements.forEach((a) => {
      parts.push(a.title, a.issuer, a.description);
    });
  }

  return parts.filter(Boolean).join(' ').toLowerCase();
}

/**
 * Returns true if a date string represents a date in the future.
 * Handles "Present", "Current", empty strings gracefully.
 * @param {string} dateStr
 * @returns {boolean}
 */
function isFutureDate(dateStr) {
  if (!dateStr) return false;
  const lower = dateStr.toLowerCase().trim();
  if (['present', 'current', 'now', ''].includes(lower)) return false;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return false;
  return parsed > new Date();
}

module.exports = {
  asyncHandler,
  successResponse,
  errorResponse,
  clampScore,
  flattenResumeText,
  isFutureDate,
};
