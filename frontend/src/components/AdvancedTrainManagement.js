import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Card, Row, Col, Tag, Space, Popconfirm, message, Upload, Drawer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined, DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import { theme } from '../styles/theme';
import apiService from '../services/api';
import SensorMonitoring from './SensorMonitoring';

const AdvancedTrainManagement = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    setLoading(true);
    try {
      const response = await apiService.getTrains();
      setTrains(response.data || []);
    } catch (error) {
      message.error('Failed to fetch trains');
      // Use mock data
      setTrains([
        {
          id: 1,
          trainNumber: 'KMRL-001',
          model: 'Metro-A1',
          status: 'Available',
          mileage: 45000,
          currentDepot: 'Aluva Depot',
          healthScore: 85,
          manufacturer: 'Alstom',
          yearOfManufacture: 2021
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setSelectedTrain(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedTrain(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteTrain(id);
      message.success('Train deleted successfully');
      fetchTrains();
    } catch (error) {
      message.error('Failed to delete train');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedTrain) {
        await apiService.updateTrain(selectedTrain.id, values);
        message.success('Train updated successfully');
      } else {
        await apiService.createTrain(values);
        message.success('Train created successfully');
      }
      setModalVisible(false);
      fetchTrains();
    } catch (error) {
      message.error('Failed to save train');
    }
  };

  const handleViewDetails = (record) => {
    setSelectedTrain(record);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: 'Train Number',
      dataIndex: 'trainNumber',
      key: 'trainNumber',
      sorter: (a, b) => a.trainNumber.localeCompare(b.trainNumber),
      render: (text) => <strong style={{ color: theme.colors.primary }}>{text}</strong>
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      filters: [
        { text: 'Metro-A1', value: 'Metro-A1' },
        { text: 'Metro-B2', value: 'Metro-B2' },
        { text: 'Metro-C3', value: 'Metro-C3' }
      ],
      onFilter: (value, record) => record.model === value
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Available', value: 'Available' },
        { text: 'In Service', value: 'In Service' },
        { text: 'Maintenance', value: 'Maintenance' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const color = status === 'Available' ? 'green' : 
                     status === 'In Service' ? 'blue' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Mileage',
      dataIndex: 'mileage',
      key: 'mileage',
      sorter: (a, b) => a.mileage - b.mileage,
      render: (mileage) => `${mileage?.toLocaleString()} km`
    },
    {
      title: 'Health Score',
      dataIndex: 'healthScore',
      key: 'healthScore',
      sorter: (a, b) => a.healthScore - b.healthScore,
      render: (score) => {
        const color = score >= 80 ? 'green' : score >= 60 ? 'orange' : 'red';
        return <Tag color={color}>{score}%</Tag>;
      }
    },
    {
      title: 'Current Depot',
      dataIndex: 'currentDepot',
      key: 'currentDepot',
      filters: [
        { text: 'Aluva Depot', value: 'Aluva Depot' },
        { text: 'Pettah Depot', value: 'Pettah Depot' },
        { text: 'Kalamassery Depot', value: 'Kalamassery Depot' }
      ],
      onFilter: (value, record) => record.currentDepot === value
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          <Button 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this train?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              size="small" 
              danger 
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: theme.spacing.lg }}>
      <Card>
        <div style={{ marginBottom: theme.spacing.lg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>Advanced Train Management</h2>
            <p style={{ color: theme.colors.neutral[600], margin: '4px 0 0 0' }}>
              Comprehensive train fleet management with real-time monitoring
            </p>
          </div>
          <Space>
            <Button icon={<FilterOutlined />}>
              Advanced Filters
            </Button>
            <Button icon={<DownloadOutlined />}>
              Export Data
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add New Train
            </Button>
          </Space>
        </div>

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
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={selectedTrain ? 'Edit Train' : 'Add New Train'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="trainNumber"
                label="Train Number"
                rules={[{ required: true, message: 'Please enter train number' }]}
              >
                <Input placeholder="KMRL-XXX" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="model"
                label="Model"
                rules={[{ required: true, message: 'Please select model' }]}
              >
                <Select placeholder="Select model">
                  <Select.Option value="Metro-A1">Metro-A1</Select.Option>
                  <Select.Option value="Metro-B2">Metro-B2</Select.Option>
                  <Select.Option value="Metro-C3">Metro-C3</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="manufacturer"
                label="Manufacturer"
                rules={[{ required: true, message: 'Please select manufacturer' }]}
              >
                <Select placeholder="Select manufacturer">
                  <Select.Option value="Alstom">Alstom</Select.Option>
                  <Select.Option value="BEML">BEML</Select.Option>
                  <Select.Option value="Siemens">Siemens</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="yearOfManufacture"
                label="Year of Manufacture"
                rules={[{ required: true, message: 'Please enter year' }]}
              >
                <Input type="number" placeholder="2021" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="Available">Available</Select.Option>
                  <Select.Option value="In Service">In Service</Select.Option>
                  <Select.Option value="Maintenance">Maintenance</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currentDepot"
                label="Current Depot"
                rules={[{ required: true, message: 'Please select depot' }]}
              >
                <Select placeholder="Select depot">
                  <Select.Option value="Aluva Depot">Aluva Depot</Select.Option>
                  <Select.Option value="Pettah Depot">Pettah Depot</Select.Option>
                  <Select.Option value="Kalamassery Depot">Kalamassery Depot</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="mileage"
                label="Current Mileage (km)"
                rules={[{ required: true, message: 'Please enter mileage' }]}
              >
                <Input type="number" placeholder="45000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="healthScore"
                label="Health Score (%)"
                rules={[{ required: true, message: 'Please enter health score' }]}
              >
                <Input type="number" min={0} max={100} placeholder="85" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {selectedTrain ? 'Update' : 'Create'} Train
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Train Details Drawer */}
      <Drawer
        title={`Train Details - ${selectedTrain?.trainNumber}`}
        placement="right"
        width={800}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedTrain && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Basic Information" size="small">
                  <Row gutter={16}>
                    <Col span={12}>
                      <p><strong>Train Number:</strong> {selectedTrain.trainNumber}</p>
                      <p><strong>Model:</strong> {selectedTrain.model}</p>
                      <p><strong>Manufacturer:</strong> {selectedTrain.manufacturer}</p>
                      <p><strong>Year:</strong> {selectedTrain.yearOfManufacture}</p>
                    </Col>
                    <Col span={12}>
                      <p><strong>Status:</strong> <Tag color={selectedTrain.status === 'Available' ? 'green' : 'orange'}>{selectedTrain.status}</Tag></p>
                      <p><strong>Current Depot:</strong> {selectedTrain.currentDepot}</p>
                      <p><strong>Mileage:</strong> {selectedTrain.mileage?.toLocaleString()} km</p>
                      <p><strong>Health Score:</strong> {selectedTrain.healthScore}%</p>
                    </Col>
                  </Row>
                </Card>
              </Col>
              
              <Col span={24}>
                <SensorMonitoring trainId={selectedTrain.id} />
              </Col>
            </Row>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AdvancedTrainManagement;