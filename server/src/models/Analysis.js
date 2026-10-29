/**
 * @file models/Analysis.js
 * @description Mongoose schema and model for resume analysis results.
 */

const mongoose = require('mongoose');

const skillGapSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    importance: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
  },
  { _id: false }
);

const suggestionSchema = new mongoose.Schema(
  {
    category: { type: String, default: '' },
    location: { type: String, default: '' },
    current: { type: String, default: '' },
    recommended: { type: String, default: '' },
    impact: { type: String, default: '' },
  },
  { _id: false }
);

const dimensionScoresSchema = new mongoose.Schema(
  {
    skillsMatch: { type: Number, min: 0, max: 100, default: 0 },
    experienceRelevance: { type: Number, min: 0, max: 100, default: 0 },
    sectionCompleteness: { type: Number, min: 0, max: 100, default: 0 },
    phrasingQuality: { type: Number, min: 0, max: 100, default: 0 },
    quantifiedImpact: { type: Number, min: 0, max: 100, default: 0 },
  },
  { _id: false }
);

/**
 * @typedef {Object} IAnalysis
 * @property {mongoose.Types.ObjectId} resumeId - Analyzed resume reference.
 * @property {string} targetRole - Role the resume was evaluated against.
 * @property {number} score - Overall score 0-100.
 * @property {Object} dimensionScores - Per-dimension breakdown.
 * @property {string[]} strengths - Identified resume strengths.
 * @property {Object[]} skillGaps - Missing or weak skills.
 * @property {string[]} missingSections - Sections that should be added.
 * @property {Object[]} suggestions - Actionable improvement suggestions.
 * @property {string} modelVersion - AI model version used.
 * @property {Date} createdAt - Analysis timestamp.
 */
const analysisSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: [true, 'Resume ID is required'],
      index: true,
    },
    targetRole: {
      type: String,
      required: [true, 'Target role is required'],
      trim: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    dimensionScores: {
      type: dimensionScoresSchema,
      default: () => ({}),
    },
    strengths: {
      type: [String],
      default: [],
    },
    skillGaps: {
      type: [skillGapSchema],
      default: [],
    },
    missingSections: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [suggestionSchema],
      default: [],
    },
    modelVersion: {
      type: String,
      default: 'gemini-1.5-flash',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
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

const Analysis = mongoose.model('Analysis', analysisSchema);

const { analysisRepo } = require('../services/localStore');

const AnalysisProxy = new Proxy(Analysis, {
  get(target, prop) {
    if (mongoose.connection.readyState !== 1 && typeof analysisRepo[prop] === 'function') {
      return analysisRepo[prop].bind(analysisRepo);
    }
    return target[prop];
  },
});

module.exports = AnalysisProxy;
