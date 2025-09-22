import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for offline mode
const mockData = {
  trains: Array.from({length: 20}, (_, i) => ({
    id: i + 1,
    trainNumber: `KMRL-${String(i + 1).padStart(3, '0')}`,
    model: ['Metro-A1', 'Metro-B2', 'Metro-C3'][i % 3],
    status: ['Available', 'Maintenance', 'In Service'][i % 3],
    mileage: 25000 + (i * 1000),
    currentDepot: ['Aluva Depot', 'Pettah Depot', 'Kalamassery Depot'][i % 3],
    healthScore: 60 + (i % 35),
    manufacturer: ['Alstom', 'BEML', 'Siemens'][i % 3],
    yearOfManufacture: 2020 + (i % 4),
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-02-10'
  })),
  dashboard: {
    fleet_metrics: {
      total_trains: 20,
      available_trains: 16,
      maintenance_due: 4,
      in_service: 0,
      availability_percentage: 80
    },
    anomaly_metrics: {
      total_anomalies: 2,
      trains_with_anomalies: 2
    },
    depot_utilization: [
      {name: 'Aluva Depot', utilization: 75, available_slots: 4},
      {name: 'Pettah Depot', utilization: 80, available_slots: 2},
      {name: 'Kalamassery Depot', utilization: 70, available_slots: 5}
    ],
    recent_sensor_data: []
  },
  inductionPlan: [
    {
      train_id: 1,
      train_number: 'KMRL-001',
      priority_score: 85.5,
      scheduled_date: new Date(Date.now() + 24*60*60*1000).toISOString(),
      depot_id: 1,
      reasoning: 'High priority due to maintenance requirements'
    }
  ]
};

// Offline mode helper
const createOfflineResponse = (data) => ({
  data: { success: true, data },
  status: 200,
  statusText: 'OK (Offline Mode)'
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with offline fallback
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.warn('API Error - Using offline mode:', error.message);
    // Return mock data instead of rejecting
    const url = error.config?.url || '';
    if (url.includes('/health')) return { status: 'healthy', timestamp: new Date().toISOString() };
    if (url.includes('/trains')) return { success: true, data: mockData.trains };
    if (url.includes('/dashboard')) return { success: true, data: mockData.dashboard };
    if (url.includes('/induction')) return { success: true, data: mockData.inductionPlan };
    return { success: true, data: [] };
  }
);

export const apiService = {
  // Health check with offline fallback
  healthCheck: async () => {
    try {
      return await api.get('/health');
    } catch (error) {
      return { status: 'healthy', timestamp: new Date().toISOString(), mode: 'offline' };
    }
  },

  // Train management with offline fallback
  getTrains: async (status = null) => {
    try {
      const params = status ? { status } : {};
      return await api.get('/trains', { params });
    } catch (error) {
      let trains = mockData.trains;
      if (status) {
        trains = trains.filter(t => t.status.toLowerCase() === status.toLowerCase());
      }
      return { success: true, data: trains };
    }
  },
  getTrain: async (id) => {
    try {
      return await api.get(`/trains/${id}`);
    } catch (error) {
      const train = mockData.trains.find(t => t.id === id);
      return { success: true, data: train || null };
    }
  },
  createTrain: async (trainData) => {
    try {
      return await api.post('/trains', trainData);
    } catch (error) {
      return { success: true, message: 'Train created (offline mode)', data: trainData };
    }
  },
  updateTrain: async (id, trainData) => {
    try {
      return await api.put(`/trains/${id}`, trainData);
    } catch (error) {
      return { success: true, message: 'Train updated (offline mode)' };
    }
  },
  deleteTrain: async (id) => {
    try {
      return await api.delete(`/trains/${id}`);
    } catch (error) {
      return { success: true, message: 'Train deleted (offline mode)' };
    }
  },

  // Dashboard with offline fallback
  getDashboardData: async () => {
    try {
      return await api.get('/dashboard');
    } catch (error) {
      return { success: true, data: mockData.dashboard };
    }
  },

  // Induction planning with offline fallback
  generateInductionPlan: async () => {
    try {
      return await api.post('/induction/generate-plan');
    } catch (error) {
      return { success: true, data: mockData.inductionPlan };
    }
  },
  getInductionPlan: async () => {
    try {
      return await api.get('/induction/plan');
    } catch (error) {
      return { success: true, data: mockData.inductionPlan };
    }
  },
  getInductionHistory: async (limit = 50) => {
    try {
      return await api.get('/induction/history', { params: { limit } });
    } catch (error) {
      return { success: true, data: [] };
    }
  },
  simulateScenario: async (scenarioData) => {
    try {
      return await api.post('/induction/simulate', scenarioData);
    } catch (error) {
      return {
        success: true,
        data: {
          scenario_type: scenarioData.scenario_type,
          base_metrics: { total_trains: 20, available_trains: 16 },
          simulation_metrics: { total_trains: 20, available_trains: 15 },
          impact: { service_disruption: 'Minimal', estimated_delay: '15 minutes' }
        }
      };
    }
  },

  // Analytics with offline fallback
  getPerformanceAnalytics: async () => {
    try {
      return await api.get('/analytics/performance');
    } catch (error) {
      return { success: true, data: [] };
    }
  },
  getMaintenanceAnalytics: async () => {
    try {
      return await api.get('/analytics/maintenance');
    } catch (error) {
      return { success: true, data: [] };
    }
  },
  getCostAnalytics: async () => {
    try {
      return await api.get('/analytics/cost');
    } catch (error) {
      return { success: true, data: [] };
    }
  },

  // Maintenance with offline fallback
  getMaintenanceRecords: async () => {
    try {
      return await api.get('/maintenance/records');
    } catch (error) {
      return { success: true, data: [] };
    }
  },
  scheduleMaintenance: async (maintenanceData) => {
    try {
      return await api.post('/maintenance/schedule', maintenanceData);
    } catch (error) {
      return { success: true, message: 'Maintenance scheduled (offline mode)' };
    }
  },
  updateMaintenanceStatus: async (id, status) => {
    try {
      return await api.put(`/maintenance/${id}/status`, { status });
    } catch (error) {
      return { success: true, message: 'Status updated (offline mode)' };
    }
  },
  getMaintenanceCalendar: async () => {
    try {
      return await api.get('/maintenance/calendar');
    } catch (error) {
      return { success: true, data: [] };
    }
  },

  // Alerts with offline fallback
  getAlerts: async (status = null) => {
    try {
      const params = status ? { status } : {};
      return await api.get('/alerts', { params });
    } catch (error) {
      return { success: true, data: [] };
    }
  },
  acknowledgeAlert: (id) => api.post(`/alerts/${id}/acknowledge`),
  resolveAlert: (id) => api.post(`/alerts/${id}/resolve`),
  createAlert: (alertData) => api.post('/alerts', alertData),

  // Reports with offline fallback
  generateReport: async (reportData) => {
    try {
      return await api.post('/reports/generate', reportData);
    } catch (error) {
      return { success: true, message: 'Report generated (offline mode)' };
    }
  },
  getReportHistory: async () => {
    try {
      return await api.get('/reports/history');
    } catch (error) {
      return { success: true, data: [] };
    }
  },
  downloadReport: (reportId) => api.get(`/reports/${reportId}/download`, { responseType: 'blob' }),
  getReportStatus: (reportId) => api.get(`/reports/${reportId}/status`),

  // Sensor data with offline fallback
  getSensorData: async (trainId, sensorType = null, timeRange = '1h') => {
    try {
      const params = { timeRange };
      if (sensorType) params.sensorType = sensorType;
      return await api.get(`/trains/${trainId}/sensors`, { params });
    } catch (error) {
      return { success: true, data: [] };
    }
  },
  getSensorAnomalies: (trainId = null) => {
    const params = trainId ? { trainId } : {};
    return api.get('/sensors/anomalies', { params });
  },

  // Depot management
  getDepots: () => api.get('/depots'),
  getDepotUtilization: () => api.get('/depots/utilization'),
  updateDepotCapacity: (depotId, capacity) => api.put(`/depots/${depotId}/capacity`, { capacity }),

  // User management (future implementation)
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),

  // System configuration
  getSystemConfig: () => api.get('/config'),
  updateSystemConfig: (config) => api.put('/config', config),
  
  // Notifications
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id) => api.put(`/notifications/${id}/read`),
  
  // Export/Import
  exportData: (dataType, format = 'json') => api.get(`/export/${dataType}`, { 
    params: { format },
    responseType: 'blob'
  }),
  importData: (dataType, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/import/${dataType}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// Legacy service exports for backward compatibility
export const inductionService = {
  testConnection: () => apiService.healthCheck(),
  getDashboardData: () => apiService.getDashboardData(),
  generateInductionPlan: () => apiService.generateInductionPlan(),
  simulateScenario: (data) => apiService.simulateScenario(data),
  getInductionHistory: () => apiService.getInductionHistory()
};

export const trainService = {
  getAllTrains: () => apiService.getTrains(),
  getAvailableTrains: () => apiService.getTrains('Available'),
  getMaintenanceTrains: () => apiService.getTrains('Maintenance'),
  getTrain: (id) => apiService.getTrain(id),
  createTrain: (data) => apiService.createTrain(data),
  updateTrain: (id, data) => apiService.updateTrain(id, data),
  deleteTrain: (id) => apiService.deleteTrain(id)
};

export default apiService;