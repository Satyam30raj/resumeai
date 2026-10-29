import { create } from 'zustand';
import { resumeAPI } from '../services/api';
import { EMPTY_RESUME } from '../utils/constants';
import { debounce } from '../utils/helpers';
import toast from 'react-hot-toast';

/**
 * Internal debounced save function (2 second delay).
 * Created once outside the store so it persists across calls.
 */
let debouncedSave = null;

/**
 * Zustand store for resume management.
 */
const useResumeStore = create((set, get) => {
  /* Create the debounced save referencing get() */
  debouncedSave = debounce(async () => {
    const { resume, isSaving } = get();
    if (!resume || !resume._id || isSaving) return;
    set({ isSaving: true, autosaveStatus: 'saving' });
    try {
      const res = await resumeAPI.update(resume._id, resume);
      const payload = res.data?.data || res.data;
      set({
        resume: payload.resume || payload,
        isSaving: false,
        autosaveStatus: 'saved',
      });
    } catch {
      set({ isSaving: false, autosaveStatus: 'error' });
    }
  }, 2000);

  return {
    /* ── State ── */
    resume: null,
    resumes: [],
    selectedTemplate: 'classic',
    isSaving: false,
    isLoading: false,
    autosaveStatus: 'idle', // idle | saving | saved | error

    /* ── Actions ── */

    /**
     * Update a single section of the current resume.
     * Triggers autosave after a 2-second debounce.
     * @param {string} sectionName - Key of the section to update
     * @param {*} data - New data for that section
     */
    updateSection: (sectionName, data) => {
      const resume = get().resume;
      if (!resume) return;

      const currentSections = resume.sections || {};
      const updated = {
        ...resume,
        [sectionName]: data,
        sections: {
          ...currentSections,
          [sectionName]: data,
        },
      };

      set({ resume: updated, autosaveStatus: 'idle' });
      if (resume._id) {
        debouncedSave();
      }
    },

    /**
     * Update resume top-level title.
     * @param {string} title
     */
    setTitle: (title) => {
      const resume = get().resume;
      if (!resume) return;
      const updated = { ...resume, title };
      set({ resume: updated, autosaveStatus: 'idle' });
      if (resume._id) debouncedSave();
    },

    /**
     * Update resume image URL.
     * @param {string} imageUrl
     */
    setImageUrl: (imageUrl) => {
      const resume = get().resume;
      if (!resume) return;
      const updated = { ...resume, imageUrl };
      set({ resume: updated, autosaveStatus: 'idle' });
      if (resume._id) debouncedSave();
    },

    /**
     * Set the active template for the current resume.
     * @param {string} templateId
     */
    setTemplate: (templateId) => {
      const resume = get().resume;
      set({ selectedTemplate: templateId });
      if (resume) {
        const updated = { ...resume, templateId, template: templateId };
        set({ resume: updated });
        if (resume._id) debouncedSave();
      }
    },

    /**
     * Fetch all resumes for the dashboard.
     */
    fetchResumes: async () => {
      set({ isLoading: true });
      try {
        const res = await resumeAPI.getAll();
        const payload = res.data?.data || res.data;
        set({ resumes: payload.resumes || payload || [], isLoading: false });
      } catch {
        toast.error('Failed to load resumes.');
        set({ isLoading: false });
      }
    },

    /**
     * Fetch a single resume for editing.
     * @param {string} id - Resume ID
     */
    fetchResume: async (id) => {
      set({ isLoading: true });
      try {
        const res = await resumeAPI.getOne(id);
        const payload = res.data?.data || res.data;
        const resume = payload.resume || payload;
        set({
          resume,
          selectedTemplate: resume.templateId || resume.template || 'classic',
          isLoading: false,
        });
      } catch {
        toast.error('Failed to load resume.');
        set({ isLoading: false });
      }
    },

    /**
     * Create a new blank resume.
     * @returns {string|null} The new resume's ID or null on failure
     */
    createResume: async () => {
      set({ isLoading: true });
      try {
        const res = await resumeAPI.create({ ...EMPTY_RESUME });
        const payload = res.data?.data || res.data;
        const resume = payload.resume || payload;
        set({
          resume,
          selectedTemplate: resume.templateId || resume.template || 'classic',
          isLoading: false,
        });
        toast.success('New resume created!');
        return resume._id;
      } catch {
        toast.error('Failed to create resume.');
        set({ isLoading: false });
        return null;
      }
    },

    /**
     * Manually save the current resume.
     */
    saveResume: async () => {
      const { resume } = get();
      if (!resume || !resume._id) return;
      set({ isSaving: true, autosaveStatus: 'saving' });
      try {
        const res = await resumeAPI.update(resume._id, resume);
        const payload = res.data?.data || res.data;
        set({
          resume: payload.resume || payload,
          isSaving: false,
          autosaveStatus: 'saved',
        });
        toast.success('Resume saved!');
      } catch {
        toast.error('Failed to save resume.');
        set({ isSaving: false, autosaveStatus: 'error' });
      }
    },

    /**
     * Delete a resume by ID.
     * @param {string} id
     */
    deleteResume: async (id) => {
      try {
        await resumeAPI.delete(id);
        set((state) => ({
          resumes: state.resumes.filter((r) => r._id !== id),
        }));
        toast.success('Resume deleted.');
      } catch {
        toast.error('Failed to delete resume.');
      }
    },

    /**
     * Duplicate a resume by ID.
     * @param {string} id
     */
    duplicateResume: async (id) => {
      try {
        const res = await resumeAPI.duplicate(id);
        const payload = res.data?.data || res.data;
        const newResume = payload.resume || payload;
        set((state) => ({
          resumes: [newResume, ...state.resumes],
        }));
        toast.success('Resume duplicated!');
        return newResume._id;
      } catch {
        toast.error('Failed to duplicate resume.');
        return null;
      }
    },

    /**
     * Reset the current resume in memory (for navigating away).
     */
    resetResume: () => {
      set({ resume: null, autosaveStatus: 'idle' });
    },
  };
});

export default useResumeStore;
