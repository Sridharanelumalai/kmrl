// Mock API responses for frontend-only application
const mockAPI = {
  get: (url) => Promise.resolve({ data: getMockData(url) }),
  post: (url, data) => Promise.resolve({ data: { success: true, message: 'Success', data } }),
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
  if (url.includes('/induction/dashboard')) {
    const trains = JSON.parse(localStorage.getItem('kmrl_trains') || '[]');
    return {
      success: true,
      data: {
        fleet_metrics: {
          total_trains: trains.length,
          available_trains: trains.filter(t => t.status === 'Available').length,
          maintenance_due: trains.filter(t => t.status === 'Maintenance').length,
          in_service: trains.filter(t => t.status === 'In Service').length,
          availability_percentage: trains.length > 0 ? (trains.filter(t => t.status === 'Available').length * 100 / trains.length) : 0
        },
        anomaly_metrics: { total_anomalies: 3, trains_with_anomalies: 2 },
        depot_utilization: [
          { name: 'Aluva Depot', utilization: 80, available_slots: 3 },
          { name: 'Pettah Depot', utilization: 80, available_slots: 2 },
          { name: 'Kalamassery Depot', utilization: 75, available_slots: 3 }
        ],
        recent_sensor_data: [
          { id: 1, train_id: 3, value: 95.2, sensor_type: 'temperature', unit: '°C', timestamp: '2024-01-20T10:30:00Z', is_anomaly: true },
          { id: 2, train_id: 5, value: 8.5, sensor_type: 'vibration', unit: 'mm/s', timestamp: '2024-01-20T11:15:00Z', is_anomaly: true }
        ]
      }
    };
  }
  return { success: true, data: [] };
};

export const trainService = {
  getAllTrains: () => mockAPI.get('/trains/all'),
  getAvailableTrains: () => mockAPI.get('/trains/available'),
  getMaintenanceTrains: () => mockAPI.get('/trains/maintenance'),
  getTrain: (id) => mockAPI.get(`/trains/${id}`),
  createTrain: (data) => {
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
      nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      manufacturer: data.model.includes('A1') ? 'Alstom' : 'BEML',
      yearOfManufacture: new Date().getFullYear(),
      capacity: 1200,
      maxSpeed: 80,
      powerType: 'Electric',
      airConditioning: 'Yes',
      wifiEnabled: true,
      cctv: 8,
      emergencyBrakes: 'Functional',
      doorSystem: 'Automatic',
      totalServiceHours: 0,
      fitnessCertificate: {
        certificateNumber: `FC-${Date.now().toString().slice(-6)}`,
        issuedDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        certifyingAuthority: 'Commissioner of Railway Safety (CRS)',
        status: 'Valid',
        lastInspectionDate: new Date().toISOString().split('T')[0],
        nextInspectionDue: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      brandingContract: {
        companyName: 'Kerala Tourism Board',
        contractedHours: 2400,
        usedHours: Math.floor(Math.random() * 1000),
        contractStartDate: '2024-01-01',
        contractEndDate: '2024-12-31',
        brandingType: 'Full Wrap'
      }
    };
    trains.push(newTrain);
    localStorage.setItem('kmrl_trains', JSON.stringify(trains));
    return Promise.resolve({ data: { success: true, message: 'Train created successfully', data: newTrain } });
  },
  updateTrain: (id, data) => mockAPI.put(`/trains/${id}`, data),
  deleteTrain: (id) => mockAPI.delete(`/trains/${id}`),
  getTrainMaintenance: (id) => mockAPI.get(`/trains/${id}/maintenance`),
  getTrainSensors: (id) => mockAPI.get(`/trains/${id}/sensors`),
};

export const inductionService = {
  getInductionPlan: () => mockAPI.get('/induction/plan'),
  getDashboardData: () => mockAPI.get('/induction/dashboard'),
  simulateScenario: (data) => mockAPI.post('/induction/simulate', data),
  getHistory: (limit = 50) => mockAPI.get(`/induction/history?limit=${limit}`),
  testConnection: () => mockAPI.get('/induction/dashboard')
};

export default mockAPI;