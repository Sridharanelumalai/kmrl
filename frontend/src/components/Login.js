import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { sendOTPEmail } from '../services/emailService';

const { Text } = Typography;

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [isRegistered, setIsRegistered] = useState(null);
  const [name, setName] = useState('');

  const sendOTP = async () => {
    if (!email || !email.includes('@gmail.com')) {
      message.error('Please enter a valid Gmail address');
      return;
    }
    
    setOtpLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOtpSent(true);
        setIsRegistered(data.isRegistered);
        message.success(`OTP sent to ${email}. Please check your Gmail inbox.`);
        
        setResendTimer(60);
        const countdown = setInterval(() => {
          setResendTimer(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        message.error(data.message || 'Failed to send OTP');
      }
      
    } catch (error) {
      console.error('OTP send error:', error);
      message.error('Failed to send OTP. Please check your connection.');
    } finally {
      setOtpLoading(false);
    }
  };

  const onFinish = async (values) => {
    if (!otpSent) {
      message.error('Please verify your email first');
      return;
    }
    
    setLoading(true);
    
    try {
      const endpoint = isRegistered ? '/api/auth/login' : '/api/auth/register';
      const payload = isRegistered ? 
        { email, otp } : 
        { email, name: values.name || name, otp };
      
      const response = await fetch(`http://localhost:8080${endpoint}`, {
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
        message.success(isRegistered ? 'Login successful!' : 'Registration successful!');
        onLogin(true);
      } else {
        message.error(data.message || 'Authentication failed');
        setOtp('');
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
                {otpSent ? 
                  (isRegistered === false ? 'Create Account' : 'Welcome Back') : 
                  'KMRL Login'
                }
              </h2>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9rem'
              }}>
                {otpSent ? 
                  (isRegistered === false ? 'Complete your registration' : 'Sign in to your account') : 
                  'Enter your Gmail to continue'
                }
              </p>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
              style={{ marginBottom: '1.5rem' }}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
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
                  disabled={otpSent}
                  onFocus={(e) => e.target.style.borderColor = '#1a7f72'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </Form.Item>

              {!otpSent ? (
                <Form.Item>
                  <Button 
                    type="primary" 
                    loading={otpLoading}
                    onClick={sendOTP}
                    style={{ 
                      width: '100%',
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
                    {otpLoading ? 'Sending OTP...' : 'Send OTP to Email'}
                  </Button>
                </Form.Item>
              ) : (
                <>
                  {/* Show name field only for new users */}
                  {isRegistered === false && (
                    <Form.Item
                      name="name"
                      rules={[{ required: true, message: 'Please enter your name!' }]}
                    >
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
                    </Form.Item>
                  )}
                  
                  <Form.Item
                    name="otp"
                    rules={[{ required: true, message: 'Please input the OTP!' }]}
                  >
                    <Input 
                      prefix={<LockOutlined style={{ color: '#1a7f72' }} />} 
                      placeholder="Enter 6-digit OTP"
                      style={{ 
                        borderRadius: '1rem',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        fontSize: '1rem',
                        letterSpacing: '2px',
                        transition: 'all 0.3s ease'
                      }}
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      onFocus={(e) => e.target.style.borderColor = '#1a7f72'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      style={{ 
                        width: '100%',
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
                      {loading ? 
                        (isRegistered === false ? 'Registering...' : 'Logging in...') : 
                        (isRegistered === false ? 'Register & Login' : 'Verify & Login')
                      }
                    </Button>
                  </Form.Item>
                  
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Button 
                          type="link" 
                          onClick={() => {
                            setOtpSent(false);
                            setOtp('');
                            setEmail('');
                            setResendTimer(0);
                          }}
                          style={{ fontSize: '0.8rem', width: '100%', color: '#1a7f72' }}
                        >
                          Change Email
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button 
                          type="link" 
                          onClick={sendOTP}
                          disabled={resendTimer > 0 || otpLoading}
                          loading={otpLoading}
                          style={{ fontSize: '0.8rem', width: '100%', color: resendTimer > 0 ? '#9ca3af' : '#1a7f72' }}
                        >
                          {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend OTP'}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </>
              )}
            </Form>
            
            {otpSent && (
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem',
                background: isRegistered === false ? '#fef3c7' : '#f0fdf4',
                borderRadius: '1rem',
                border: isRegistered === false ? '1px solid #fbbf24' : '1px solid #bbf7d0'
              }}>
                <Text style={{ 
                  color: isRegistered === false ? '#d97706' : '#16a34a', 
                  fontSize: '0.8rem', 
                  fontWeight: '500' 
                }}>
                  {isRegistered === false ? '📝 New User Registration' : '🔐 Existing User Login'}
                </Text>
                <br />
                <Text style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                  {isRegistered === false ? 
                    'Please enter your name and verify OTP to register' : 
                    'Enter OTP to login to your account'
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