// REST API Backend Configuration
const API_BASE_URL = 'http://localhost:8001/api';

// REST API Service
const restAPI = {
  get: async (url) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return { data: result };
    } catch (error) {
      console.error('REST API Error:', error);
      throw error;
    }
  },
  
  post: async (url, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return { data: result };
    } catch (error) {
      console.error('REST API Error:', error);
      throw error;
    }
  },
  
  put: async (url, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return { data: result };
    } catch (error) {
      console.error('REST API Error:', error);
      throw error;
    }
  },
  
  delete: async (url) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return { data: result };
    } catch (error) {
      console.error('REST API Error:', error);
      throw error;
    }
  }
};

// Mock API responses for fallback
const mockAPI = {
  get: (url) => Promise.resolve({ data: getMockData(url) }),
  post: (url, data) => {
    if (url.includes('/induction/simulate')) {
      return Promise.resolve({
        data: {
          success: true,
          data: {
            scenario_type: data.scenario_type || 'train_replacement',
            base_metrics: { total_trains: 20, available_trains: 16, scheduled_trains: 4 },
            simulation_metrics: { total_trains: 20, available_trains: 15, scheduled_trains: 5 },
            impact: { service_disruption: 'Minimal', replacement_found: true, estimated_delay: '15 minutes' },
            replacement_details: data.replacement_train_id ? {
              original_train: `KMRL-${String(data.train_id || 1).padStart(3, '0')}`,
              replacement_train: `KMRL-${String(data.replacement_train_id).padStart(3, '0')}`,
              depot_transfer_time: '30 minutes',
              service_resumption: 'Next scheduled departure'
            } : null
          }
        }
      });
    }
    return Promise.resolve({ data: { success: true, message: 'Success', data } });
  },
  put: (url, data) => Promise.resolve({ data: { success: true, message: 'Updated', data } }),
  delete: (url) => Promise.resolve({ data: { success: true, message: 'Deleted' } })
};

const getMockData = (url) => {
  if (url.includes('/trains/all')) {
    return {
      success: true,
      data: JSON.parse(localStorage.getItem('kmrl_trains') || '[]')
    };
  }
  if (url.includes('/induction/plan')) {
    return {
      success: true,
      data: [
        {
          train_id: 1,
          train_number: 'KMRL-001',
          priority_score: 85.5,
          scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          depot_id: 1,
          reasoning: 'High mileage (45,000 km); Health score below optimal (75%)'
        },
        {
          train_id: 2,
          train_number: 'KMRL-002',
          priority_score: 72.3,
          scheduled_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          depot_id: 2,
          reasoning: 'Scheduled maintenance due; Sensor anomalies detected'
        },
        {
          train_id: 3,
          train_number: 'KMRL-003',
          priority_score: 58.1,
          scheduled_date: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
          depot_id: 1,
          reasoning: 'Regular maintenance due; Optimal scheduling window'
        }
      ]
    };
  }
  if (url.includes('/induction/dashboard')) {
    const trains = JSON.parse(localStorage.getItem('kmrl_trains') || '[]');
    return {
      success: true,
      data: {
        fleet_metrics: {
          total_trains: trains.length || 20,
          available_trains: trains.filter(t => t.status === 'Available').length || 16,
          maintenance_due: trains.filter(t => t.status === 'Maintenance').length || 4,
          in_service: trains.filter(t => t.status === 'In Service').length || 0,
          availability_percentage: trains.length > 0 ? (trains.filter(t => t.status === 'Available').length * 100 / trains.length) : 80
        },
        anomaly_metrics: { total_anomalies: 3, trains_with_anomalies: 2 },
        depot_utilization: [
          { name: 'Aluva Depot', utilization: 75, available_slots: 4 },
          { name: 'Pettah Depot', utilization: 80, available_slots: 2 },
          { name: 'Kalamassery Depot', utilization: 70, available_slots: 5 }
        ],
        recent_sensor_data: [
          { id: 1, train_id: 3, value: 95.2, sensor_type: 'temperature', unit: '°C', timestamp: new Date().toISOString(), is_anomaly: true },
          { id: 2, train_id: 5, value: 8.5, sensor_type: 'vibration', unit: 'mm/s', timestamp: new Date().toISOString(), is_anomaly: true }
        ]
      }
    };
  }
  if (url.includes('/induction/history')) {
    return {
      success: true,
      data: [
        {
          id: 1,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' '),
          trains_scheduled: 5,
          high_priority: 2,
          avg_score: 67.8,
          generated_by: 'System Auto',
          status: 'Completed'
        }
      ]
    };
  }
  return { success: true, data: [] };
};

export const trainService = {
  getAllTrains: async () => {
    try {
      return await restAPI.get('/trains');
    } catch (error) {
      console.warn('Backend unavailable, using fallback');
      return mockAPI.get('/trains/all');
    }
  },
  
  getAvailableTrains: async () => {
    try {
      return await restAPI.get('/trains?status=available');
    } catch (error) {
      console.warn('Backend unavailable, using fallback');
      return mockAPI.get('/trains/available');
    }
  },
  
  getMaintenanceTrains: async () => {
    try {
      return await restAPI.get('/trains?status=maintenance');
    } catch (error) {
      console.warn('Backend unavailable, using fallback');
      return mockAPI.get('/trains/maintenance');
    }
  },
  
  getTrain: async (id) => {
    try {
      return await restAPI.get(`/trains/${id}`);
    } catch (error) {
      console.warn('Backend unavailable, using fallback');
      return mockAPI.get(`/trains/${id}`);
    }
  },
  
  createTrain: async (data) => {
    try {
      return await restAPI.post('/trains', data);
    } catch (error) {
      console.warn('Backend unavailable, using fallback');
      // Fallback to localStorage
      const trains = JSON.parse(localStorage.getItem('kmrl_trains') || '[]');
      const newTrain = {
        id: Date.now(),
        trainNumber: data.train_number,
        model: data.model,
        status: 'Available',
        mileage: parseInt(data.current_mileage) || 0,
        currentDepot: data.depot_id === 1 ? 'Aluva Depot' : data.depot_id === 2 ? 'Pettah Depot' : 'Kalamassery Depot',
        healthScore: 100,
        lastMaintenance: new Date().toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      trains.push(newTrain);
      localStorage.setItem('kmrl_trains', JSON.stringify(trains));
      return Promise.resolve({ data: { success: true, message: 'Train created successfully', data: newTrain } });
    }
  },
  
  updateTrain: async (id, data) => {
    try {
      return await restAPI.put(`/trains/${id}`, data);
    } catch (error) {
      console.warn('Backend unavailable, using fallback');
      return mockAPI.put(`/trains/${id}`, data);
    }
  },
  
  deleteTrain: async (id) => {
    try {
      return await restAPI.delete(`/trains/${id}`);
    } catch (error) {
      console.warn('Backend unavailable, using fallback');
      return mockAPI.delete(`/trains/${id}`);
    }
  },
  
  getTrainMaintenance: async (id) => {
    try {
      return await restAPI.get(`/trains/${id}/maintenance`);
    } catch (error) {
      console.warn('Backend unavailable, using fallback');
      return mockAPI.get(`/trains/${id}/maintenance`);
    }
  },
  
  getTrainSensors: async (id) => {
    try {
      return await restAPI.get(`/trains/${id}/sensors`);
    } catch (error) {
      console.warn('Backend unavailable, using fallback');
      return mockAPI.get(`/trains/${id}/sensors`);
    }
  }
};

export const inductionService = {
  getInductionPlan: async () => {
    try {
      console.log('Calling backend induction planning...');
      const result = await restAPI.post('/induction/generate-plan', {});
      console.log('Backend induction plan result:', result);
      return result;
    } catch (error) {
      console.warn('Backend unavailable, using fallback:', error.message);
      console.log('Using mock induction plan data');
      return mockAPI.get('/induction/plan');
    }
  },
  
  simulateScenario: async (scenarioData) => {
    try {
      return await restAPI.post('/induction/simulate', scenarioData);
    } catch (error) {
      console.warn('Backend unavailable, using fallback:', error.message);
      return mockAPI.post('/induction/simulate', scenarioData);
    }
  },
  
  getDashboardData: async () => {
    try {
      return await restAPI.get('/dashboard');
    } catch (error) {
      console.warn('Backend unavailable, using fallback');
      return mockAPI.get('/induction/dashboard');
    }
  },
  
  getHistory: async (limit = 50) => {
    try {
      return await restAPI.get(`/induction/history?limit=${limit}`);
    } catch (error) {
      console.warn('Backend unavailable, using fallback');
      return mockAPI.get(`/induction/history?limit=${limit}`);
    }
  },
  
  testConnection: async () => {
    try {
      console.log('Testing backend connection...');
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      const isConnected = response.ok;
      
      console.log(`Backend connection test: ${isConnected ? 'SUCCESS' : 'FAILED'} (${response.status})`);
      console.log('Backend health data:', data);
      
      return { data: { success: isConnected, connected: isConnected } };
    } catch (error) {
      console.error('❌ Backend connection failed:', error.message);
      return { data: { success: false, connected: false, error: error.message } };
    }
  }
};

export { restAPI };
export default mockAPI;