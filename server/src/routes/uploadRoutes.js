/**
 * @file routes/uploadRoutes.js
 * @description Upload endpoints.
 */

const express = require('express');
const { uploadImageHandler } = require('../controllers/uploadController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/image', authMiddleware, uploadImageHandler);

module.exports = router;
