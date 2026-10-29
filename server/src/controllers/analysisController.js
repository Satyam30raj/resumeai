/**
 * @file controllers/analysisController.js
 * @description Handles AI-powered resume analysis and retrieval of past analyses.
 */

const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const { HTTP } = require('../config/constants');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const { getRoleProfile, listRoles } = require('../utils/roleCatalog');
const { runHybridScoring } = require('../services/scoringService');

/**
 * POST /api/resumes/:id/analyze
 * Runs the hybrid scoring pipeline on a resume for a given target role.
 *
 * Body: { targetRole: string }
 */
const analyzeResume = asyncHandler(async (req, res) => {
  const { targetRole } = req.body;

  if (!targetRole) {
    return res.status(HTTP.BAD_REQUEST).json(
      errorResponse('targetRole is required.', [
        { field: 'targetRole', message: 'Please specify a target role.' },
      ])
    );
  }

  // Fetch and verify ownership
  const resume = await Resume.findById(req.params.id);
  if (!resume) {
    return res.status(HTTP.NOT_FOUND).json(errorResponse('Resume not found.'));
  }
  if (resume.userId.toString() !== req.user.id) {
    return res.status(HTTP.FORBIDDEN).json(errorResponse('Access denied.'));
  }

  // Ensure the resume has some content worth analysing
  const sections = resume.sections || {};
  const summaryText =
    typeof sections.summary === 'string'
      ? sections.summary
      : sections.summary?.content || '';

  const hasContent =
    (sections.experience && sections.experience.length > 0) ||
    (sections.skills && sections.skills.length > 0) ||
    (sections.projects && sections.projects.length > 0) ||
    (sections.education && sections.education.length > 0) ||
    summaryText.trim().length > 0;

  if (!hasContent) {
    return res.status(HTTP.BAD_REQUEST).json(
      errorResponse(
        'Resume does not have enough content to analyse yet. Please add at least one section (skills, experience, projects, or education).'
      )
    );
  }

  const roleProfile = getRoleProfile(targetRole);

  // Run the hybrid scoring pipeline (deterministic + LLM)
  const result = await runHybridScoring(sections, roleProfile);

  // Persist the analysis
  const analysis = await Analysis.create({
    resumeId: resume._id,
    targetRole: roleProfile.title,
    score: result.score,
    dimensionScores: result.dimensionScores,
    strengths: result.strengths,
    skillGaps: result.skillGaps,
    missingSections: result.missingSections,
    suggestions: result.suggestions,
    modelVersion: result.modelVersion,
  });

  return res.status(HTTP.CREATED).json(
    successResponse({ analysis: analysis.toJSON() }, 'Analysis complete.')
  );
});

/**
 * GET /api/resumes/:id/analyses
 * Lists all analyses for a specific resume. Verifies ownership through the resume.
 */
const listAnalyses = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id).select('userId');
  if (!resume) {
    return res.status(HTTP.NOT_FOUND).json(errorResponse('Resume not found.'));
  }
  if (resume.userId.toString() !== req.user.id) {
    return res.status(HTTP.FORBIDDEN).json(errorResponse('Access denied.'));
  }

  const analyses = await Analysis.find({ resumeId: resume._id })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(HTTP.OK).json(successResponse({ analyses }));
});

/**
 * GET /api/analyses/:id
 * Returns a single analysis detail. Verifies ownership through the resume.
 */
const getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id);
  if (!analysis) {
    return res.status(HTTP.NOT_FOUND).json(errorResponse('Analysis not found.'));
  }

  // Verify ownership via the resume
  const resume = await Resume.findById(analysis.resumeId).select('userId');
  if (!resume || resume.userId.toString() !== req.user.id) {
    return res.status(HTTP.FORBIDDEN).json(errorResponse('Access denied.'));
  }

  return res.status(HTTP.OK).json(successResponse({ analysis: analysis.toJSON() }));
});

/**
 * GET /api/roles
 * Returns the list of available target roles for analysis.
 */
const getAvailableRoles = asyncHandler(async (_req, res) => {
  return res.status(HTTP.OK).json(successResponse({ roles: listRoles() }));
});

module.exports = { analyzeResume, listAnalyses, getAnalysis, getAvailableRoles };
