/**
 * @file models/Resume.js
 * @description Mongoose schema and model for user resumes.
 */

const mongoose = require('mongoose');
const { TEMPLATES } = require('../config/constants');

/* ──────────────────── Sub-schemas ──────────────────── */

const personalInfoSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' },
  },
  { _id: false }
);

const summarySchema = new mongoose.Schema(
  {
    content: { type: String, default: '' },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, default: '' },
    degree: { type: String, default: '' },
    field: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    gpa: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: true }
);

const skillCategorySchema = new mongoose.Schema(
  {
    category: { type: String, default: '' },
    items: { type: [String], default: [] },
  },
  { _id: true }
);

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, default: '' },
    position: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    current: { type: Boolean, default: false },
    description: { type: String, default: '' },
    highlights: { type: [String], default: [] },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    technologies: { type: [String], default: [] },
    link: { type: String, default: '' },
    highlights: { type: [String], default: [] },
  },
  { _id: true }
);

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    issuer: { type: String, default: '' },
    date: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: true }
);

const sectionsSchema = new mongoose.Schema(
  {
    personalInfo: { type: personalInfoSchema, default: () => ({}) },
    summary: { type: summarySchema, default: () => ({}) },
    education: { type: [educationSchema], default: [] },
    skills: { type: [skillCategorySchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    achievements: { type: [achievementSchema], default: [] },
  },
  { _id: false }
);

/* ──────────────────── Main Resume Schema ──────────────────── */

/**
 * @typedef {Object} IResume
 * @property {mongoose.Types.ObjectId} userId - Owner reference.
 * @property {string} title - Resume display title.
 * @property {string} templateId - Visual template identifier.
 * @property {string} [imageUrl] - Optional profile/header image URL.
 * @property {Object} sections - All resume content sections.
 */
const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      default: 'Untitled Resume',
      trim: true,
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    templateId: {
      type: String,
      default: 'classic',
      enum: {
        values: TEMPLATES,
        message: '{VALUE} is not a supported template',
      },
    },
    imageUrl: {
      type: String,
      default: '',
    },
    sections: {
      type: sectionsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

const { resumeRepo } = require('../services/localStore');

const ResumeProxy = new Proxy(Resume, {
  get(target, prop) {
    if (mongoose.connection.readyState !== 1 && typeof resumeRepo[prop] === 'function') {
      return resumeRepo[prop].bind(resumeRepo);
    }
    return target[prop];
  },
});

module.exports = ResumeProxy;
