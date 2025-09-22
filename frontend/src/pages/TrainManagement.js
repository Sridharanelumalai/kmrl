import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, message, Tag, Row, Col } from 'antd';
import { PlusOutlined, EyeOutlined, ToolOutlined } from '@ant-design/icons';
import { trainService } from '../services/api';
import { theme } from '../styles/theme';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useTranslation } from '../i18n/translations';
import moment from 'moment';

const { Option } = Select;

const TrainManagement = () => {
  const { t } = useTranslation();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [form] = Form.useForm();

  const fetchTrains = async () => {
    try {
      setLoading(true);
      const response = await trainService.getAllTrains();
      const data = response.data.data || response.data;
      setTrains(data);
    } catch (error) {
      console.error('Failed to fetch trains:', error);
      // Use mock data when backend is not available
      const mockTrains = [
        {
          id: 1,
          train_number: 'KMRL-001',
          model: 'Metro-A1',
          depot_id: 1,
          current_mileage: 45000,
          status: 'available'
        },
        {
          id: 2,
          train_number: 'KMRL-002',
          model: 'Metro-B2',
          depot_id: 2,
          current_mileage: 32000,
          status: 'maintenance'
        },
        {
          id: 3,
          train_number: 'KMRL-003',
          model: 'Metro-A1',
          depot_id: 1,
          current_mileage: 28000,
          status: 'available'
        }
      ];
      setTrains(mockTrains);
      message.warning('Using demo data - Backend server not connected');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainDetails = async (trainId) => {
    try {
      const [maintenanceResponse, sensorResponse] = await Promise.all([
        trainService.getTrainMaintenance(trainId),
        trainService.getTrainSensors(trainId)
      ]);
      
      setMaintenanceData(maintenanceResponse.data);
      setSensorData(sensorResponse.data);
    } catch (error) {
      console.error('Failed to fetch train details:', error);
      // Use mock data
      const mockMaintenance = [
        {
          id: 1,
          maintenance_type: 'scheduled',
          description: 'Regular maintenance check',
          scheduled_date: new Date().toISOString(),
          status: 'completed',
          cost: 5000
        }
      ];
      const mockSensors = [
        {
          id: 1,
          sensor_type: 'temperature',
          value: 45.2,
          unit: '°C',
          timestamp: new Date().toISOString(),
          is_anomaly: false
        }
      ];
      setMaintenanceData(mockMaintenance);
      setSensorData(mockSensors);
    }
  };

  const handleCreateTrain = async (values) => {
    try {
      const response = await trainService.createTrain(values);
      if (response.data.success) {
        message.success('Train created successfully');
        setModalVisible(false);
        form.resetFields();
        fetchTrains();
      } else {
        message.error(response.data.message || 'Failed to create train');
      }
    } catch (error) {
      console.error('Create train error:', error);
      message.error('Failed to create train');
    }
  };

  const showTrainDetails = async (train) => {
    setSelectedTrain(train);
    await fetchTrainDetails(train.id);
    setDetailModalVisible(true);
  };

  const showTrainDetailsModal = (train) => {
    Modal.info({
      title: `Train Details - ${train.trainNumber}`,
      width: 800,
      content: (
        <div style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Basic Information" size="small">
                <p><strong>Model:</strong> {train.model}</p>
                <p><strong>Manufacturer:</strong> {train.manufacturer || 'N/A'}</p>
                <p><strong>Year:</strong> {train.yearOfManufacture || 'N/A'}</p>
                <p><strong>Capacity:</strong> {train.capacity || 'N/A'} passengers</p>
                <p><strong>Max Speed:</strong> {train.maxSpeed || 'N/A'} km/h</p>
                <p><strong>Power Type:</strong> {train.powerType || 'Electric'}</p>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Operational Status" size="small">
                <p><strong>Current Status:</strong> <Tag color={train.status === 'Available' ? 'green' : 'orange'}>{train.status}</Tag></p>
                <p><strong>Health Score:</strong> {train.healthScore || 100}%</p>
                <p><strong>Total Mileage:</strong> {train.mileage?.toLocaleString()} km</p>
                <p><strong>Service Hours:</strong> {train.totalServiceHours?.toLocaleString() || 'N/A'} hrs</p>
                <p><strong>Current Depot:</strong> {train.currentDepot}</p>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Maintenance" size="small">
                <p><strong>Last Maintenance:</strong> {train.lastMaintenance || 'N/A'}</p>
                <p><strong>Next Maintenance:</strong> {train.nextMaintenance || 'N/A'}</p>
                <p><strong>Emergency Brakes:</strong> {train.emergencyBrakes || 'Functional'}</p>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Features" size="small">
                <p><strong>Air Conditioning:</strong> {train.airConditioning || 'Yes'}</p>
                <p><strong>WiFi:</strong> {train.wifiEnabled ? 'Yes' : 'No'}</p>
                <p><strong>CCTV Cameras:</strong> {train.cctv || 'N/A'}</p>
                <p><strong>Door System:</strong> {train.doorSystem || 'Automatic'}</p>
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Fitness Certificate" size="small">
                <Row gutter={16}>
                  <Col span={8}>
                    <p><strong>Certificate No:</strong> {train.fitnessCertificate?.certificateNumber || 'N/A'}</p>
                    <p><strong>Status:</strong> <Tag color={train.fitnessCertificate?.status === 'Valid' ? 'green' : train.fitnessCertificate?.status === 'Under Review' ? 'orange' : 'red'}>{train.fitnessCertificate?.status || 'N/A'}</Tag></p>
                  </Col>
                  <Col span={8}>
                    <p><strong>Issued Date:</strong> {train.fitnessCertificate?.issuedDate || 'N/A'}</p>
                    <p><strong>Expiry Date:</strong> {train.fitnessCertificate?.expiryDate || 'N/A'}</p>
                  </Col>
                  <Col span={8}>
                    <p><strong>Last Inspection:</strong> {train.fitnessCertificate?.lastInspectionDate || 'N/A'}</p>
                    <p><strong>Next Inspection:</strong> {train.fitnessCertificate?.nextInspectionDue || 'N/A'}</p>
                  </Col>
                </Row>
                <p><strong>Certifying Authority:</strong> {train.fitnessCertificate?.certifyingAuthority || 'N/A'}</p>
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Branding Contract" size="small">
                <Row gutter={16}>
                  <Col span={8}>
                    <p><strong>Company:</strong> {train.brandingContract?.companyName || 'N/A'}</p>
                    <p><strong>Branding Type:</strong> {train.brandingContract?.brandingType || 'N/A'}</p>
                  </Col>
                  <Col span={8}>
                    <p><strong>Contracted Hours:</strong> {train.brandingContract?.contractedHours?.toLocaleString() || 'N/A'} hrs</p>
                    <p><strong>Used Hours:</strong> {train.brandingContract?.usedHours?.toLocaleString() || 'N/A'} hrs</p>
                  </Col>
                  <Col span={8}>
                    <p><strong>Contract Period:</strong> {train.brandingContract?.contractStartDate || 'N/A'} to {train.brandingContract?.contractEndDate || 'N/A'}</p>
                    <p><strong>Remaining Hours:</strong> {train.brandingContract?.contractedHours && train.brandingContract?.usedHours ? (train.brandingContract.contractedHours - train.brandingContract.usedHours).toLocaleString() : 'N/A'} hrs</p>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      )
    });
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      available: 'green',
      maintenance: 'orange',
      service: 'blue',
      out_of_order: 'red'
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Train Number',
      dataIndex: 'trainNumber',
      key: 'trainNumber',
      sorter: (a, b) => (a.trainNumber || '').localeCompare(b.trainNumber || ''),
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Current Mileage',
      dataIndex: 'mileage',
      key: 'mileage',
      render: (mileage) => `${mileage?.toLocaleString() || 0} km`,
      sorter: (a, b) => (a.mileage || 0) - (b.mileage || 0),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Available', value: 'available' },
        { text: 'Maintenance', value: 'maintenance' },
        { text: 'Service', value: 'service' },
        { text: 'Out of Order', value: 'out_of_order' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button.Group>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => showTrainDetailsModal(record)}
          >
            Details
          </Button>
          <Button 
            icon={<ToolOutlined />}
            onClick={() => {
              Modal.info({
                title: `Maintenance Schedule - ${record.trainNumber}`,
                width: 700,
                content: (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ marginBottom: 16, padding: 12, background: '#f0f9ff', borderRadius: 8 }}>
                      <strong>Current Status:</strong> {record.status}
                    </div>
                    <Table
                      size="small"
                      dataSource={[
                        {
                          id: 1,
                          type: 'Scheduled',
                          description: 'Regular maintenance check',
                          date: record.nextMaintenance || '2024-02-15',
                          status: 'Pending',
                          cost: '₹15,000'
                        },
                        {
                          id: 2,
                          type: 'Completed',
                          description: 'Brake system inspection',
                          date: record.lastMaintenance || '2024-01-10',
                          status: 'Completed',
                          cost: '₹8,500'
                        }
                      ]}
                      columns={[
                        { title: 'Type', dataIndex: 'type', key: 'type' },
                        { title: 'Description', dataIndex: 'description', key: 'description' },
                        { title: 'Date', dataIndex: 'date', key: 'date' },
                        { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Completed' ? 'green' : 'orange'}>{status}</Tag> },
                        { title: 'Cost', dataIndex: 'cost', key: 'cost' }
                      ]}
                      pagination={false}
                    />
                  </div>
                )
              });
            }}
          >
            Maintenance
          </Button>
        </Button.Group>
      ),
    },
  ];

  const maintenanceColumns = [
    {
      title: 'Type',
      dataIndex: 'maintenance_type',
      key: 'maintenance_type',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduled_date',
      key: 'scheduled_date',
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : status === 'in_progress' ? 'blue' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost) => `₹${cost.toFixed(0)}`,
    },
  ];

  const sensorColumns = [
    {
      title: 'Sensor Type',
      dataIndex: 'sensor_type',
      key: 'sensor_type',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => `${value.toFixed(2)} ${record.unit}`,
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => moment(timestamp).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Status',
      dataIndex: 'is_anomaly',
      key: 'is_anomaly',
      render: (isAnomaly) => (
        <Tag color={isAnomaly ? 'red' : 'green'}>
          {isAnomaly ? 'ANOMALY' : 'NORMAL'}
        </Tag>
      ),
    },
  ];

  if (loading && trains.length === 0) {
    return <LoadingSpinner size="large" tip="Loading trains..." />;
  }

  return (
    <div className="fade-in" style={{ padding: theme.spacing.md, minHeight: '100vh', background: theme.colors.neutral[50] }}>
      <Row gutter={[theme.spacing.sm, theme.spacing.sm]} style={{ marginBottom: theme.spacing.md }}>
        <Col span={24}>
          <Card style={{ borderRadius: theme.borderRadius.lg, boxShadow: theme.shadows.md }}>
            <Row justify="space-between" align="middle">
              <Col>
                <h2 style={{ ...theme.typography.h2, color: theme.colors.neutral[800], margin: 0 }}>{t('trainManagement')}</h2>
                <p style={{ ...theme.typography.body, color: theme.colors.neutral[500], margin: '4px 0 0 0' }}>Manage and monitor your train fleet</p>
              </Col>
              <Col>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setModalVisible(true)}
                  style={{
                    background: theme.colors.primary,
                    borderColor: theme.colors.primary,
                    borderRadius: theme.borderRadius.md,
                    height: '40px'
                  }}
                >
                  {t('addNewTrain')}
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: theme.borderRadius.lg, boxShadow: theme.shadows.md }}>
        {trains.length === 0 && !loading ? (
          <EmptyState 
            title="No Trains Found"
            description="Start by adding your first train to the fleet management system."
            actionText="Add New Train"
            onAction={() => setModalVisible(true)}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={trains}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} trains`
            }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>

      {/* Add Train Modal */}
      <Modal
        title={<span style={{ ...theme.typography.h3, color: theme.colors.neutral[800] }}>Add New Train</span>}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        style={{ borderRadius: theme.borderRadius.lg }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateTrain}
        >
          <Form.Item
            name="train_number"
            label="Train Number"
            rules={[{ required: true, message: 'Please enter train number' }]}
          >
            <Input placeholder="e.g., KMRL-001" />
          </Form.Item>

          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: 'Please select model' }]}
          >
            <Select placeholder="Select train model">
              <Option value="Metro-A1">Metro-A1</Option>
              <Option value="Metro-B2">Metro-B2</Option>
              <Option value="Metro-C3">Metro-C3</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="depot_id"
            label="Depot"
            rules={[{ required: true, message: 'Please select depot' }]}
          >
            <Select placeholder="Select depot">
              <Option value={1}>Aluva Depot</Option>
              <Option value={2}>Pettah Depot</Option>
              <Option value={3}>Kalamassery Depot</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="current_mileage"
            label="Current Mileage (km)"
            rules={[{ required: true, message: 'Please enter current mileage' }]}
          >
            <Input type="number" placeholder="0" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              style={{
                background: theme.colors.primary,
                borderColor: theme.colors.primary,
                borderRadius: theme.borderRadius.md,
                height: '40px'
              }}
            >
              Create Train
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Train Details Modal */}
      <Modal
        title={`Train Details - ${selectedTrain?.train_number}`}
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedTrain && (
          <div>
            <Card title="Basic Information" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <strong>Model:</strong> {selectedTrain.model}
                </Col>
                <Col span={8}>
                  <strong>Mileage:</strong> {selectedTrain.mileage?.toLocaleString() || 0} km
                </Col>
                <Col span={8}>
                  <strong>Status:</strong> 
                  <Tag color={getStatusColor(selectedTrain.status)} style={{ marginLeft: 8 }}>
                    {selectedTrain.status.toUpperCase()}
                  </Tag>
                </Col>
              </Row>
            </Card>

            <Card title="Maintenance History" style={{ marginBottom: 16 }}>
              <Table
                columns={maintenanceColumns}
                dataSource={maintenanceData}
                rowKey="id"
                size="small"
                pagination={false}
              />
            </Card>

            <Card title="Recent Sensor Data">
              <Table
                columns={sensorColumns}
                dataSource={sensorData}
                rowKey="id"
                size="small"
                pagination={false}
              />
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrainManagement;