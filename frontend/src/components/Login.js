import React, { useState } from 'react';
import { Input, Button, Card, message, Typography, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from '../i18n/translations';
import LanguageSwitcher from './LanguageSwitcher';

const { Text } = Typography;

const Login = ({ onLogin }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(null); // 'new' or 'existing'
  const [showForm, setShowForm] = useState(false);

  const selectUserType = (type) => {
    setUserType(type);
    setShowForm(true);
  };
  
  // Initialize with detailed sample trains if none exist
  React.useEffect(() => {
    const trains = localStorage.getItem('kmrl_trains');
    if (!trains) {
      const sampleTrains = [
        { 
          id: 1, 
          trainNumber: 'KMRL-001', 
          model: 'Metro-A1', 
          status: 'Available', 
          mileage: 45000, 
          currentDepot: 'Aluva Depot',
          healthScore: 85,
          lastMaintenance: '2024-01-10',
          nextMaintenance: '2024-02-15',
          manufacturer: 'Alstom',
          yearOfManufacture: 2017,
          capacity: 1200,
          maxSpeed: 80,
          powerType: 'Electric',
          airConditioning: 'Yes',
          wifiEnabled: true,
          cctv: 8,
          emergencyBrakes: 'Functional',
          doorSystem: 'Automatic',
          totalServiceHours: 12500,
          fitnessCertificate: {
            certificateNumber: 'FC-001-2024',
            issuedDate: '2024-01-01',
            expiryDate: '2025-01-01',
            certifyingAuthority: 'Commissioner of Railway Safety (CRS)',
            status: 'Valid',
            lastInspectionDate: '2024-01-10',
            nextInspectionDue: '2024-07-10'
          },
          brandingContract: {
            companyName: 'Coca-Cola India',
            contractedHours: 3000,
            usedHours: 1250,
            contractStartDate: '2024-01-01',
            contractEndDate: '2024-12-31',
            brandingType: 'Full Wrap'
          }
        },
        { 
          id: 2, 
          trainNumber: 'KMRL-002', 
          model: 'Metro-B2', 
          status: 'Maintenance', 
          mileage: 32000, 
          currentDepot: 'Pettah Depot',
          healthScore: 72,
          lastMaintenance: '2024-01-05',
          nextMaintenance: '2024-01-25',
          manufacturer: 'BEML',
          yearOfManufacture: 2018,
          capacity: 1150,
          maxSpeed: 80,
          powerType: 'Electric',
          airConditioning: 'Yes',
          wifiEnabled: true,
          cctv: 6,
          emergencyBrakes: 'Under Maintenance',
          doorSystem: 'Automatic',
          totalServiceHours: 9800,
          fitnessCertificate: {
            certificateNumber: 'FC-002-2024',
            issuedDate: '2024-01-01',
            expiryDate: '2025-01-01',
            certifyingAuthority: 'Commissioner of Railway Safety (CRS)',
            status: 'Under Review',
            lastInspectionDate: '2024-01-05',
            nextInspectionDue: '2024-02-05'
          },
          brandingContract: {
            companyName: 'No Active Contract',
            contractedHours: 0,
            usedHours: 0,
            contractStartDate: 'N/A',
            contractEndDate: 'N/A',
            brandingType: 'None'
          }
        },
        { 
          id: 3, 
          trainNumber: 'KMRL-003', 
          model: 'Metro-A1', 
          status: 'Available', 
          mileage: 28000, 
          currentDepot: 'Kalamassery Depot',
          healthScore: 92,
          lastMaintenance: '2024-01-15',
          nextMaintenance: '2024-03-01',
          manufacturer: 'Alstom',
          yearOfManufacture: 2019,
          capacity: 1200,
          maxSpeed: 80,
          powerType: 'Electric',
          airConditioning: 'Yes',
          wifiEnabled: true,
          cctv: 8,
          emergencyBrakes: 'Functional',
          doorSystem: 'Automatic',
          totalServiceHours: 8200,
          fitnessCertificate: {
            certificateNumber: 'FC-003-2024',
            issuedDate: '2024-01-01',
            expiryDate: '2025-01-01',
            certifyingAuthority: 'Commissioner of Railway Safety (CRS)',
            status: 'Valid',
            lastInspectionDate: '2024-01-15',
            nextInspectionDue: '2024-07-15'
          },
          brandingContract: {
            companyName: 'Samsung Electronics',
            contractedHours: 2500,
            usedHours: 800,
            contractStartDate: '2024-01-01',
            contractEndDate: '2024-12-31',
            brandingType: 'Side Panels'
          }
        }
      ];
      localStorage.setItem('kmrl_trains', JSON.stringify(sampleTrains));
    }
  }, []);

  const handleAuth = async () => {
    if (!email || !email.includes('@gmail.com')) {
      message.error('Please enter a valid Gmail address');
      return;
    }
    
    if (userType === 'new' && !name) {
      message.error('Please enter your name');
      return;
    }
    
    if (!password) {
      message.error('Please enter your password');
      return;
    }
    
    setLoading(true);
    
    // Mock authentication with localStorage
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('kmrl_users') || '{}');
      
      if (userType === 'existing') {
        if (users[email] && users[email].password === password) {
          localStorage.setItem('kmrl_auth', 'true');
          localStorage.setItem('kmrl_user_email', email);
          message.success('Login successful!');
          onLogin(true);
        } else {
          message.error('Invalid email or password');
        }
      } else {
        if (users[email]) {
          message.error('User already exists. Please login.');
        } else {
          users[email] = { name, password };
          localStorage.setItem('kmrl_users', JSON.stringify(users));
          localStorage.setItem('kmrl_auth', 'true');
          localStorage.setItem('kmrl_user_email', email);
          message.success('Registration successful!');
          onLogin(true);
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#eaf9f5',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <Row style={{ minHeight: '100vh' }}>
        {/* Left Panel - Branding */}
        <Col xs={0} md={12} lg={14} style={{
          background: 'linear-gradient(135deg, #1a7f72 0%, #16a085 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '400px',
            height: '400px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}></div>
          <div style={{ textAlign: 'center', zIndex: 1, color: 'white' }}>
            <div style={{ 
              marginBottom: '2rem',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
            }}>
              <img 
                src="/metro-train.svg" 
                alt="KMRL Metro Train" 
                style={{
                  width: '90px',
                  height: '90px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <h1 style={{ 
              fontSize: '3rem',
              fontWeight: '700',
              marginBottom: '1rem',
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>KMRL Portal</h1>
            <p style={{ 
              fontSize: '1.2rem',
              opacity: 0.9,
              maxWidth: '400px',
              lineHeight: '1.6'
            }}>Kochi Metro Rail Limited<br/>Train Induction Management System</p>
            <div style={{
              marginTop: '3rem',
              padding: '1.5rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontSize: '0.9rem', margin: 0, opacity: 0.8 }}>
                Secure • Efficient • Modern
              </p>
            </div>
          </div>
        </Col>

        {/* Right Panel - Login Form */}
        <Col xs={24} md={12} lg={10} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <Card style={{
            width: '100%',
            maxWidth: '400px',
            borderRadius: '2rem',
            boxShadow: '0 20px 40px rgba(26, 127, 114, 0.1)',
            border: 'none',
            background: 'white'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <LanguageSwitcher />
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #1a7f72, #16a085)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: '0 8px 16px rgba(26, 127, 114, 0.3)'
              }}>
                <UserOutlined style={{ fontSize: '24px', color: 'white' }} />
              </div>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#1a7f72',
                marginBottom: '0.5rem'
              }}>
                {showForm ? 
                  (userType === 'new' ? 'Create Account' : t('welcome')) : 
                  t('loginTitle')
                }
              </h2>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9rem'
              }}>
                {showForm ? 
                  (userType === 'new' ? 'Complete your registration' : 'Sign in to your account') : 
                  t('enterCredentials')
                }
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              {!showForm ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Button 
                    type="primary" 
                    onClick={() => selectUserType('existing')}
                    style={{ 
                      width: '100%',
                      height: '3.5rem',
                      borderRadius: '1rem',
                      background: '#1a7f72',
                      border: 'none',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(26, 127, 114, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#166b5f'}
                    onMouseLeave={(e) => e.target.style.background = '#1a7f72'}
                  >
                    Existing User Login
                  </Button>
                  
                  <Button 
                    onClick={() => selectUserType('new')}
                    style={{ 
                      width: '100%',
                      height: '3.5rem',
                      borderRadius: '1rem',
                      background: 'white',
                      border: '2px solid #1a7f72',
                      color: '#1a7f72',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#1a7f72';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.color = '#1a7f72';
                    }}
                  >
                    New User Registration
                  </Button>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <Input 
                      prefix={<MailOutlined style={{ color: '#1a7f72' }} />} 
                      placeholder="Enter your email address"
                      style={{ 
                        borderRadius: '1rem',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={(e) => e.target.style.borderColor = '#1a7f72'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  {userType === 'new' && (
                    <div style={{ marginBottom: '1rem' }}>
                      <Input 
                        prefix={<UserOutlined style={{ color: '#1a7f72' }} />} 
                        placeholder="Enter your full name"
                        style={{ 
                          borderRadius: '1rem',
                          padding: '0.75rem 1rem',
                          border: '2px solid #e5e7eb',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease'
                        }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={(e) => e.target.style.borderColor = '#1a7f72'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <Input.Password 
                      prefix={<LockOutlined style={{ color: '#1a7f72' }} />} 
                      placeholder={userType === 'new' ? 'Create a strong password (6+ chars, A-z, 0-9)' : 'Enter your password'}
                      style={{ 
                        borderRadius: '1rem',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={(e) => e.target.style.borderColor = '#1a7f72'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button 
                      onClick={() => {
                        setShowForm(false);
                        setUserType(null);
                        setEmail('');
                        setName('');
                        setPassword('');
                      }}
                      style={{ 
                        height: '3rem',
                        borderRadius: '1rem',
                        border: '2px solid #e5e7eb',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}
                    >
                      Back
                    </Button>
                    
                    <Button 
                      type="primary" 
                      loading={loading}
                      onClick={handleAuth}
                      style={{ 
                        flex: 1,
                        height: '3rem',
                        borderRadius: '1rem',
                        background: '#1a7f72',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(26, 127, 114, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#166b5f'}
                      onMouseLeave={(e) => e.target.style.background = '#1a7f72'}
                    >
                      {loading ? (userType === 'existing' ? 'Logging in...' : 'Registering...') : (userType === 'existing' ? 'Login' : 'Register')}
                    </Button>
                  </div>
                </>
              )}
            </div>
            
            {showForm && (
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem',
                background: userType === 'new' ? '#fef3c7' : '#f0fdf4',
                borderRadius: '1rem',
                border: userType === 'new' ? '1px solid #fbbf24' : '1px solid #bbf7d0'
              }}>
                <Text style={{ 
                  color: userType === 'new' ? '#d97706' : '#16a34a', 
                  fontSize: '0.8rem', 
                  fontWeight: '500' 
                }}>
                  {userType === 'new' ? 'New User Registration' : 'Existing User Login'}
                </Text>
                <br />
                <Text style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                  {userType === 'new' ? 
                    'Password must be 6+ characters with uppercase, lowercase & number' : 
                    'Enter your email and password to login'
                  }
                </Text>
              </div>
            )}

            <div style={{
              textAlign: 'center',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>
                Need help? <button type="button" style={{ color: '#1a7f72', fontWeight: '500', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>Contact Help Desk</button>
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;