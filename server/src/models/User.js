/**
 * @file models/User.js
 * @description Mongoose schema and model for application users.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_ROLES } = require('../config/constants');

const SALT_ROUNDS = 12;

/**
 * @typedef {Object} IUser
 * @property {string} email - Unique email address.
 * @property {string} passwordHash - Bcrypt-hashed password.
 * @property {'user'|'mentor'|'admin'} role - Authorization role.
 * @property {Date} createdAt - Account creation timestamp.
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: {
        values: USER_ROLES,
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

/**
 * Hashes a plaintext password using bcrypt.
 * @param {string} plaintext - The raw password.
 * @returns {Promise<string>} The hashed password.
 */
userSchema.statics.hashPassword = async function (plaintext) {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
};

/**
 * Compares a candidate password against the stored hash.
 * @param {string} candidate - The plaintext password to check.
 * @returns {Promise<boolean>} Whether the password matches.
 */
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

const { userRepo } = require('../services/localStore');

// Transparent proxy to fallback when MongoDB is offline
const UserProxy = new Proxy(User, {
  get(target, prop) {
    if (mongoose.connection.readyState !== 1 && typeof userRepo[prop] === 'function') {
      return userRepo[prop].bind(userRepo);
    }
    return target[prop];
  },
});

module.exports = UserProxy;
