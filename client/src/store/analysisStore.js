import { create } from 'zustand';
import { analysisAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Zustand store for resume analysis state.
 */
const useAnalysisStore = create((set) => ({
  /* ── State ── */
  currentAnalysis: null,
  analyses: [],
  isAnalyzing: false,
  isLoading: false,

  /* ── Actions ── */

  /**
   * Run AI analysis on a resume for a specific target role.
   * @param {string} resumeId
   * @param {string} targetRole
   * @returns {string|null} Analysis ID on success
   */
  analyzeResume: async (resumeId, targetRole) => {
    set({ isAnalyzing: true });
    try {
      const res = await analysisAPI.analyze(resumeId, targetRole);
      const payload = res.data?.data || res.data;
      const analysis = payload.analysis || payload;
      set({ currentAnalysis: analysis, isAnalyzing: false });
      toast.success('Analysis complete!');
      return analysis._id;
    } catch (err) {
      const msg = err.response?.data?.message || 'Analysis failed. Please try again.';
      toast.error(msg);
      set({ isAnalyzing: false });
      return null;
    }
  },

  /**
   * Fetch all analyses for a given resume.
   * @param {string} resumeId
   */
  fetchAnalyses: async (resumeId) => {
    set({ isLoading: true });
    try {
      const res = await analysisAPI.getAll(resumeId);
      const payload = res.data?.data || res.data;
      set({ analyses: payload.analyses || payload || [], isLoading: false });
    } catch {
      toast.error('Failed to load analysis history.');
      set({ isLoading: false });
    }
  },

  /**
   * Fetch a single analysis by its ID.
   * @param {string} id
   */
  fetchAnalysis: async (id) => {
    set({ isLoading: true });
    try {
      const res = await analysisAPI.getOne(id);
      const payload = res.data?.data || res.data;
      const analysis = payload.analysis || payload;
      set({ currentAnalysis: analysis, isLoading: false });
    } catch {
      toast.error('Failed to load analysis.');
      set({ isLoading: false });
    }
  },

  /**
   * Clear the current analysis (for navigating away).
   */
  resetAnalysis: () => {
    set({ currentAnalysis: null, analyses: [] });
  },
}));

export default useAnalysisStore;
