import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Button, message, Modal, Tag } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ReloadOutlined, ExperimentOutlined } from '@ant-design/icons';
import { inductionService } from '../services/api';
import moment from 'moment';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anomalyModalVisible, setAnomalyModalVisible] = useState(false);
  const [anomalyDetails, setAnomalyDetails] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await inductionService.getDashboardData();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Dashboard error:', error);
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
      message.warning('Using demo data - Backend server not connected');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !dashboardData) {
    return <div>Loading dashboard...</div>;
  }

  const { fleet_metrics, anomaly_metrics, depot_utilization, recent_sensor_data } = dashboardData;

  // Prepare sensor data for chart
  const sensorChartData = recent_sensor_data.slice(-10).map((sensor, index) => ({
    time: `T${index + 1}`,
    value: sensor.value,
    type: sensor.sensor_type,
    anomaly: sensor.is_anomaly
  }));

  const depotColumns = [
    {
      title: 'Depot Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Utilization',
      dataIndex: 'utilization',
      key: 'utilization',
      render: (value) => (
        <Progress 
          percent={Math.round(value)} 
          status={value > 80 ? 'exception' : value > 60 ? 'active' : 'success'}
        />
      ),
    },
    {
      title: 'Available Slots',
      dataIndex: 'available_slots',
      key: 'available_slots',
    },
  ];

  return (
    <div className="dashboard-container">
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Row justify="space-between" align="middle">
              <Col>
                <h2>KMRL Train Induction Planning Dashboard</h2>
              </Col>
              <Col>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={fetchDashboardData}
                  loading={loading}
                >
                  Refresh
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Fleet Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Trains"
              value={fleet_metrics.total_trains}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Available Trains"
              value={fleet_metrics.available_trains}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Maintenance Due"
              value={fleet_metrics.maintenance_due}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Fleet Availability"
              value={fleet_metrics.availability_percentage}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts and Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Sensor Readings" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1890ff" 
                  strokeWidth={2}
                  dot={{ fill: '#1890ff', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Depot Utilization" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={depot_utilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="utilization" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Depot Status Details">
            <Table 
              columns={depotColumns} 
              dataSource={depot_utilization}
              rowKey="name"
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
                    ⚠️ {anomaly_metrics.total_anomalies} sensor anomalies detected 
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