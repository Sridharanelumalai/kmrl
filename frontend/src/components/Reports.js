import React, { useState } from 'react';
import { Card, Button, Table, Select, DatePicker, Row, Col, Tag, Modal, Form } from 'antd';
import { DownloadOutlined, FileTextOutlined, BarChartOutlined, CalendarOutlined } from '@ant-design/icons';
import { theme } from '../styles/theme';

const { RangePicker } = DatePicker;

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('fleet-performance');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const reportTypes = [
    { value: 'fleet-performance', label: 'Fleet Performance Report' },
    { value: 'maintenance-summary', label: 'Maintenance Summary' },
    { value: 'cost-analysis', label: 'Cost Analysis Report' },
    { value: 'utilization', label: 'Depot Utilization Report' },
    { value: 'compliance', label: 'Safety Compliance Report' }
  ];

  const recentReports = [
    {
      key: '1',
      name: 'Monthly Fleet Performance - January 2024',
      type: 'Fleet Performance',
      generatedDate: '2024-02-01',
      status: 'Completed',
      size: '2.3 MB',
      format: 'PDF'
    },
    {
      key: '2',
      name: 'Maintenance Cost Analysis Q4 2023',
      type: 'Cost Analysis',
      generatedDate: '2024-01-15',
      status: 'Completed',
      size: '1.8 MB',
      format: 'Excel'
    },
    {
      key: '3',
      name: 'Safety Compliance Report - December 2023',
      type: 'Compliance',
      generatedDate: '2024-01-05',
      status: 'Completed',
      size: '3.1 MB',
      format: 'PDF'
    }
  ];

  const columns = [
    {
      title: 'Report Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileTextOutlined />
          {text}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Generated Date',
      dataIndex: 'generatedDate',
      key: 'generatedDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Completed' ? 'green' : 'processing'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      render: (format) => <Tag>{format}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <div>
          <Button size="small" type="link" icon={<DownloadOutlined />}>
            Download
          </Button>
          <Button size="small" type="link">
            View
          </Button>
        </div>
      ),
    },
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setIsModalVisible(false);
    }, 3000);
  };

  const reportTemplates = [
    {
      title: 'Fleet Performance Dashboard',
      description: 'Comprehensive overview of fleet efficiency, availability, and performance metrics',
      icon: <BarChartOutlined style={{ fontSize: 24, color: '#1890ff' }} />
    },
    {
      title: 'Maintenance Analytics',
      description: 'Detailed analysis of maintenance costs, schedules, and predictive insights',
      icon: <CalendarOutlined style={{ fontSize: 24, color: '#52c41a' }} />
    },
    {
      title: 'Operational Efficiency',
      description: 'Route optimization, energy consumption, and operational cost analysis',
      icon: <FileTextOutlined style={{ fontSize: 24, color: '#faad14' }} />
    }
  ];

  return (
    <div style={{ padding: theme.spacing.lg, background: theme.colors.neutral[50], minHeight: '100vh' }}>
      <div style={{ marginBottom: theme.spacing.lg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: theme.colors.neutral[800] }}>Reports & Analytics</h2>
          <p style={{ color: theme.colors.neutral[600], margin: '4px 0 0 0' }}>Generate and manage system reports</p>
        </div>
        <Button type="primary" icon={<FileTextOutlined />} onClick={() => setIsModalVisible(true)}>
          Generate Report
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: theme.spacing.lg }}>
        {reportTemplates.map((template, index) => (
          <Col span={8} key={index}>
            <Card 
              hoverable
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => setIsModalVisible(true)}
            >
              <div style={{ marginBottom: 16 }}>{template.icon}</div>
              <h4 style={{ margin: '8px 0' }}>{template.title}</h4>
              <p style={{ color: theme.colors.neutral[600], fontSize: 12 }}>
                {template.description}
              </p>
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Recent Reports">
        <Table 
          columns={columns} 
          dataSource={recentReports} 
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Generate New Report"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical" onFinish={handleGenerateReport}>
          <Form.Item label="Report Type" required>
            <Select 
              value={selectedReport}
              onChange={setSelectedReport}
              style={{ width: '100%' }}
            >
              {reportTypes.map(type => (
                <Select.Option key={type.value} value={type.value}>
                  {type.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label="Date Range" required>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item label="Output Format" required>
            <Select defaultValue="pdf" style={{ width: '100%' }}>
              <Select.Option value="pdf">PDF</Select.Option>
              <Select.Option value="excel">Excel</Select.Option>
              <Select.Option value="csv">CSV</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="Include Sections">
            <Select mode="multiple" defaultValue={['summary', 'charts']} style={{ width: '100%' }}>
              <Select.Option value="summary">Executive Summary</Select.Option>
              <Select.Option value="charts">Charts & Graphs</Select.Option>
              <Select.Option value="details">Detailed Data</Select.Option>
              <Select.Option value="recommendations">Recommendations</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isGenerating}
              style={{ marginRight: 8 }}
            >
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
            <Button onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Reports;