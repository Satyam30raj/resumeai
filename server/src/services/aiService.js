/**
 * @file services/aiService.js
 * @description Integrates with Google Gemini (generative AI) to produce
 *              structured resume analysis output.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');
const { buildSystemInstruction, buildAnalysisPrompt } = require('../utils/promptBuilder');
const { validateAnalysisOutput } = require('../utils/analysisSchema');

const MODEL_NAME = 'gemini-1.5-flash';
const MAX_RETRIES = 2;

/** Lazy-initialised Gemini client. */
let genAI = null;

/**
 * Returns (and caches) the GoogleGenerativeAI instance.
 * @returns {GoogleGenerativeAI}
 */
function getClient() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
  }
  return genAI;
}

/**
 * Sends the resume and role profile to Gemini and returns a validated
 * analysis object ready to be persisted.
 *
 * Retries up to {@link MAX_RETRIES} times if the model output cannot be
 * parsed or validated.
 *
 * @param {Object} resumeSections - Resume `sections` data.
 * @param {Object} roleProfile - Role profile from the role catalog.
 * @returns {Promise<Object>} Validated analysis fields (dimensionScores, strengths, etc.).
 * @throws {Error} If all retries are exhausted or the API call fails.
 */
async function analyzeResume(resumeSections, roleProfile) {
  // If no Gemini API key configured or placeholder used, use rule-based AI mock analysis
  if (!config.geminiApiKey || config.geminiApiKey === 'your-gemini-api-key') {
    console.log('[aiService] Using local fallback resume analysis (GEMINI_API_KEY not configured)');
    return generateFallbackAnalysis(resumeSections, roleProfile);
  }

  const client = getClient();
  const model = client.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: buildSystemInstruction(),
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
    },
  });

  const prompt = buildAnalysisPrompt(resumeSections, roleProfile);

  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Strip markdown code fences if the model wraps the JSON
      const cleaned = text
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      const validated = validateAnalysisOutput(parsed);

      return {
        ...validated,
        modelVersion: MODEL_NAME,
      };
    } catch (err) {
      lastError = err;
      console.warn(
        `[aiService] Attempt ${attempt + 1}/${MAX_RETRIES + 1} failed: ${err.message}`
      );
      // Small backoff before retry
      if (attempt < MAX_RETRIES) {
        await sleep(1000 * (attempt + 1));
      }
    }
  }

  throw new Error(
    `AI analysis failed after ${MAX_RETRIES + 1} attempts: ${lastError?.message}`
  );
}

/**
 * Utility sleep function.
 * @param {number} ms - Milliseconds to wait.
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates intelligent fallback analysis when Gemini API key is not configured.
 * @param {Object} resumeSections
 * @param {Object} roleProfile
 * @returns {Object}
 */
function generateFallbackAnalysis(resumeSections, roleProfile) {
  const skills = (resumeSections.skills || []).flatMap(s => s.items || []);
  const lowerSkills = skills.map(s => s.toLowerCase());
  const required = roleProfile.requiredSkills || [];
  const missing = required.filter(req => !lowerSkills.some(s => s.includes(req.toLowerCase())));

  const expCount = (resumeSections.experience || []).length;
  const projCount = (resumeSections.projects || []).length;

  const skillGaps = missing.slice(0, 5).map(skill => ({
    skill,
    importance: 'high'
  }));

  const suggestions = [
    {
      category: 'skills',
      location: 'Skills Section',
      current: skills.slice(0, 3).join(', ') || 'General skills listed',
      recommended: `Explicitly include essential skills for ${roleProfile.title}: ${required.slice(0, 3).join(', ')}.`,
      impact: 'Aligns keyword relevance with target applicant tracking systems (ATS).'
    },
    {
      category: 'quantification',
      location: 'Experience / Projects',
      current: 'Qualitative descriptions of responsibilities',
      recommended: 'Add measurable metrics (e.g., "Reduced latency by 25%", "Handled 10k+ requests/sec").',
      impact: 'Demonstrates tangible impact and increases recruiter engagement.'
    },
    {
      category: 'action_verbs',
      location: 'Bullet points',
      current: 'Passive or standard phrasing ("Responsible for", "Helped with")',
      recommended: 'Start bullet points with strong action verbs: "Spearheaded", "Engineered", "Optimized", "Architected".',
      impact: 'Shows initiative, ownership, and technical confidence.'
    },
    {
      category: 'summary',
      location: 'Professional Summary',
      current: resumeSections.summary?.content ? 'Generic summary' : 'Missing summary',
      recommended: `Tailor summary specifically for ${roleProfile.title} highlighting key strengths and domain interest.`,
      impact: 'Provides an immediate strong impression in the first 6-second scan.'
    },
    {
      category: 'relevance',
      location: 'Project Section',
      current: projCount > 0 ? `${projCount} project(s) listed` : 'No projects listed',
      recommended: `Include at least 2 full-stack/domain projects demonstrating ${roleProfile.preferredSkills?.[0] || 'modern tech stacks'}.`,
      impact: 'Validates practical implementation experience for the target role.'
    }
  ];

  return {
    dimensionScores: {
      skillsMatch: Math.min(100, Math.max(40, 100 - missing.length * 12)),
      experienceRelevance: Math.min(100, Math.max(45, 50 + expCount * 15)),
      sectionCompleteness: 80,
      phrasingQuality: 75,
      quantifiedImpact: 65,
    },
    strengths: [
      `Solid structure and foundation for ${roleProfile.title} role.`,
      `Includes ${skills.length} skills demonstrating technical aptitude.`,
      projCount > 0 ? `Showcases ${projCount} practical projects.` : 'Clear educational background provided.'
    ],
    skillGaps,
    suggestions,
    modelVersion: 'gemini-1.5-flash (local-fallback)',
  };
}

module.exports = { analyzeResume, MODEL_NAME };
