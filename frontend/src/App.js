import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import { DashboardOutlined, CarOutlined, ScheduleOutlined } from '@ant-design/icons';
import Dashboard from './components/Dashboard';
import InductionPlan from './components/InductionPlan';
import TrainManagement from './pages/TrainManagement';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    switch (location.pathname) {
      case '/dashboard':
        return '1';
      case '/induction':
        return '2';
      case '/trains':
        return '3';
      default:
        return '1';
    }
  };

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard')
    },
    {
      key: '2',
      icon: <ScheduleOutlined />,
      label: 'Induction Planning',
      onClick: () => navigate('/induction')
    },
    {
      key: '3',
      icon: <CarOutlined />,
      label: 'Train Management',
      onClick: () => navigate('/trains')
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="dark">
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            KMRL System
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Title level={3} style={{ margin: '16px 0' }}>
            AI-Driven Train Induction Planning & Scheduling
          </Title>
        </Header>
        
        <Content style={{ margin: 0, background: '#f0f2f5' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/induction" element={<InductionPlan />} />
            <Route path="/trains" element={<TrainManagement />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;