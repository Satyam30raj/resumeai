/**
 * @file config/db.js
 * @description MongoDB connection helper using Mongoose.
 */

const mongoose = require('mongoose');
const config = require('./env');

/**
 * Connects to MongoDB using the URI from environment config.
 * Exits the process on connection failure.
 * @returns {Promise<void>}
 */
async function connectDB() {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[db] MongoDB not detected locally (${error.message}).`);
    console.log(`[db] Running in Zero-Config Local Storage mode (data stored in server/data/db.json).`);
    return false;
  }

  mongoose.connection.on('error', (err) => {
    console.error(`[db] MongoDB runtime error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });
}

module.exports = connectDB;
