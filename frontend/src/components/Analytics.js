import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Select, DatePicker, Progress } from 'antd';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { theme } from '../styles/theme';

const { RangePicker } = DatePicker;

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('efficiency');

  const performanceData = [
    { month: 'Jan', efficiency: 85, availability: 92, onTime: 88 },
    { month: 'Feb', efficiency: 88, availability: 94, onTime: 91 },
    { month: 'Mar', efficiency: 92, availability: 89, onTime: 85 },
    { month: 'Apr', efficiency: 87, availability: 96, onTime: 93 },
    { month: 'May', efficiency: 94, availability: 91, onTime: 89 },
    { month: 'Jun', efficiency: 89, availability: 93, onTime: 92 }
  ];

  const maintenanceData = [
    { type: 'Preventive', count: 45, cost: 2.3 },
    { type: 'Corrective', count: 12, cost: 1.8 },
    { type: 'Emergency', count: 3, cost: 0.9 },
    { type: 'Scheduled', count: 28, cost: 1.5 }
  ];

  const depotUtilization = [
    { name: 'Aluva', value: 75, color: '#8884d8' },
    { name: 'Pettah', value: 82, color: '#82ca9d' },
    { name: 'Kalamassery', value: 68, color: '#ffc658' }
  ];

  return (
    <div style={{ padding: theme.spacing.lg, background: theme.colors.neutral[50], minHeight: '100vh' }}>
      <div style={{ marginBottom: theme.spacing.lg }}>
        <h2 style={{ margin: 0, color: theme.colors.neutral[800] }}>Fleet Analytics</h2>
        <p style={{ color: theme.colors.neutral[600], margin: '4px 0 0 0' }}>Performance insights and operational metrics</p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: theme.spacing.lg }}>
        <Col span={6}>
          <Card>
            <Statistic title="Fleet Efficiency" value={89.2} suffix="%" valueStyle={{ color: '#3f8600' }} />
            <Progress percent={89} strokeColor="#3f8600" showInfo={false} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="On-Time Performance" value={91.5} suffix="%" valueStyle={{ color: '#1890ff' }} />
            <Progress percent={92} strokeColor="#1890ff" showInfo={false} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Cost Savings" value={12.8} suffix="%" valueStyle={{ color: '#722ed1' }} />
            <Progress percent={13} strokeColor="#722ed1" showInfo={false} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Predictive Accuracy" value={94.3} suffix="%" valueStyle={{ color: '#eb2f96' }} />
            <Progress percent={94} strokeColor="#eb2f96" showInfo={false} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="Performance Trends" extra={
            <Select defaultValue="efficiency" onChange={setSelectedMetric} style={{ width: 120 }}>
              <Select.Option value="efficiency">Efficiency</Select.Option>
              <Select.Option value="availability">Availability</Select.Option>
              <Select.Option value="onTime">On-Time</Select.Option>
            </Select>
          }>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={selectedMetric} stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Depot Utilization">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={depotUtilization} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {depotUtilization.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Maintenance Analysis">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Count" />
                <Bar dataKey="cost" fill="#82ca9d" name="Cost (₹L)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;