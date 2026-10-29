/**
 * Utility / helper functions used across the application.
 */

/**
 * Format a date string to a human-readable short format.
 * @param {string} dateStr - ISO date string or YYYY-MM format
 * @returns {string} Formatted date like "Jan 2024" or the original string
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Format a date to relative time (e.g., "2 hours ago").
 * @param {string} dateStr - ISO date string
 * @returns {string} Relative time string
 */
export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

/**
 * Validate an email address format.
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Validate a URL format.
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export function isValidUrl(url) {
  if (!url) return true; // Optional fields
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate password strength.
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export function validatePassword(password) {
  if (!password) return { valid: false, message: 'Password is required' };
  if (password.length < 6) return { valid: false, message: 'Password must be at least 6 characters' };
  return { valid: true, message: '' };
}

/**
 * Check whether a resume section is considered "complete".
 * @param {string} sectionKey - The section key name
 * @param {object} resume - The resume data object
 * @returns {boolean} True if the section has meaningful content
 */
export function isSectionComplete(sectionKey, resume) {
  if (!resume) return false;

  switch (sectionKey) {
    case 'personalInfo': {
      const info = resume.personalInfo;
      return !!(info && info.fullName && info.email);
    }
    case 'summary':
      return !!(resume.summary && resume.summary.trim().length > 20);
    case 'education':
      return Array.isArray(resume.education) && resume.education.length > 0 &&
        resume.education.some((e) => e.institution && e.degree);
    case 'skills':
      return Array.isArray(resume.skills) && resume.skills.length > 0 &&
        resume.skills.some((s) => s.name && s.skills && s.skills.length > 0);
    case 'experience':
      return Array.isArray(resume.experience) && resume.experience.length > 0 &&
        resume.experience.some((e) => e.company && e.position);
    case 'projects':
      return Array.isArray(resume.projects) && resume.projects.length > 0 &&
        resume.projects.some((p) => p.title);
    case 'achievements':
      return Array.isArray(resume.achievements) && resume.achievements.length > 0 &&
        resume.achievements.some((a) => a.title);
    default:
      return false;
  }
}

/**
 * Debounce a function call.
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Generate a simple unique ID for local-only use.
 * @returns {string} A random ID string
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

/**
 * Truncate a string to a max length, adding ellipsis if needed.
 * @param {string} str - String to truncate
 * @param {number} maxLen - Maximum length
 * @returns {string} Truncated string
 */
export function truncate(str, maxLen = 80) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen).trimEnd() + '…';
}

/**
 * Get a color class for a score value.
 * @param {number} score - Score 0-100
 * @returns {string} Tailwind color class
 */
export function getScoreColor(score) {
  if (score >= 76) return 'text-green-600';
  if (score >= 61) return 'text-yellow-500';
  if (score >= 41) return 'text-orange-500';
  return 'text-red-500';
}

/**
 * Get a background color class for a score value.
 * @param {number} score - Score 0-100
 * @returns {string} Tailwind bg class
 */
export function getScoreBgColor(score) {
  if (score >= 76) return 'bg-green-500';
  if (score >= 61) return 'bg-yellow-500';
  if (score >= 41) return 'bg-orange-500';
  return 'bg-red-500';
}

/**
 * Get the hex stroke color for the score SVG circle.
 * @param {number} score - Score 0-100
 * @returns {string} Hex color
 */
export function getScoreStrokeColor(score) {
  if (score >= 76) return '#22c55e';
  if (score >= 61) return '#eab308';
  if (score >= 41) return '#f97316';
  return '#ef4444';
}

/**
 * Capitalize the first letter of every word.
 * @param {string} str - Input string
 * @returns {string} Title-cased string
 */
export function titleCase(str) {
  if (!str) return '';
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
