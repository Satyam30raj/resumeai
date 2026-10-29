/**
 * @file utils/analysisSchema.js
 * @description JSON schema definition and validator for the AI analysis output.
 *
 * The schema ensures the LLM response can be safely stored in the Analysis model
 * without blowing up on unexpected shapes.
 */

/**
 * Validates and normalises the raw AI analysis output.
 * Returns a clean object conforming to the Analysis model, or throws if
 * the structure is fundamentally invalid.
 *
 * @param {Object} raw - Parsed JSON from the LLM response.
 * @returns {Object} Cleaned analysis data.
 * @throws {Error} If required fields are missing or have wrong types.
 */
function validateAnalysisOutput(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('AI output is not a valid JSON object');
  }

  // ── dimensionScores ──────────────────────────────────────────────
  const ds = raw.dimensionScores || raw.dimension_scores || {};
  const dimensionScores = {
    skillsMatch: clampInt(ds.skillsMatch ?? ds.skills_match),
    experienceRelevance: clampInt(ds.experienceRelevance ?? ds.experience_relevance),
    sectionCompleteness: clampInt(ds.sectionCompleteness ?? ds.section_completeness),
    phrasingQuality: clampInt(ds.phrasingQuality ?? ds.phrasing_quality),
    quantifiedImpact: clampInt(ds.quantifiedImpact ?? ds.quantified_impact),
  };

  // ── strengths ────────────────────────────────────────────────────
  const strengths = ensureStringArray(raw.strengths);

  // ── skillGaps ────────────────────────────────────────────────────
  const skillGaps = ensureArray(raw.skillGaps || raw.skill_gaps).map((g) => ({
    skill: String(g.skill || ''),
    importance: ['high', 'medium', 'low'].includes(g.importance) ? g.importance : 'medium',
  }));

  // ── missingSections ──────────────────────────────────────────────
  const missingSections = ensureStringArray(raw.missingSections || raw.missing_sections);

  // ── suggestions ──────────────────────────────────────────────────
  const suggestions = ensureArray(raw.suggestions).map((s) => ({
    category: String(s.category || ''),
    location: String(s.location || ''),
    current: String(s.current || ''),
    recommended: String(s.recommended || ''),
    impact: String(s.impact || ''),
  }));

  if (suggestions.length < 1) {
    throw new Error('AI output must include at least one suggestion');
  }

  return {
    dimensionScores,
    strengths,
    skillGaps,
    missingSections,
    suggestions,
  };
}

/**
 * Returns the JSON schema description string used inside the LLM prompt so
 * the model knows exactly what shape to output.
 * @returns {string}
 */
function getSchemaDescription() {
  return `{
  "dimensionScores": {
    "skillsMatch": <number 0-100>,
    "experienceRelevance": <number 0-100>,
    "sectionCompleteness": <number 0-100>,
    "phrasingQuality": <number 0-100>,
    "quantifiedImpact": <number 0-100>
  },
  "strengths": ["<string>", ...],
  "skillGaps": [
    { "skill": "<string>", "importance": "high" | "medium" | "low" },
    ...
  ],
  "missingSections": ["<string>", ...],
  "suggestions": [
    {
      "category": "<string, e.g. 'experience', 'skills', 'phrasing'>",
      "location": "<string, specific section or bullet reference>",
      "current": "<string, what is currently written or missing>",
      "recommended": "<string, the improved version or addition>",
      "impact": "<string, why this change matters>"
    },
    ... (at least 5 suggestions)
  ]
}`;
}

/* ── Internal helpers ───────────────────────────────────────────── */

/**
 * Clamps a value to an integer between 0 and 100.
 * @param {*} v
 * @returns {number}
 */
function clampInt(v) {
  const n = parseInt(v, 10);
  if (isNaN(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

/**
 * Ensures the value is an array, wrapping it if necessary.
 * @param {*} v
 * @returns {Array}
 */
function ensureArray(v) {
  if (Array.isArray(v)) return v;
  if (v !== null && v !== undefined) return [v];
  return [];
}

/**
 * Ensures the value is an array of strings.
 * @param {*} v
 * @returns {string[]}
 */
function ensureStringArray(v) {
  return ensureArray(v).map(String).filter(Boolean);
}

module.exports = { validateAnalysisOutput, getSchemaDescription };
