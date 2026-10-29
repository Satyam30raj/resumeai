/**
 * @file controllers/exportController.js
 * @description Handles resume export to PDF.
 */

const Resume = require('../models/Resume');
const { HTTP } = require('../config/constants');
const { asyncHandler, errorResponse } = require('../utils/helpers');
const { generatePDF } = require('../services/pdfService');

/**
 * GET /api/resumes/:id/export?format=pdf
 * Renders the resume as a PDF and streams it back to the client.
 */
const exportResume = asyncHandler(async (req, res) => {
  const format = (req.query.format || 'pdf').toLowerCase();

  if (format !== 'pdf') {
    return res.status(HTTP.BAD_REQUEST).json(
      errorResponse('Unsupported export format. Currently only "pdf" is supported.')
    );
  }

  const resume = await Resume.findById(req.params.id);
  if (!resume) {
    return res.status(HTTP.NOT_FOUND).json(errorResponse('Resume not found.'));
  }

  if (resume.userId.toString() !== req.user.id) {
    return res.status(HTTP.FORBIDDEN).json(errorResponse('Access denied.'));
  }

  const pdfBuffer = await generatePDF(resume);

  // Build a safe file name from the resume title
  const safeName = (resume.title || 'resume')
    .replace(/[^a-zA-Z0-9_\- ]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 80);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${safeName}.pdf"`,
    'Content-Length': pdfBuffer.length,
  });

  return res.send(pdfBuffer);
});

module.exports = { exportResume };
