/**
 * @file services/imagekitService.js
 * @description ImageKit SDK wrapper for server-side image uploads.
 */

const ImageKit = require('imagekit');
const config = require('../config/env');

/** Lazy-initialised ImageKit instance. */
let ik = null;

/**
 * Returns (and caches) the configured ImageKit instance.
 * @returns {ImageKit}
 */
function getImageKit() {
  if (!ik) {
    ik = new ImageKit({
      publicKey: config.imagekitPublicKey,
      privateKey: config.imagekitPrivateKey,
      urlEndpoint: config.imagekitUrlEndpoint,
    });
  }
  return ik;
}

/**
 * Uploads a file buffer to ImageKit.
 *
 * @param {Buffer} fileBuffer - Raw file data.
 * @param {string} fileName - Desired file name (extension included).
 * @param {string} [folder='/resumeai/uploads'] - Remote folder path.
 * @returns {Promise<{ url: string, fileId: string, thumbnailUrl: string }>}
 *   Resolved with the public URL and file metadata.
 * @throws {Error} On upload failure.
 */
async function uploadImage(fileBuffer, fileName, folder = '/resumeai/uploads') {
  if (!config.imagekitPublicKey || !config.imagekitPrivateKey || !config.imagekitUrlEndpoint) {
    // Graceful fallback to data URI when ImageKit credentials are not configured
    const base64 = fileBuffer.toString('base64');
    const mime = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const dataUri = `data:${mime};base64,${base64}`;
    return {
      url: dataUri,
      fileId: 'local-' + Date.now(),
      thumbnailUrl: dataUri,
    };
  }

  const imagekit = getImageKit();

  const response = await imagekit.upload({
    file: fileBuffer,
    fileName,
    folder,
    useUniqueFileName: true,
  });

  return {
    url: response.url,
    fileId: response.fileId,
    thumbnailUrl: response.thumbnailUrl || response.url,
  };
}

/**
 * Deletes a file from ImageKit by its file ID.
 *
 * @param {string} fileId - ImageKit file ID.
 * @returns {Promise<void>}
 */
async function deleteImage(fileId) {
  if (!fileId) return;
  const imagekit = getImageKit();
  await imagekit.deleteFile(fileId);
}

/**
 * Generates ImageKit client-side upload authentication parameters.
 * Useful if the frontend needs to upload directly to ImageKit.
 *
 * @returns {{ token: string, expire: number, signature: string }}
 */
function getAuthParams() {
  const imagekit = getImageKit();
  return imagekit.getAuthenticationParameters();
}

module.exports = { uploadImage, deleteImage, getAuthParams };
