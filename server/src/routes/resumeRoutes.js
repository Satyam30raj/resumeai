/**
 * @file routes/resumeRoutes.js
 * @description Resume CRUD and related sub-endpoints.
 */

const express = require('express');
const resumeController = require('../controllers/resumeController');
const analysisController = require('../controllers/analysisController');
const exportController = require('../controllers/exportController');
const authMiddleware = require('../middleware/auth');
const { analysisLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All resume routes require authentication
router.use(authMiddleware);

router.get('/', resumeController.listResumes);
router.post('/', resumeController.createResume);
router.get('/:id', resumeController.getResume);
router.put('/:id', resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);
router.post('/:id/duplicate', resumeController.duplicateResume);

// Analysis sub-routes
router.post('/:id/analyze', analysisLimiter, analysisController.analyzeResume);
router.get('/:id/analyses', analysisController.listAnalyses);

// Export sub-route
router.get('/:id/export', exportController.exportResume);

module.exports = router;
