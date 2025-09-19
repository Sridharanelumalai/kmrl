import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, message, Tag, Row, Col } from 'antd';
import { PlusOutlined, EyeOutlined, ToolOutlined } from '@ant-design/icons';
import { trainService } from '../services/api';
import moment from 'moment';

const { Option } = Select;

const TrainManagement = () => {
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
      message.success('Train created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchTrains();
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
      dataIndex: 'train_number',
      key: 'train_number',
      sorter: (a, b) => a.train_number.localeCompare(b.train_number),
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
            onClick={() => showTrainDetails(record)}
          >
            Details
          </Button>
          <Button icon={<ToolOutlined />}>
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

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Row justify="space-between" align="middle">
              <Col>
                <h2>Train Fleet Management</h2>
              </Col>
              <Col>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setModalVisible(true)}
                >
                  Add New Train
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={trains}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* Add Train Modal */}
      <Modal
        title="Add New Train"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
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
            <Button type="primary" htmlType="submit" block>
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