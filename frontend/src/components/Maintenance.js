import React, { useState } from 'react';
import { Card, Table, Button, Tag, Modal, Form, Input, DatePicker, Select, Row, Col, Statistic } from 'antd';
import { PlusOutlined, ToolOutlined, CalendarOutlined, AlertOutlined } from '@ant-design/icons';
import { theme } from '../styles/theme';

const Maintenance = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const maintenanceRecords = [
    {
      key: '1',
      trainId: 'KMRL-001',
      type: 'Preventive',
      status: 'Scheduled',
      scheduledDate: '2024-02-15',
      estimatedHours: 8,
      priority: 'High',
      technician: 'Ravi Kumar'
    },
    {
      key: '2',
      trainId: 'KMRL-003',
      type: 'Corrective',
      status: 'In Progress',
      scheduledDate: '2024-02-10',
      estimatedHours: 4,
      priority: 'Medium',
      technician: 'Suresh Nair'
    },
    {
      key: '3',
      trainId: 'KMRL-007',
      type: 'Emergency',
      status: 'Completed',
      scheduledDate: '2024-02-08',
      estimatedHours: 12,
      priority: 'Critical',
      technician: 'Anil Jose'
    }
  ];

  const columns = [
    {
      title: 'Train ID',
      dataIndex: 'trainId',
      key: 'trainId',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Emergency' ? 'red' : type === 'Corrective' ? 'orange' : 'blue'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Completed' ? 'green' : status === 'In Progress' ? 'processing' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
    },
    {
      title: 'Est. Hours',
      dataIndex: 'estimatedHours',
      key: 'estimatedHours',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={priority === 'Critical' ? 'red' : priority === 'High' ? 'orange' : 'default'}>
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Technician',
      dataIndex: 'technician',
      key: 'technician',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button size="small" type="link">View Details</Button>
      ),
    },
  ];

  const handleSubmit = (values) => {
    console.log('New maintenance record:', values);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: theme.spacing.lg, background: theme.colors.neutral[50], minHeight: '100vh' }}>
      <div style={{ marginBottom: theme.spacing.lg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: theme.colors.neutral[800] }}>Maintenance Management</h2>
          <p style={{ color: theme.colors.neutral[600], margin: '4px 0 0 0' }}>Schedule and track maintenance activities</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Schedule Maintenance
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: theme.spacing.lg }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Pending Tasks" 
              value={12} 
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#faad14' }} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="In Progress" 
              value={5} 
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Overdue" 
              value={2} 
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#f5222d' }} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Completed (Month)" 
              value={28} 
              valueStyle={{ color: '#52c41a' }} 
            />
          </Card>
        </Col>
      </Row>

      <Card title="Maintenance Records">
        <Table 
          columns={columns} 
          dataSource={maintenanceRecords} 
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Schedule New Maintenance"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="trainId" label="Train ID" rules={[{ required: true }]}>
            <Select placeholder="Select train">
              <Select.Option value="KMRL-001">KMRL-001</Select.Option>
              <Select.Option value="KMRL-002">KMRL-002</Select.Option>
              <Select.Option value="KMRL-003">KMRL-003</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Maintenance Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Select.Option value="Preventive">Preventive</Select.Option>
              <Select.Option value="Corrective">Corrective</Select.Option>
              <Select.Option value="Emergency">Emergency</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="scheduledDate" label="Scheduled Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select placeholder="Select priority">
              <Select.Option value="Low">Low</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="High">High</Select.Option>
              <Select.Option value="Critical">Critical</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Maintenance description..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Schedule
            </Button>
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Maintenance;