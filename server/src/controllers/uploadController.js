/**
 * @file controllers/uploadController.js
 * @description Handles image uploads via multer → ImageKit.
 */

const multer = require('multer');
const { HTTP, MAX_UPLOAD_SIZE, ALLOWED_IMAGE_TYPES } = require('../config/constants');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const { uploadImage } = require('../services/imagekitService');

/**
 * Multer configuration: store files in memory so we can forward the buffer
 * to ImageKit without touching the filesystem.
 */
const storage = multer.memoryStorage();

/**
 * Multer file filter that only accepts allowed image MIME types.
 * @param {import('express').Request} _req
 * @param {Express.Multer.File} file
 * @param {Function} cb
 */
function fileFilter(_req, file, cb) {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        'LIMIT_UNEXPECTED_FILE',
        `Only ${ALLOWED_IMAGE_TYPES.join(', ')} files are allowed.`
      ),
      false
    );
  }
}

/** Configured multer instance for single image upload. */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_UPLOAD_SIZE },
}).single('image');

/**
 * POST /api/uploads/image
 * Accepts a multipart form upload with field name "image", validates type and
 * size, pushes the file to ImageKit, and returns the public URL.
 */
const uploadImageHandler = asyncHandler(async (req, res) => {
  // Wrap multer in a promise so we can handle errors cleanly
  await new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  }).catch((err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(HTTP.BAD_REQUEST).json(
          errorResponse(`File too large. Maximum size is ${MAX_UPLOAD_SIZE / (1024 * 1024)} MB.`)
        );
      }
      return res.status(HTTP.BAD_REQUEST).json(errorResponse(err.message || err.field));
    }
    throw err;
  });

  // If multer already sent a response (error), stop
  if (res.headersSent) return;

  if (!req.file) {
    return res.status(HTTP.BAD_REQUEST).json(
      errorResponse('No image file provided. Please upload a file with field name "image".')
    );
  }

  const result = await uploadImage(req.file.buffer, req.file.originalname);

  return res.status(HTTP.OK).json(
    successResponse(
      {
        url: result.url,
        fileId: result.fileId,
        thumbnailUrl: result.thumbnailUrl,
      },
      'Image uploaded successfully.'
    )
  );
});

module.exports = { uploadImageHandler };
