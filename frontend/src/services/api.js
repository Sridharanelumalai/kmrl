import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const trainService = {
  getTrains: () => api.get('/trains/'),
  getTrain: (id) => api.get(`/trains/${id}`),
  createTrain: (data) => api.post('/trains/', data),
  getTrainMaintenance: (id) => api.get(`/trains/${id}/maintenance`),
  getTrainSensors: (id) => api.get(`/trains/${id}/sensors`),
};

export const inductionService = {
  generatePlan: () => api.get('/induction/plan'),
  simulateWhatIf: (data) => api.post('/induction/simulate', data),
  getDashboardData: () => api.get('/induction/dashboard'),
  getHistory: (limit = 50) => api.get(`/induction/history?limit=${limit}`),
};

export default api;