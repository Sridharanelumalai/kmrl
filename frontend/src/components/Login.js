import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Login = ({ onLogin }) => {
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
    
    // Validate password for new users
    if (userType === 'new') {
      if (password.length < 6) {
        message.error('Password must be at least 6 characters long');
        return;
      }
      
      if (!/[A-Z]/.test(password)) {
        message.error('Password must contain at least one uppercase letter');
        return;
      }
      
      if (!/[a-z]/.test(password)) {
        message.error('Password must contain at least one lowercase letter');
        return;
      }
      
      if (!/[0-9]/.test(password)) {
        message.error('Password must contain at least one number');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const endpoint = userType === 'existing' ? '/api/auth/login' : '/api/auth/register';
      const payload = userType === 'existing' ? 
        { email, password } : 
        { email, name, password };
      
      const response = await fetch(`http://localhost:8085${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('kmrl_auth', 'true');
        localStorage.setItem('kmrl_user_email', email);
        message.success(userType === 'existing' ? 'Login successful!' : 'Registration successful!');
        onLogin(true);
      } else {
        message.error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      message.error('Authentication failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
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
              fontSize: '80px', 
              marginBottom: '2rem',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }}>🚊</div>
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
                  (userType === 'new' ? 'Create Account' : 'Welcome Back') : 
                  'KMRL Login'
                }
              </h2>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9rem'
              }}>
                {showForm ? 
                  (userType === 'new' ? 'Complete your registration' : 'Sign in to your account') : 
                  'Choose your login type'
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
                    🔐 Existing User Login
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
                    📝 New User Registration
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
                  {userType === 'new' ? '📝 New User Registration' : '🔐 Existing User Login'}
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