import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Progress, Table, Button, message, Modal, Tag, Skeleton, Spin } from 'antd';

import { ReloadOutlined, ExperimentOutlined, LoadingOutlined } from '@ant-design/icons';
import { inductionService, trainService } from '../services/api';
import moment from 'moment';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anomalyModalVisible, setAnomalyModalVisible] = useState(false);
  const [anomalyDetails, setAnomalyDetails] = useState([]);
  const [trainModalVisible, setTrainModalVisible] = useState(false);
  const [trainDetails, setTrainDetails] = useState([]);
  const [trainModalTitle, setTrainModalTitle] = useState('');
  const [trainLoading, setTrainLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Attempting to connect to backend at:', 'http://localhost:8084/api/induction/dashboard');
      const response = await inductionService.getDashboardData();
      console.log('Backend response received:', response);
      // Handle Spring Boot response format
      const data = response.data.data || response.data;
      setDashboardData(data);
    } catch (error) {
      console.error('Dashboard error:', error);
      console.error('Error details:', error.response || error.message);
      // Use mock data when backend is not available
      const mockData = {
        fleet_metrics: {
          total_trains: 20,
          available_trains: 16,
          maintenance_due: 4,
          availability_percentage: 80
        },
        anomaly_metrics: {
          total_anomalies: 3,
          trains_with_anomalies: 2
        },
        depot_utilization: [
          { name: 'Aluva Depot', utilization: 80, available_slots: 3 },
          { name: 'Pettah Depot', utilization: 80, available_slots: 2 },
          { name: 'Kalamassery Depot', utilization: 75, available_slots: 3 }
        ],
        recent_sensor_data: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          train_id: Math.floor(Math.random() * 5) + 1,
          value: Math.random() * 100,
          sensor_type: ['temperature', 'vibration', 'brake_pressure'][Math.floor(Math.random() * 3)],
          unit: '°C',
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          is_anomaly: Math.random() > 0.8
        }))
      };
      setDashboardData(mockData);
      message.warning('Backend not available - Using demo data');
      console.log('Falling back to mock data due to:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const showTrainDetails = async (type, title) => {
    try {
      setTrainLoading(true);
      setTrainModalTitle(title);
      setTrainModalVisible(true);
      
      let response;
      if (type === 'all') {
        response = await trainService.getAllTrains();
      } else if (type === 'available') {
        response = await trainService.getAvailableTrains();
      } else if (type === 'maintenance') {
        response = await trainService.getMaintenanceTrains();
      }
      
      const data = response.data.data || response.data;
      setTrainDetails(data);
    } catch (error) {
      console.error('Error fetching train details:', error);
      const mockTrains = JSON.parse(localStorage.getItem('kmrl_trains') || '[]');
      setTrainDetails(mockTrains);
    } finally {
      setTrainLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !dashboardData) {
    return (
      <div className="dashboard-container" style={{ padding: '24px' }}>
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            @keyframes shimmer {
              0% { background-position: -200px 0; }
              100% { background-position: calc(200px + 100%) 0; }
            }
            .loading-shimmer {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200px 100%;
              animation: shimmer 1.5s infinite;
            }
            .pulse-animation {
              animation: pulse 2s infinite;
            }
          `}
        </style>
        
        {/* Loading Header */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Card style={{ 
              background: '#1a7f72',
              border: 'none',
              boxShadow: '0 10px 30px rgba(26, 127, 114, 0.3)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-30%',
                right: '-5%',
                width: '120px',
                height: '120px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                animation: 'pulse 3s ease-in-out infinite'
              }}></div>
              <Row justify="space-between" align="middle">
                <Col>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: 'white' }} spin />} />
                    <div>
                      <h2 style={{ color: 'white', margin: 0, fontSize: '28px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Loading Dashboard...</h2>
                      <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: '4px' }}>Fetching real-time data</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Loading Metrics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {[1,2,3,4].map(i => (
            <Col xs={24} sm={12} md={6} key={i}>
              <Card style={{ 
                background: 'white',
                border: 'none',
                boxShadow: '0 4px 12px rgba(26, 127, 114, 0.1)',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <Skeleton.Input style={{ width: 80, height: 16, marginBottom: 8 }} active />
                    <Skeleton.Input style={{ width: 60, height: 32 }} active />
                  </div>
                  <div className="loading-shimmer" style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%',
                    opacity: 0.3 
                  }}></div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Loading Depot Table */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card 
              style={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="pulse-animation" style={{ fontSize: '24px' }}>🏭</div>
                  <div>
                    <Skeleton.Input style={{ width: 200, height: 18 }} active />
                    <Skeleton.Input style={{ width: 300, height: 12, marginTop: 4 }} active />
                  </div>
                </div>
              }
            >
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  const { fleet_metrics, anomaly_metrics, depot_utilization } = dashboardData;



  const depotColumns = [
    {
      title: 'Depot Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <div>
          <strong>{name}</strong>
          <div style={{ fontSize: '11px', color: '#666' }}>
            {name.includes('Aluva') ? 'Main Depot - 15 Bays' : 
             name.includes('Pettah') ? 'Central Depot - 10 Bays' : 
             'Service Depot - 12 Bays'}
          </div>
        </div>
      )
    },
    {
      title: 'Current Utilization',
      dataIndex: 'utilization',
      key: 'utilization',
      render: (value) => (
        <div>
          <Progress 
            percent={Math.round(value)} 
            status={value > 80 ? 'exception' : value > 60 ? 'active' : 'success'}
            format={(percent) => `${percent}%`}
          />
          <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
            {value > 80 ? 'Critical - Consider load balancing' : 
             value > 60 ? 'Busy - Monitor closely' : 
             'Normal operations'}
          </div>
        </div>
      ),
    },
    {
      title: 'Available Maintenance Bays',
      dataIndex: 'available_slots',
      key: 'available_slots',
      render: (slots, record) => {
        const totalBays = record.name.includes('Aluva') ? 15 : 
                         record.name.includes('Pettah') ? 10 : 12;
        const occupiedBays = totalBays - slots;
        return (
          <div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: slots > 3 ? '#52c41a' : slots > 1 ? '#faad14' : '#ff4d4f' }}>
              {slots} / {totalBays}
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              {occupiedBays} bays occupied
            </div>
          </div>
        );
      }
    },
  ];

  return (
    <div className="dashboard-container">
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card style={{ 
            background: '#1a7f72',
            border: 'none',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <style>
              {`
                @keyframes gradientShift {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                @keyframes pulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                }
              `}
            </style>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              animation: 'pulse 3s ease-in-out infinite'
            }}></div>
            <Row justify="space-between" align="middle">
              <Col>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    fontSize: '36px',
                    background: 'rgba(255,255,255,0.2)',
                    padding: '12px',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}>📊</div>
                  <div>
                    <h2 style={{ color: 'white', margin: 0, fontSize: '28px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>KMRL Dashboard</h2>
                    <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: '4px' }}>Real-time Train Operations Overview</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '8px', display: 'flex', gap: '16px' }}>
                      <span>🏭 Aluva: 80% (3 free)</span>
                      <span>🏭 Pettah: 80% (2 free)</span>
                      <span>🏭 Kalamassery: 75% (3 free)</span>
                    </div>
                  </div>
                </div>
              </Col>
              <Col>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={fetchDashboardData}
                  loading={loading}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                >
                  Refresh Data
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Fleet Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card 
            hoverable
            onClick={() => showTrainDetails('all', 'All Trains')}
            style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '4px' }}>Total Trains</div>
                <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>{fleet_metrics.total_trains}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '4px' }}>Click to view details</div>
              </div>
              <div style={{ fontSize: '40px', opacity: 0.3 }}>🚊</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card 
            hoverable
            onClick={() => showTrainDetails('available', 'Available Trains')}
            style={{ 
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '4px' }}>Available Trains</div>
                <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>{fleet_metrics.available_trains}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '4px' }}>Click to view details</div>
              </div>
              <div style={{ fontSize: '40px', opacity: 0.3 }}>✅</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card 
            hoverable
            onClick={() => showTrainDetails('maintenance', 'Maintenance Due Trains')}
            style={{ 
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '4px' }}>Maintenance Due</div>
                <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>{fleet_metrics.maintenance_due}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '4px' }}>Click to view details</div>
              </div>
              <div style={{ fontSize: '40px', opacity: 0.3 }}>🔧</div>
            </div>
          </Card>
        </Col>

      </Row>



      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            style={{
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px' }}>🚊</div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a7f72' }}>Current Induction Plan</div>
                  <div style={{ fontSize: '12px', fontWeight: 'normal', color: '#666', marginTop: '2px' }}>
                    AI-generated train scheduling and maintenance optimization
                  </div>
                </div>
              </div>
            }
            extra={
              <Button 
                type="primary" 
                size="small"
                style={{ background: '#1a7f72', borderColor: '#1a7f72' }}
                onClick={() => window.location.href = '/induction-plan'}
              >
                View Full Plan
              </Button>
            }
          >
            <div style={{ 
              marginBottom: '16px', 
              padding: '16px', 
              background: 'linear-gradient(135deg, #f0f9ff, #dbeafe)', 
              borderRadius: '12px', 
              border: '1px solid #93c5fd',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                fontSize: '60px',
                opacity: 0.1
              }}>🤖</div>
              <div style={{ fontSize: '13px', color: '#1e40af', lineHeight: '1.5' }}>
                <strong>🤖 AI Optimization:</strong> The system continuously analyzes train conditions, maintenance schedules, and depot capacity to generate optimal induction plans. 
                High-priority trains are automatically scheduled based on mileage, sensor data, and safety requirements.
              </div>
            </div>
            <Table 
              dataSource={[
                {
                  key: 1,
                  train_number: 'KMRL-001',
                  priority_score: 85.5,
                  scheduled_date: moment().add(1, 'day').format('YYYY-MM-DD HH:mm'),
                  depot: 'Aluva Depot',
                  reasoning: 'High priority due to maintenance requirements; Approaching mileage limit (45000 km)'
                },
                {
                  key: 2,
                  train_number: 'KMRL-002',
                  priority_score: 72.3,
                  scheduled_date: moment().add(2, 'days').format('YYYY-MM-DD HH:mm'),
                  depot: 'Pettah Depot',
                  reasoning: 'Sensor anomalies detected; Scheduled maintenance required'
                },
                {
                  key: 3,
                  train_number: 'KMRL-003',
                  priority_score: 58.1,
                  scheduled_date: moment().add(3, 'days').format('YYYY-MM-DD HH:mm'),
                  depot: 'Kalamassery Depot',
                  reasoning: 'Regular maintenance due; Optimal scheduling window'
                }
              ]}
              columns={[
                {
                  title: 'Train',
                  dataIndex: 'train_number',
                  key: 'train_number',
                  render: (text) => <strong style={{ color: '#1a7f72' }}>{text}</strong>
                },
                {
                  title: 'Priority',
                  dataIndex: 'priority_score',
                  key: 'priority_score',
                  render: (score) => {
                    const color = score >= 70 ? 'red' : score >= 40 ? 'orange' : 'green';
                    const text = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low';
                    return <Tag color={color}>{text} ({score})</Tag>;
                  }
                },
                {
                  title: 'Scheduled',
                  dataIndex: 'scheduled_date',
                  key: 'scheduled_date'
                },
                {
                  title: 'Depot',
                  dataIndex: 'depot',
                  key: 'depot'
                },
                {
                  title: 'Reasoning',
                  dataIndex: 'reasoning',
                  key: 'reasoning',
                  ellipsis: true
                }
              ]}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>


      {/* Anomaly Alert */}
      {anomaly_metrics.total_anomalies > 0 && (
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card style={{ backgroundColor: '#fff2f0', borderColor: '#ffccc7' }}>
              <Row align="middle">
                <Col flex="auto">
                  <h4 style={{ color: '#ff4d4f', margin: 0 }}>
                    WARNING: {anomaly_metrics.total_anomalies} sensor anomalies detected 
                    across {anomaly_metrics.trains_with_anomalies} trains
                  </h4>
                </Col>
                <Col>
                  <Button 
                    type="primary" 
                    danger 
                    icon={<ExperimentOutlined />}
                    onClick={() => {
                      const anomalies = dashboardData.recent_sensor_data.filter(s => s.is_anomaly);
                      setAnomalyDetails(anomalies);
                      setAnomalyModalVisible(true);
                    }}
                  >
                    View Details
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      )}

      {/* Train Details Modal */}
      <Modal
        title={trainModalTitle}
        visible={trainModalVisible}
        onCancel={() => setTrainModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setTrainModalVisible(false)}>
            Close
          </Button>
        ]}
        width={1000}
      >
        <Table
          dataSource={trainDetails}
          rowKey="id"
          loading={trainLoading}
          columns={[
            {
              title: 'Train Number',
              dataIndex: 'trainNumber',
              key: 'trainNumber',
              render: (number) => <strong style={{ color: '#1a7f72' }}>{number || 'N/A'}</strong>
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => {
                const color = status === 'Available' ? 'green' : 
                             status === 'In Service' ? 'blue' : 'orange';
                return <Tag color={color}>{(status || 'Unknown').toUpperCase()}</Tag>;
              }
            },
            {
              title: 'Current Depot',
              dataIndex: 'currentDepot',
              key: 'currentDepot',
              render: (depot) => depot || 'N/A'
            },
            {
              title: 'Mileage',
              dataIndex: 'mileage',
              key: 'mileage',
              render: (mileage) => `${(mileage || 0).toLocaleString()} km`
            },
            {
              title: 'Model',
              dataIndex: 'model',
              key: 'model',
              render: (model) => model || 'N/A'
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Button 
                  size="small" 
                  onClick={() => {
                    Modal.info({
                      title: `Train Details - ${record.trainNumber}`,
                      width: 800,
                      content: (
                        <div style={{ marginTop: 16 }}>
                          <Row gutter={[16, 16]}>
                            <Col span={12}>
                              <Card title="Basic Information" size="small">
                                <p><strong>Model:</strong> {record.model}</p>
                                <p><strong>Manufacturer:</strong> {record.manufacturer || 'N/A'}</p>
                                <p><strong>Year:</strong> {record.yearOfManufacture || 'N/A'}</p>
                                <p><strong>Capacity:</strong> {record.capacity || 'N/A'} passengers</p>
                                <p><strong>Max Speed:</strong> {record.maxSpeed || 'N/A'} km/h</p>
                                <p><strong>Power Type:</strong> {record.powerType || 'Electric'}</p>
                              </Card>
                            </Col>
                            <Col span={12}>
                              <Card title="Operational Status" size="small">
                                <p><strong>Current Status:</strong> <Tag color={record.status === 'Available' ? 'green' : 'orange'}>{record.status}</Tag></p>
                                <p><strong>Health Score:</strong> {record.healthScore || 100}%</p>
                                <p><strong>Total Mileage:</strong> {record.mileage?.toLocaleString()} km</p>
                                <p><strong>Service Hours:</strong> {record.totalServiceHours?.toLocaleString() || 'N/A'} hrs</p>
                                <p><strong>Current Depot:</strong> {record.currentDepot}</p>
                              </Card>
                            </Col>
                            <Col span={12}>
                              <Card title="Maintenance" size="small">
                                <p><strong>Last Maintenance:</strong> {record.lastMaintenance || 'N/A'}</p>
                                <p><strong>Next Maintenance:</strong> {record.nextMaintenance || 'N/A'}</p>
                                <p><strong>Emergency Brakes:</strong> {record.emergencyBrakes || 'Functional'}</p>
                              </Card>
                            </Col>
                            <Col span={12}>
                              <Card title="Features" size="small">
                                <p><strong>Air Conditioning:</strong> {record.airConditioning || 'Yes'}</p>
                                <p><strong>WiFi:</strong> {record.wifiEnabled ? 'Yes' : 'No'}</p>
                                <p><strong>CCTV Cameras:</strong> {record.cctv || 'N/A'}</p>
                                <p><strong>Door System:</strong> {record.doorSystem || 'Automatic'}</p>
                              </Card>
                            </Col>
                            <Col span={24}>
                              <Card title="Fitness Certificate" size="small">
                                <Row gutter={16}>
                                  <Col span={8}>
                                    <p><strong>Certificate No:</strong> {record.fitnessCertificate?.certificateNumber || 'N/A'}</p>
                                    <p><strong>Status:</strong> <Tag color={record.fitnessCertificate?.status === 'Valid' ? 'green' : record.fitnessCertificate?.status === 'Under Review' ? 'orange' : 'red'}>{record.fitnessCertificate?.status || 'N/A'}</Tag></p>
                                  </Col>
                                  <Col span={8}>
                                    <p><strong>Issued Date:</strong> {record.fitnessCertificate?.issuedDate || 'N/A'}</p>
                                    <p><strong>Expiry Date:</strong> {record.fitnessCertificate?.expiryDate || 'N/A'}</p>
                                  </Col>
                                  <Col span={8}>
                                    <p><strong>Last Inspection:</strong> {record.fitnessCertificate?.lastInspectionDate || 'N/A'}</p>
                                    <p><strong>Next Inspection:</strong> {record.fitnessCertificate?.nextInspectionDue || 'N/A'}</p>
                                  </Col>
                                </Row>
                                <p><strong>Certifying Authority:</strong> {record.fitnessCertificate?.certifyingAuthority || 'N/A'}</p>
                              </Card>
                            </Col>
                            <Col span={24}>
                              <Card title="Branding Contract" size="small">
                                <Row gutter={16}>
                                  <Col span={8}>
                                    <p><strong>Company:</strong> {record.brandingContract?.companyName || 'N/A'}</p>
                                    <p><strong>Branding Type:</strong> {record.brandingContract?.brandingType || 'N/A'}</p>
                                  </Col>
                                  <Col span={8}>
                                    <p><strong>Contracted Hours:</strong> {record.brandingContract?.contractedHours?.toLocaleString() || 'N/A'} hrs</p>
                                    <p><strong>Used Hours:</strong> {record.brandingContract?.usedHours?.toLocaleString() || 'N/A'} hrs</p>
                                  </Col>
                                  <Col span={8}>
                                    <p><strong>Contract Period:</strong> {record.brandingContract?.contractStartDate || 'N/A'} to {record.brandingContract?.contractEndDate || 'N/A'}</p>
                                    <p><strong>Remaining Hours:</strong> {record.brandingContract?.contractedHours && record.brandingContract?.usedHours ? (record.brandingContract.contractedHours - record.brandingContract.usedHours).toLocaleString() : 'N/A'} hrs</p>
                                  </Col>
                                </Row>
                              </Card>
                            </Col>
                          </Row>
                        </div>
                      )
                    });
                  }}
                >
                  View Details
                </Button>
              )
            }
          ]}
          pagination={{ pageSize: 10 }}
        />
      </Modal>

      {/* Anomaly Details Modal */}
      <Modal
        title="Sensor Anomaly Details"
        visible={anomalyModalVisible}
        onCancel={() => setAnomalyModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setAnomalyModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        <Table
          dataSource={anomalyDetails}
          rowKey="id"
          columns={[
            {
              title: 'Train ID',
              dataIndex: 'train_id',
              key: 'train_id',
              render: (id) => `KMRL-${id.toString().padStart(3, '0')}`
            },
            {
              title: 'Sensor Type',
              dataIndex: 'sensor_type',
              key: 'sensor_type',
              render: (type) => <Tag color="blue">{type.toUpperCase()}</Tag>
            },
            {
              title: 'Value',
              dataIndex: 'value',
              key: 'value',
              render: (value, record) => `${value.toFixed(2)} ${record.unit}`
            },
            {
              title: 'Timestamp',
              dataIndex: 'timestamp',
              key: 'timestamp',
              render: (timestamp) => moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
            },
            {
              title: 'Status',
              dataIndex: 'is_anomaly',
              key: 'status',
              render: (isAnomaly) => (
                <Tag color={isAnomaly ? 'red' : 'green'}>
                  {isAnomaly ? 'ANOMALY' : 'NORMAL'}
                </Tag>
              )
            }
          ]}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;