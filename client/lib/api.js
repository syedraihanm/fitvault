import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
};

// Exercises
export const exerciseAPI = {
  getAll: (params) => api.get('/exercises', { params }),
  getCategories: () => api.get('/exercises/categories'),
  create: (data) => api.post('/exercises', data),
  update: (id, data) => api.put(`/exercises/${id}`, data),
  delete: (id) => api.delete(`/exercises/${id}`),
};

// Workouts
export const workoutAPI = {
  getSessions: (params) => api.get('/workouts', { params }),
  getSession: (id) => api.get(`/workouts/${id}`),
  getStats: (params) => api.get('/workouts/stats', { params }),
  create: (data) => api.post('/workouts', data),
  update: (id, data) => api.put(`/workouts/${id}`, data),
  delete: (id) => api.delete(`/workouts/${id}`),
};

// Programs
export const programAPI = {
  getAll: (params) => api.get('/programs', { params }),
  get: (id) => api.get(`/programs/${id}`),
  getMy: () => api.get('/programs/my'),
  toggleFollow: (id) => api.post(`/programs/${id}/follow`),
};

// Nutrition
export const nutritionAPI = {
  getFoods: (params) => api.get('/nutrition/foods', { params }),
  createFood: (data) => api.post('/nutrition/foods', data),
  getMeals: (params) => api.get('/nutrition/meals', { params }),
  createMeal: (data) => api.post('/nutrition/meals', data),
  updateMeal: (id, data) => api.put(`/nutrition/meals/${id}`, data),
  deleteMeal: (id) => api.delete(`/nutrition/meals/${id}`),
  getStats: (params) => api.get('/nutrition/stats', { params }),
};

// Progress
export const progressAPI = {
  getLogs: (params) => api.get('/progress', { params }),
  createLog: (data) => api.post('/progress', data),
  deleteLog: (id) => api.delete(`/progress/${id}`),
  getPRs: () => api.get('/progress/prs'),
  getExercisePR: (id) => api.get(`/progress/prs/${id}`),
};

// Tracking
export const trackingAPI = {
  logWater: (data) => api.post('/tracking/water', data),
  getWater: (params) => api.get('/tracking/water', { params }),
  getWaterHistory: (params) => api.get('/tracking/water/history', { params }),
  logSteps: (data) => api.post('/tracking/steps', data),
  getSteps: (params) => api.get('/tracking/steps', { params }),
  getStepHistory: (params) => api.get('/tracking/steps/history', { params }),
  getGoals: () => api.get('/tracking/goals'),
  createGoal: (data) => api.post('/tracking/goals', data),
  updateGoal: (id, data) => api.put(`/tracking/goals/${id}`, data),
  deleteGoal: (id) => api.delete(`/tracking/goals/${id}`),
  getNotifications: () => api.get('/tracking/notifications'),
  markRead: (id) => api.put(`/tracking/notifications/${id}/read`),
  markAllRead: () => api.put('/tracking/notifications/read-all'),
};

// Dashboard
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

// Coach
export const coachAPI = {
  getSuggestions: () => api.get('/coach/suggestions'),
};

// Admin
export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getStats: () => api.get('/admin/stats'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
