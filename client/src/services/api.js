import axios from 'axios';
import useAuthStore from '../store/authStore';

/**
 * Axios instance pre-configured with base URL and interceptors.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

/* ── Request interceptor: attach JWT ── */
api.interceptors.request.use(
  (config) => {
    const token =
      useAuthStore.getState().token || localStorage.getItem('resumeai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response interceptor: handle 401 ── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

/* ===================================================================
   AUTH API
   =================================================================== */

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  deleteAccount: () => api.delete('/auth/account'),
};

/* ===================================================================
   RESUME API
   =================================================================== */

export const resumeAPI = {
  getAll: () => api.get('/resumes'),
  getOne: (id) => api.get(`/resumes/${id}`),
  create: (data) => api.post('/resumes', data),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
  duplicate: (id) => api.post(`/resumes/${id}/duplicate`),
  exportPDF: (id) =>
    api.get(`/resumes/${id}/export?format=pdf`, { responseType: 'blob' }),
};

/* ===================================================================
   ANALYSIS API
   =================================================================== */

export const analysisAPI = {
  analyze: (resumeId, targetRole) =>
    api.post(`/resumes/${resumeId}/analyze`, { targetRole }),
  getAll: (resumeId) => api.get(`/resumes/${resumeId}/analyses`),
  getOne: (id) => api.get(`/analyses/${id}`),
};

/* ===================================================================
   UPLOAD API
   =================================================================== */

export const uploadAPI = {
  uploadImage: (formData) =>
    api.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default api;
