import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Progress, Badge, Tag, Table } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { theme } from '../styles/theme';

const SensorMonitoring = ({ trainId }) => {
  const [sensorData, setSensorData] = useState([]);
  const [realTimeData, setRealTimeData] = useState({
    temperature: 78.5,
    vibration: 2.3,
    pressure: 8.2,
    doors: 'Normal'
  });

  useEffect(() => {
    // Simulate real-time sensor data updates
    const interval = setInterval(() => {
      const newData = {
        timestamp: new Date().toLocaleTimeString(),
        temperature: 75 + Math.random() * 20,
        vibration: 1 + Math.random() * 4,
        pressure: 7 + Math.random() * 3,
        doors: Math.random() > 0.9 ? 'Warning' : 'Normal'
      };
      
      setSensorData(prev => [...prev.slice(-19), newData]);
      setRealTimeData(newData);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getSensorStatus = (value, type) => {
    switch (type) {
      case 'temperature':
        if (value > 90) return { status: 'error', color: 'red' };
        if (value > 80) return { status: 'warning', color: 'orange' };
        return { status: 'success', color: 'green' };
      case 'vibration':
        if (value > 4) return { status: 'error', color: 'red' };
        if (value > 3) return { status: 'warning', color: 'orange' };
        return { status: 'success', color: 'green' };
      case 'pressure':
        if (value < 6 || value > 10) return { status: 'error', color: 'red' };
        if (value < 7 || value > 9) return { status: 'warning', color: 'orange' };
        return { status: 'success', color: 'green' };
      default:
        return { status: 'success', color: 'green' };
    }
  };

  return (
    <div style={{ padding: theme.spacing.md }}>
      <h3 style={{ marginBottom: theme.spacing.md }}>Real-time Sensor Monitoring</h3>
      
      <Row gutter={[16, 16]} style={{ marginBottom: theme.spacing.lg }}>
        <Col span={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Badge status={getSensorStatus(realTimeData.temperature, 'temperature').status} />
              <div style={{ fontSize: 24, fontWeight: 'bold', color: getSensorStatus(realTimeData.temperature, 'temperature').color }}>
                {realTimeData.temperature?.toFixed(1)}°C
              </div>
              <div style={{ fontSize: 12, color: theme.colors.neutral[600] }}>Temperature</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Badge status={getSensorStatus(realTimeData.vibration, 'vibration').status} />
              <div style={{ fontSize: 24, fontWeight: 'bold', color: getSensorStatus(realTimeData.vibration, 'vibration').color }}>
                {realTimeData.vibration?.toFixed(1)}
              </div>
              <div style={{ fontSize: 12, color: theme.colors.neutral[600] }}>Vibration (mm/s)</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Badge status={getSensorStatus(realTimeData.pressure, 'pressure').status} />
              <div style={{ fontSize: 24, fontWeight: 'bold', color: getSensorStatus(realTimeData.pressure, 'pressure').color }}>
                {realTimeData.pressure?.toFixed(1)}
              </div>
              <div style={{ fontSize: 12, color: theme.colors.neutral[600] }}>Brake Pressure (bar)</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Tag color={realTimeData.doors === 'Normal' ? 'green' : 'orange'}>
                {realTimeData.doors}
              </Tag>
              <div style={{ fontSize: 12, color: theme.colors.neutral[600], marginTop: 8 }}>Door System</div>
            </div>
          </Card>
        </Col>
      </Row>

      {sensorData.length > 0 && (
        <Card title="Sensor Trends" size="small">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#ff7300" strokeWidth={2} />
              <Line type="monotone" dataKey="vibration" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="pressure" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};

export default SensorMonitoring;