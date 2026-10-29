/**
 * @file routes/analysisRoutes.js
 * @description Analysis detail and roles endpoints.
 */

const express = require('express');
const analysisController = require('../controllers/analysisController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public roles endpoint
router.get('/roles', analysisController.getAvailableRoles);

// Specific analysis by ID (requires auth)
router.get('/:id', authMiddleware, analysisController.getAnalysis);

module.exports = router;
