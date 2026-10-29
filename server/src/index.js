/**
 * @file index.js
 * @description Main entry point for the ResumeAI Express REST API.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const config = require('./config/env');
const connectDB = require('./config/db');
const { generalLimiter } = require('./middleware/rateLimiter');
const { HTTP } = require('./config/constants');
const { errorResponse } = require('./utils/helpers');

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { getAvailableRoles } = require('./controllers/analysisController');

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow HTML preview & iframe if needed
  })
);

// CORS configuration
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging in non-test environments
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Global rate limiting
app.use(generalLimiter);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(HTTP.OK).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Direct roles shortcut
app.get('/api/roles', getAvailableRoles);

// API route groups
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/uploads', uploadRoutes);

// Serve frontend build when available (single-service production deployment)
const path = require('path');
const fs = require('fs');
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 handler for unknown routes
app.use((_req, res) => {
  res.status(HTTP.NOT_FOUND).json(errorResponse('Endpoint not found.'));
});

// Global error handling middleware
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Server Error]', err);
  const status = err.status || HTTP.INTERNAL_ERROR;
  const message = err.message || 'Internal Server Error';
  res.status(status).json(errorResponse(message));
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`[server] ResumeAI API is running on port ${config.port} (${config.nodeEnv})`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
  });
}

module.exports = app;
