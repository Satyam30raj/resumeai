import { create } from 'zustand';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Zustand store for authentication state.
 * Persists token in localStorage.
 */
const useAuthStore = create((set, get) => ({
  /* ── State ── */
  user: null,
  token: localStorage.getItem('resumeai_token') || null,
  isAuthenticated: false,
  isLoading: false,

  /* ── Actions ── */

  /**
   * Login with email and password.
   * @param {string} email
   * @param {string} password
   */
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await authAPI.login({ email, password });
      const payload = res.data?.data || res.data;
      const token = payload.token;
      const user = payload.user || payload;
      localStorage.setItem('resumeai_token', token);
      set({ user, token, isAuthenticated: true, isLoading: false, authError: null });
      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        (err.message === 'Network Error'
          ? 'Cannot reach backend server. Please check your connection.'
          : 'Login failed. Please try again.');
      set({ isLoading: false, authError: msg });
      return { success: false, message: msg };
    }
  },

  /**
   * Register a new user.
   * @param {string} name
   * @param {string} email
   * @param {string} password
   */
  signup: async (name, email, password) => {
    set({ isLoading: true, authError: null });
    try {
      const res = await authAPI.signup({ email, password, name });
      const payload = res.data?.data || res.data;
      const token = payload.token;
      const user = payload.user || payload;
      localStorage.setItem('resumeai_token', token);
      set({ user, token, isAuthenticated: true, isLoading: false, authError: null });
      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        (err.message === 'Network Error'
          ? 'Cannot reach backend server. Please check your connection.'
          : 'Signup failed. Please try again.');
      set({ isLoading: false, authError: msg });
      return { success: false, message: msg };
    }
  },

  /**
   * Log out the current user.
   */
  logout: () => {
    localStorage.removeItem('resumeai_token');
    set({ user: null, token: null, isAuthenticated: false });
    toast.success('Logged out successfully.');
  },

  /**
   * Check authentication status on app load using stored token.
   */
  checkAuth: async () => {
    const token = get().token;
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    try {
      const res = await authAPI.getMe();
      set({ user: res.data.user || res.data, isAuthenticated: true });
    } catch {
      localStorage.removeItem('resumeai_token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
