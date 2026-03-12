import api from './api';

// Auth Service
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => localStorage.removeItem('token')
};

// Waste Service
export const wasteService = {
  createWaste: (wasteData) => api.post('/waste', wasteData),
  getAllWaste: (filters) => api.get('/waste', { params: filters }),
  getWasteById: (id) => api.get(`/waste/${id}`),
  updateWaste: (id, wasteData) => api.put(`/waste/${id}`, wasteData),
  deleteWaste: (id) => api.delete(`/waste/${id}`),
  getWasteStats: () => api.get('/waste/stats')
};

// Collection Service
export const collectionService = {
  createCollection: (collectionData) => api.post('/collections', collectionData),
  getAllCollections: (filters) => api.get('/collections', { params: filters }),
  getCollectionById: (id) => api.get(`/collections/${id}`),
  updateCollection: (id, collectionData) => api.put(`/collections/${id}`, collectionData),
  deleteCollection: (id) => api.delete(`/collections/${id}`),
  getCollectionStats: () => api.get('/collections/stats'),
  initiatePayment: (id, paymentData) => api.post(`/collections/${id}/payment/initiate`, paymentData),
  getPaymentStatus: (id) => api.get(`/collections/${id}/payment`)
};

// Report Service
export const reportService = {
  generateReport: (reportData) => api.post('/reports', reportData),
  getAllReports: (filters) => api.get('/reports', { params: filters }),
  getReportById: (id) => api.get(`/reports/${id}`),
  updateReport: (id, reportData) => api.put(`/reports/${id}`, reportData),
  deleteReport: (id) => api.delete(`/reports/${id}`)
};

// User Service
export const userService = {
  getAllUsers: (filters) => api.get('/users', { params: filters }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  changeUserRole: (id, role) => api.patch(`/users/${id}/role`, { role })
};
