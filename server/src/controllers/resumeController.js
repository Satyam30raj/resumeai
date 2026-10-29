/**
 * @file controllers/resumeController.js
 * @description CRUD operations for user resumes.
 */

const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const { HTTP } = require('../config/constants');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');

/**
 * GET /api/resumes
 * Lists all resumes owned by the authenticated user.
 */
const listResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user.id })
    .sort({ updatedAt: -1 })
    .lean();

  return res.status(HTTP.OK).json(successResponse({ resumes }));
});

/**
 * POST /api/resumes
 * Creates a new resume for the authenticated user.
 */
const createResume = asyncHandler(async (req, res) => {
  const { title, templateId, sections, imageUrl } = req.body;

  const resume = await Resume.create({
    userId: req.user.id,
    title: title || 'Untitled Resume',
    templateId: templateId || 'classic',
    sections: sections || {},
    imageUrl: imageUrl || '',
  });

  return res.status(HTTP.CREATED).json(
    successResponse({ resume: resume.toJSON() }, 'Resume created.')
  );
});

/**
 * GET /api/resumes/:id
 * Returns a single resume. Verifies ownership.
 */
const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return res.status(HTTP.NOT_FOUND).json(errorResponse('Resume not found.'));
  }

  if (resume.userId.toString() !== req.user.id) {
    return res.status(HTTP.FORBIDDEN).json(errorResponse('Access denied.'));
  }

  return res.status(HTTP.OK).json(successResponse({ resume: resume.toJSON() }));
});

/**
 * PUT /api/resumes/:id
 * Updates an existing resume. Verifies ownership.
 */
const updateResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return res.status(HTTP.NOT_FOUND).json(errorResponse('Resume not found.'));
  }

  if (resume.userId.toString() !== req.user.id) {
    return res.status(HTTP.FORBIDDEN).json(errorResponse('Access denied.'));
  }

  // Only allow updating specific fields
  const allowedFields = ['title', 'templateId', 'sections', 'imageUrl'];
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      resume[field] = req.body[field];
    }
  }

  await resume.save();

  return res.status(HTTP.OK).json(
    successResponse({ resume: resume.toJSON() }, 'Resume updated.')
  );
});

/**
 * DELETE /api/resumes/:id
 * Deletes a resume and all its associated analyses. Verifies ownership.
 */
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return res.status(HTTP.NOT_FOUND).json(errorResponse('Resume not found.'));
  }

  if (resume.userId.toString() !== req.user.id) {
    return res.status(HTTP.FORBIDDEN).json(errorResponse('Access denied.'));
  }

  // Remove all analyses that reference this resume
  await Analysis.deleteMany({ resumeId: resume._id });

  // Remove the resume itself
  await Resume.findByIdAndDelete(resume._id);

  return res.status(HTTP.OK).json(
    successResponse(null, 'Resume and associated analyses deleted.')
  );
});

/**
 * POST /api/resumes/:id/duplicate
 * Duplicates an existing resume. Verifies ownership.
 */
const duplicateResume = asyncHandler(async (req, res) => {
  const original = await Resume.findById(req.params.id);

  if (!original) {
    return res.status(HTTP.NOT_FOUND).json(errorResponse('Resume not found.'));
  }

  if (original.userId.toString() !== req.user.id) {
    return res.status(HTTP.FORBIDDEN).json(errorResponse('Access denied.'));
  }

  const duplicate = await Resume.create({
    userId: req.user.id,
    title: `${original.title} (Copy)`,
    templateId: original.templateId,
    sections: original.sections,
    imageUrl: original.imageUrl,
  });

  return res.status(HTTP.CREATED).json(
    successResponse({ resume: duplicate.toJSON() }, 'Resume duplicated.')
  );
});

module.exports = {
  listResumes,
  createResume,
  getResume,
  updateResume,
  deleteResume,
  duplicateResume,
};
