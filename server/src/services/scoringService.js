/**
 * @file services/scoringService.js
 * @description Hybrid scoring engine that combines deterministic checks (60%)
 *              with LLM-provided judgement scores (40%) to produce a final
 *              analysis result.
 */

const { SCORING_WEIGHTS } = require('../config/constants');
const { clampScore, flattenResumeText, isFutureDate } = require('../utils/helpers');
const { analyzeResume } = require('./aiService');

/**
 * Runs the full hybrid scoring pipeline and returns a complete analysis payload.
 *
 * @param {Object} resumeSections - Resume `sections` object from the database.
 * @param {Object} roleProfile - Role profile from the role catalog.
 * @returns {Promise<Object>} Analysis data suitable for the Analysis model.
 */
async function runHybridScoring(resumeSections, roleProfile) {
  // 1. Compute deterministic dimension scores
  const deterministic = computeDeterministicScores(resumeSections, roleProfile);

  // 2. Get LLM analysis (includes its own dimension scores plus qualitative data)
  const llmResult = await analyzeResume(resumeSections, roleProfile);

  // 3. Merge dimension scores using configured weights
  const dimensionScores = mergeDimensionScores(deterministic, llmResult.dimensionScores);

  // 4. Compute overall weighted score using section weights from the role profile
  const score = computeOverallScore(dimensionScores, roleProfile.sectionWeights);

  return {
    score: clampScore(score),
    dimensionScores,
    strengths: llmResult.strengths,
    skillGaps: llmResult.skillGaps,
    missingSections: deterministic.missingSections,
    suggestions: llmResult.suggestions,
    modelVersion: llmResult.modelVersion,
  };
}

/* ──────────────────────────────────────────────────────────────────
 *  Deterministic Scoring Functions
 * ────────────────────────────────────────────────────────────────── */

/**
 * Computes deterministic (rule-based) scores for each dimension.
 *
 * @param {Object} sections - Resume sections.
 * @param {Object} role - Role profile.
 * @returns {{ skillsMatch: number, experienceRelevance: number, sectionCompleteness: number, phrasingQuality: number, quantifiedImpact: number, missingSections: string[] }}
 */
function computeDeterministicScores(sections, role) {
  const fullText = flattenResumeText(sections);

  const sectionResult = scoreSectionCompleteness(sections, role.expectedSections);
  const skillsMatch = scoreSkillCoverage(fullText, role.requiredSkills, role.preferredSkills);
  const quantifiedImpact = scoreQuantifiedBullets(sections);
  const phrasingQuality = scorePhrasing(fullText, role.keywords);
  const experienceRelevance = scoreExperienceRelevance(sections, fullText);

  return {
    skillsMatch: clampScore(skillsMatch),
    experienceRelevance: clampScore(experienceRelevance),
    sectionCompleteness: clampScore(sectionResult.score),
    phrasingQuality: clampScore(phrasingQuality),
    quantifiedImpact: clampScore(quantifiedImpact),
    missingSections: sectionResult.missing,
  };
}

/**
 * Checks which expected sections are present and adequately filled.
 * @param {Object} sections
 * @param {string[]} expected
 * @returns {{ score: number, missing: string[] }}
 */
function scoreSectionCompleteness(sections, expected) {
  const missing = [];
  let filled = 0;

  for (const key of expected) {
    const data = sections[key];
    if (!data) {
      missing.push(key);
      continue;
    }

    if (key === 'summary') {
      if (data.content && data.content.trim().length >= 20) {
        filled++;
      } else {
        missing.push(key);
      }
    } else if (Array.isArray(data)) {
      if (data.length > 0) {
        filled++;
      } else {
        missing.push(key);
      }
    } else if (typeof data === 'object') {
      // personalInfo-style: check at least 2 fields have content
      const filledFields = Object.values(data).filter(
        (v) => typeof v === 'string' && v.trim().length > 0
      ).length;
      if (filledFields >= 2) {
        filled++;
      } else {
        missing.push(key);
      }
    } else {
      missing.push(key);
    }
  }

  const score = expected.length > 0 ? (filled / expected.length) * 100 : 100;
  return { score, missing };
}

/**
 * Scores what percentage of required + preferred skills appear in the resume text.
 * Required skills are weighted 2× compared to preferred.
 *
 * @param {string} text - Lower-cased full resume text.
 * @param {string[]} required
 * @param {string[]} preferred
 * @returns {number} 0-100
 */
function scoreSkillCoverage(text, required, preferred) {
  const requiredWeight = 2;
  const preferredWeight = 1;

  let earned = 0;
  let total = 0;

  for (const skill of required) {
    total += requiredWeight;
    if (text.includes(skill.toLowerCase())) {
      earned += requiredWeight;
    }
  }

  for (const skill of preferred) {
    total += preferredWeight;
    if (text.includes(skill.toLowerCase())) {
      earned += preferredWeight;
    }
  }

  return total > 0 ? (earned / total) * 100 : 0;
}

/**
 * Scores what percentage of experience and project bullet points
 * contain quantified metrics (numbers, percentages, dollar signs).
 *
 * @param {Object} sections
 * @returns {number} 0-100
 */
function scoreQuantifiedBullets(sections) {
  const bullets = [];

  if (Array.isArray(sections.experience)) {
    for (const exp of sections.experience) {
      if (exp.description) bullets.push(exp.description);
      if (Array.isArray(exp.highlights)) bullets.push(...exp.highlights);
    }
  }

  if (Array.isArray(sections.projects)) {
    for (const proj of sections.projects) {
      if (proj.description) bullets.push(proj.description);
      if (Array.isArray(proj.highlights)) bullets.push(...proj.highlights);
    }
  }

  if (bullets.length === 0) return 0;

  const quantPattern = /\d+%?|\$[\d,]+|#\d+|\d+[kKmMbB]\b/;
  const quantified = bullets.filter((b) => quantPattern.test(b)).length;

  return (quantified / bullets.length) * 100;
}

/**
 * Scores phrasing quality by checking for action verb usage from the role's
 * keyword list plus a base set of strong action verbs.
 *
 * @param {string} text - Lower-cased full resume text.
 * @param {string[]} roleKeywords - Expected action verbs for the role.
 * @returns {number} 0-100
 */
function scorePhrasing(text, roleKeywords) {
  const baseVerbs = [
    'achieved', 'built', 'created', 'delivered', 'enhanced',
    'improved', 'launched', 'led', 'managed', 'reduced',
    'resolved', 'spearheaded', 'streamlined', 'transformed',
  ];

  const allKeywords = [...new Set([...roleKeywords, ...baseVerbs])];
  let found = 0;

  for (const kw of allKeywords) {
    if (text.includes(kw.toLowerCase())) {
      found++;
    }
  }

  // If at least half the keywords are present, that's a strong score
  const ratio = allKeywords.length > 0 ? found / allKeywords.length : 0;
  return Math.min(100, ratio * 150); // slightly generous curve
}

/**
 * Basic deterministic experience relevance: checks date consistency
 * (no future dates), reasonable number of entries, and non-empty descriptions.
 *
 * @param {Object} sections
 * @param {string} _text - (unused, reserved for future keyword matching)
 * @returns {number} 0-100
 */
function scoreExperienceRelevance(sections, _text) {
  const entries = Array.isArray(sections.experience) ? sections.experience : [];

  if (entries.length === 0) return 0;

  let points = 0;
  let maxPoints = 0;

  for (const exp of entries) {
    // Has a description or highlights
    maxPoints += 3;
    if (exp.description && exp.description.trim().length > 20) points += 1;
    if (Array.isArray(exp.highlights) && exp.highlights.length > 0) points += 1;
    if (exp.position && exp.position.trim().length > 0) points += 1;

    // Date sanity
    maxPoints += 1;
    if (!isFutureDate(exp.startDate) && !isFutureDate(exp.endDate)) {
      points += 1;
    }
  }

  return maxPoints > 0 ? (points / maxPoints) * 100 : 0;
}

/* ──────────────────────────────────────────────────────────────────
 *  Merging & Final Score
 * ────────────────────────────────────────────────────────────────── */

/**
 * Merges deterministic and LLM dimension scores using the configured weight split.
 *
 * @param {Object} det - Deterministic dimension scores.
 * @param {Object} llm - LLM dimension scores.
 * @returns {Object} Merged dimension scores.
 */
function mergeDimensionScores(det, llm) {
  const dw = SCORING_WEIGHTS.deterministic;
  const lw = SCORING_WEIGHTS.llm;

  return {
    skillsMatch: clampScore(det.skillsMatch * dw + (llm.skillsMatch || 0) * lw),
    experienceRelevance: clampScore(det.experienceRelevance * dw + (llm.experienceRelevance || 0) * lw),
    sectionCompleteness: clampScore(det.sectionCompleteness * dw + (llm.sectionCompleteness || 0) * lw),
    phrasingQuality: clampScore(det.phrasingQuality * dw + (llm.phrasingQuality || 0) * lw),
    quantifiedImpact: clampScore(det.quantifiedImpact * dw + (llm.quantifiedImpact || 0) * lw),
  };
}

/**
 * Computes the final overall score as a weighted average of the five dimensions.
 * Uses section-level weights from the role profile to determine dimension importance:
 *
 *   skillsMatch      → skills weight
 *   experienceRelevance → experience weight
 *   sectionCompleteness → education weight (proxy for structure)
 *   phrasingQuality     → summary weight (proxy for writing)
 *   quantifiedImpact    → projects weight (proxy for concrete output)
 *
 * @param {Object} dims - Merged dimension scores.
 * @param {Object} sectionWeights - Role section weights.
 * @returns {number} 0-100
 */
function computeOverallScore(dims, sectionWeights) {
  const w = {
    skillsMatch: sectionWeights.skills || 0.25,
    experienceRelevance: sectionWeights.experience || 0.30,
    sectionCompleteness: sectionWeights.education || 0.15,
    phrasingQuality: sectionWeights.summary || 0.05,
    quantifiedImpact: sectionWeights.projects || 0.25,
  };

  // Normalise weights so they sum to 1
  const totalW = Object.values(w).reduce((a, b) => a + b, 0);
  let score = 0;
  for (const [key, weight] of Object.entries(w)) {
    score += (dims[key] || 0) * (weight / totalW);
  }

  return score;
}

module.exports = { runHybridScoring };
