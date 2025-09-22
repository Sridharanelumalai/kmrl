import React, { useState } from 'react';
import { Card, List, Badge, Button, Tag, Switch, Row, Col, Statistic, Alert } from 'antd';
import { BellOutlined, WarningOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { theme } from '../styles/theme';

const Alerts = () => {
  const [alertSettings, setAlertSettings] = useState({
    maintenance: true,
    anomalies: true,
    capacity: true,
    performance: false
  });

  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Train KMRL-003 Temperature Anomaly',
      description: 'Engine temperature exceeded 95°C threshold',
      timestamp: '2024-02-10 14:30',
      status: 'active',
      trainId: 'KMRL-003'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Maintenance Due - KMRL-001',
      description: 'Scheduled maintenance due in 2 days',
      timestamp: '2024-02-10 09:15',
      status: 'active',
      trainId: 'KMRL-001'
    },
    {
      id: 3,
      type: 'info',
      title: 'Depot Capacity Alert',
      description: 'Aluva depot approaching 90% capacity',
      timestamp: '2024-02-10 08:00',
      status: 'acknowledged',
      trainId: null
    },
    {
      id: 4,
      type: 'success',
      title: 'Maintenance Completed',
      description: 'KMRL-007 preventive maintenance completed successfully',
      timestamp: '2024-02-09 16:45',
      status: 'resolved',
      trainId: 'KMRL-007'
    }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return <WarningOutlined style={{ color: '#f5222d' }} />;
      case 'warning': return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'info': return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      case 'success': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default: return <BellOutlined />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'red';
      case 'warning': return 'orange';
      case 'info': return 'blue';
      case 'success': return 'green';
      default: return 'default';
    }
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active').length;
  const criticalAlerts = alerts.filter(alert => alert.type === 'critical' && alert.status === 'active').length;

  return (
    <div style={{ padding: theme.spacing.lg, background: theme.colors.neutral[50], minHeight: '100vh' }}>
      <div style={{ marginBottom: theme.spacing.lg }}>
        <h2 style={{ margin: 0, color: theme.colors.neutral[800] }}>Alerts & Notifications</h2>
        <p style={{ color: theme.colors.neutral[600], margin: '4px 0 0 0' }}>Monitor system alerts and configure notifications</p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: theme.spacing.lg }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Active Alerts" 
              value={activeAlerts} 
              prefix={<BellOutlined />}
              valueStyle={{ color: '#faad14' }} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Critical Alerts" 
              value={criticalAlerts} 
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#f5222d' }} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Resolved Today" 
              value={8} 
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Response Time" 
              value={12} 
              suffix="min"
              valueStyle={{ color: '#1890ff' }} 
            />
          </Card>
        </Col>
      </Row>

      {criticalAlerts > 0 && (
        <Alert
          message="Critical Alerts Detected"
          description={`${criticalAlerts} critical alert(s) require immediate attention`}
          type="error"
          showIcon
          style={{ marginBottom: theme.spacing.md }}
        />
      )}

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="Recent Alerts">
            <List
              itemLayout="horizontal"
              dataSource={alerts}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button size="small" type="link">View</Button>,
                    item.status === 'active' && <Button size="small" type="link">Acknowledge</Button>
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={<Badge dot={item.status === 'active'}>{getAlertIcon(item.type)}</Badge>}
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {item.title}
                        <Tag color={getAlertColor(item.type)}>{item.type}</Tag>
                        {item.trainId && <Tag>{item.trainId}</Tag>}
                      </div>
                    }
                    description={
                      <div>
                        <div>{item.description}</div>
                        <small style={{ color: theme.colors.neutral[500] }}>{item.timestamp}</small>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Alert Settings">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Maintenance Alerts</span>
                <Switch 
                  checked={alertSettings.maintenance}
                  onChange={(checked) => setAlertSettings({...alertSettings, maintenance: checked})}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Sensor Anomalies</span>
                <Switch 
                  checked={alertSettings.anomalies}
                  onChange={(checked) => setAlertSettings({...alertSettings, anomalies: checked})}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Capacity Warnings</span>
                <Switch 
                  checked={alertSettings.capacity}
                  onChange={(checked) => setAlertSettings({...alertSettings, capacity: checked})}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Performance Alerts</span>
                <Switch 
                  checked={alertSettings.performance}
                  onChange={(checked) => setAlertSettings({...alertSettings, performance: checked})}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Alerts;