import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Typography, Button } from 'antd';
import { DashboardOutlined, CarOutlined, ScheduleOutlined, LogoutOutlined } from '@ant-design/icons';
import Dashboard from './components/Dashboard';
import InductionPlan from './components/InductionPlan';
import TrainManagement from './pages/TrainManagement';
import Login from './components/Login';

const { Header, Content } = Layout;
const { Title } = Typography;

function AppContent({ isAuthenticated, onLogin, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Login onLogin={onLogin} />;
  }

  const getSelectedKey = () => {
    switch (location.pathname) {
      case '/dashboard':
        return '1';
      case '/trains':
        return '2';
      case '/induction':
        return '3';
      default:
        return '1';
    }
  };

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined style={{ fontSize: '16px' }} />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard')
    },
    {
      key: '2',
      icon: <CarOutlined style={{ fontSize: '16px' }} />,
      label: 'Train Management',
      onClick: () => navigate('/trains')
    },
    {
      key: '3',
      icon: <ScheduleOutlined style={{ fontSize: '16px' }} />,
      label: 'Induction Planning',
      onClick: () => navigate('/induction')
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#1a7f72',
        padding: '0 32px',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '90px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <style>
          {`
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
          `}
        </style>
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-5%',
          width: '120px',
          height: '120px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'pulse 3s ease-in-out infinite'
        }}></div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '45px', 
            height: '45px', 
            background: 'rgba(255,255,255,0.2)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginRight: '32px',
            fontSize: '24px',
            color: 'white',
            borderRadius: '10px',
            backdropFilter: 'blur(10px)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>🚊</div>
          <div style={{ marginRight: '40px', marginTop: '8px' }}>
            <Title level={4} style={{ 
              color: 'white', 
              margin: 0,
              fontWeight: '700',
              fontSize: '20px',
              lineHeight: '1.2',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              KMRL System
            </Title>
            <div style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '12px', 
              fontWeight: '500',
              letterSpacing: '0.5px',
              marginTop: '2px'
            }}>
              Smart Metro Planning
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {menuItems.map((item) => {
              const isActive = getSelectedKey() === item.key;
              return (
                <div
                  key={item.key}
                  onClick={item.onClick}
                  style={{
                    padding: '8px 16px',
                    background: isActive 
                      ? 'rgba(255,255,255,0.9)' 
                      : 'rgba(255,255,255,0.15)',
                    color: isActive ? '#667eea' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    border: isActive ? '2px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.2)',
                    fontWeight: isActive ? '700' : '600',
                    fontSize: '13px',
                    minWidth: 'fit-content',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                      e.currentTarget.style.border = '2px solid rgba(255,255,255,0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                      e.currentTarget.style.border = '2px solid rgba(255,255,255,0.2)';
                    }
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <Button 
          icon={<LogoutOutlined />} 
          onClick={onLogout}
          style={{
            background: 'rgba(220, 38, 38, 0.8)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '8px 16px',
            height: 'auto',
            fontWeight: '600',
            fontSize: '13px',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(185, 28, 28, 0.9)';
            e.currentTarget.style.border = '2px solid rgba(255,255,255,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(220, 38, 38, 0.8)';
            e.currentTarget.style.border = '2px solid rgba(255,255,255,0.3)';
          }}
        >
          Logout
        </Button>
      </Header>
      
      <Content style={{ margin: 0, background: '#eaf9f5', minHeight: 'calc(100vh - 90px)' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/induction" element={<InductionPlan />} />
          <Route path="/trains" element={<TrainManagement />} />
        </Routes>
      </Content>
    </Layout>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('kmrl_auth');
    setIsAuthenticated(auth === 'true');
  }, []);

  // Temporary: Clear auth to show login page
  // localStorage.removeItem('kmrl_auth');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('kmrl_auth');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <AppContent 
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </Router>
  );
}

export default App;