import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication headers to all requests
api.interceptors.request.use(
  (config) => {
    const userEmail = localStorage.getItem('kmrl_user_email');
    const isAuthenticated = localStorage.getItem('kmrl_auth');
    
    if (isAuthenticated && userEmail) {
      config.headers.authorization = 'Bearer authenticated';
      config.headers['x-user-email'] = userEmail;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication and errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear authentication and redirect to login
      localStorage.removeItem('kmrl_auth');
      localStorage.removeItem('kmrl_user_email');
      localStorage.removeItem('kmrl_user_id');
      window.location.reload();
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const trainService = {
  getAllTrains: () => api.get('/trains/all'),
  getAvailableTrains: () => api.get('/trains/available'),
  getMaintenanceTrains: () => api.get('/trains/maintenance'),
  getTrain: (id) => api.get(`/trains/${id}`),
  createTrain: (data) => api.post('/trains', data),
  updateTrain: (id, data) => api.put(`/trains/${id}`, data),
  deleteTrain: (id) => api.delete(`/trains/${id}`),
  getTrainMaintenance: (id) => api.get(`/trains/${id}/maintenance`),
  getTrainSensors: (id) => api.get(`/trains/${id}/sensors`),
};

export const inductionService = {
  getInductionPlan: () => api.get('/induction/plan'),
  getDashboardData: () => api.get('/induction/dashboard'),
  simulateScenario: (data) => api.post('/induction/simulate', data),
  getHistory: (limit = 50) => api.get(`/induction/history?limit=${limit}`),
  testConnection: () => api.get('/induction/dashboard')
};

export default api;

// Test connection function
export const testConnection = async () => {
  try {
    const response = await api.get('/induction/dashboard');
    console.log('Backend connection successful:', response.data);
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error.message);
    return false;
  }
};