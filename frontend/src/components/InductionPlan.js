import React, { useState, useEffect } from 'react';
import { Card, Button, List, Tag, Modal, Select, Input, message, Row, Col, Statistic, Table, Alert } from 'antd';
import { PlayCircleOutlined, ExperimentOutlined, HistoryOutlined, ApiOutlined } from '@ant-design/icons';
import { inductionService } from '../services/api';
import { theme } from '../styles/theme';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import moment from 'moment';

const { Option } = Select;

const InductionPlan = () => {
  const [inductionPlan, setInductionPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [simulationVisible, setSimulationVisible] = useState(false);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [scenarioType, setScenarioType] = useState('train_breakdown');
  const [trainId, setTrainId] = useState(null);
  const [replacementTrainId, setReplacementTrainId] = useState(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [backendConnected, setBackendConnected] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const generatePlan = async () => {
    try {
      setLoading(true);
      setUsingMockData(false);
      
      console.log('Frontend: Starting plan generation...');
      const response = await inductionService.getInductionPlan();
      console.log('Frontend: Received response:', response);
      
      const data = response.data.data || response.data;
      console.log('Frontend: Extracted data:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        setInductionPlan(data);
        message.success('Backend induction plan generated successfully!');
        console.log('Frontend: Plan set successfully');
      } else {
        throw new Error('Invalid data format from backend');
      }
    } catch (error) {
      console.error('Frontend: Plan generation error:', error);
      setUsingMockData(true);
      
      // Fallback mock data
      const mockPlan = [
        {
          train_id: 1,
          train_number: 'KMRL-001',
          priority_score: 85.5,
          scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          depot_id: 1,
          reasoning: 'High priority due to maintenance requirements; Approaching mileage limit (45000 km)'
        },
        {
          train_id: 2,
          train_number: 'KMRL-002',
          priority_score: 72.3,
          scheduled_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          depot_id: 2,
          reasoning: 'Sensor anomalies detected; Scheduled at Pettah depot'
        },
        {
          train_id: 3,
          train_number: 'KMRL-003',
          priority_score: 58.1,
          scheduled_date: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
          depot_id: 1,
          reasoning: 'Regular maintenance due; Scheduled at Aluva depot'
        }
      ];
      setInductionPlan(mockPlan);
      message.warning('Backend unavailable - Using demo data');
      console.log('Frontend: Using fallback data');
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    try {
      setSimulationLoading(true);
      const scenarioData = {
        scenario_type: scenarioType,
        train_id: trainId,
        replacement_train_id: replacementTrainId,
        parameters: {}
      };
      
      const response = await inductionService.simulateScenario(scenarioData);
      const result = response.data.data || response.data;
      
      if (result) {
        setSimulationResult(result);
        message.success('Simulation completed successfully!');
      } else {
        throw new Error('Invalid simulation response');
      }
    } catch (error) {
      console.error('Simulation error:', error);
      
      // Fallback mock simulation
      const mockResult = {
        scenario_type: scenarioType,
        base_metrics: {
          total_trains: 20,
          available_trains: 16,
          scheduled_trains: 4
        },
        simulation_metrics: {
          total_trains: scenarioType === 'train_replacement' ? 20 : 19,
          available_trains: scenarioType === 'train_replacement' ? 15 : 15,
          scheduled_trains: scenarioType === 'train_replacement' ? 5 : 4
        },
        impact: {
          service_disruption: scenarioType === 'train_replacement' ? 'Minimal' : 'Moderate',
          replacement_found: scenarioType === 'train_replacement' ? true : false,
          estimated_delay: scenarioType === 'train_replacement' ? '15 minutes' : '45 minutes'
        },
        replacement_details: scenarioType === 'train_replacement' ? {
          original_train: `KMRL-${trainId?.toString().padStart(3, '0')}`,
          replacement_train: `KMRL-${replacementTrainId?.toString().padStart(3, '0')}`,
          depot_transfer_time: '30 minutes',
          service_resumption: 'Next scheduled departure'
        } : null
      };
      
      setSimulationResult(mockResult);
      message.warning('Backend unavailable - Using demo results');
    } finally {
      setSimulationLoading(false);
    }
  };

  const checkBackendConnection = async () => {
    try {
      const response = await inductionService.testConnection();
      setBackendConnected(response.data.connected);
    } catch (error) {
      setBackendConnected(false);
    }
  };

  useEffect(() => {
    checkBackendConnection();
    generatePlan();
  }, []);

  const getPriorityColor = (score) => {
    if (score >= 70) return 'red';
    if (score >= 40) return 'orange';
    return 'green';
  };

  const getPriorityText = (score) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  if (loading && inductionPlan.length === 0) {
    return <LoadingSpinner size="large" tip="Generating induction plan..." />;
  }

  return (
    <div className="fade-in" style={{ padding: theme.spacing.md, minHeight: '100vh', background: theme.colors.neutral[50] }}>
      {(backendConnected === false || usingMockData) && (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Alert
              message={backendConnected === false ? "Backend Disconnected" : "Using Demo Data"}
              description={backendConnected === false 
                ? "Unable to connect to backend API. Using fallback mock data for demonstration."
                : "Currently using demo data. Backend API will be used when service is available."}
              type="warning"
              showIcon
              icon={<ApiOutlined />}
              action={
                <Button size="small" onClick={checkBackendConnection}>
                  Retry Connection
                </Button>
              }
              style={{ borderRadius: theme.borderRadius.md }}
            />
          </Col>
        </Row>
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card style={{ 
            background: theme.colors.primary,
            border: 'none',
            borderRadius: theme.borderRadius.xl,
            boxShadow: theme.shadows.lg,
            overflow: 'hidden',
            position: 'relative'
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
              top: '-50%',
              right: '-20%',
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              animation: 'pulse 3s ease-in-out infinite'
            }}></div>
            <Row justify="space-between" align="middle">
              <Col>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    fontSize: '36px',
                    background: 'rgba(255,255,255,0.2)',
                    padding: '12px',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}>🚊</div>
                  <div>
                    <h2 style={{ color: 'white', margin: 0, ...theme.typography.h1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Train Induction Planning</h2>
                    <div style={{ color: 'rgba(255,255,255,0.9)', ...theme.typography.body, marginTop: '4px' }}>
                      AI-Powered Scheduling & Optimization System
                      {backendConnected === true && (
                        <Tag color="green" style={{ marginLeft: 8, fontSize: '10px' }}>
                          Backend Connected
                        </Tag>
                      )}
                      {backendConnected === false && (
                        <Tag color="orange" style={{ marginLeft: 8, fontSize: '10px' }}>
                          Demo Mode
                        </Tag>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
              <Col>
                <Button.Group style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  <Button 
                    type="primary" 
                    icon={<PlayCircleOutlined />}
                    onClick={generatePlan}
                    loading={loading}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    Generate New Plan
                  </Button>
                  <Button 
                    icon={<ExperimentOutlined />}
                    onClick={() => setSimulationVisible(true)}
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    What-If Simulation
                  </Button>

                  <Button 
                    icon={<HistoryOutlined />}
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      backdropFilter: 'blur(10px)'
                    }}
                    onClick={async () => {
                      try {
                        const response = await inductionService.getHistory();
                        const data = response.data.data || response.data;
                        setHistoryData(data);
                        setHistoryVisible(true);
                      } catch (error) {
                        console.error('History fetch error:', error);
                        // Fallback to mock data
                        const mockHistory = [
                          {
                            id: 1,
                            date: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
                            trains_scheduled: 5,
                            high_priority: 2,
                            avg_score: 67.8,
                            generated_by: 'System Auto',
                            status: 'Completed'
                          }
                        ];
                        setHistoryData(mockHistory);
                        setHistoryVisible(true);
                        message.warning('Backend not available - Using demo data');
                      }
                    }}
                  >
                    View History
                  </Button>
                </Button.Group>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {inductionPlan.length > 0 && (
        <Row gutter={[theme.spacing.sm, theme.spacing.sm]} style={{ marginBottom: theme.spacing.md }}>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: theme.borderRadius.lg, boxShadow: theme.shadows.sm }}>
              <Statistic
                title="Total Trains Scheduled"
                value={inductionPlan.length}
                valueStyle={{ color: theme.colors.info, ...theme.typography.h2 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: theme.borderRadius.lg, boxShadow: theme.shadows.sm }}>
              <Statistic
                title="High Priority Trains"
                value={inductionPlan.filter(p => p.priority_score >= 70).length}
                valueStyle={{ color: theme.colors.error, ...theme.typography.h2 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: theme.borderRadius.lg, boxShadow: theme.shadows.sm }}>
              <Statistic
                title="Average Priority Score"
                value={inductionPlan.reduce((sum, p) => sum + p.priority_score, 0) / inductionPlan.length}
                precision={1}
                valueStyle={{ color: theme.colors.success, ...theme.typography.h2 }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card 
        title={<span style={{ ...theme.typography.h3, color: theme.colors.neutral[800] }}>Ranked Induction List</span>}
        loading={loading}
        style={{ borderRadius: theme.borderRadius.lg, boxShadow: theme.shadows.md }}
      >
        {inductionPlan.length === 0 ? (
          <EmptyState 
            title="No Induction Plan Generated"
            description="Click 'Generate New Plan' to create an AI-optimized train induction schedule."
            actionText="Generate Plan"
            onAction={generatePlan}
          />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={inductionPlan}
            renderItem={(item, index) => (
              <List.Item
                key={item.train_id}
                className={`induction-plan-item priority-${getPriorityText(item.priority_score).toLowerCase()}`}
                style={{
                  borderRadius: theme.borderRadius.md,
                  marginBottom: theme.spacing.sm,
                  padding: theme.spacing.sm,
                  background: 'white',
                  boxShadow: theme.shadows.sm
                }}
              >
              <Row justify="space-between" align="top">
                <Col flex="auto">
                  <div style={{ marginBottom: 8 }}>
                    <Tag color="blue">#{index + 1}</Tag>
                    <strong style={{ fontSize: 16 }}>Train {item.train_number}</strong>
                    <Tag 
                      color={getPriorityColor(item.priority_score)}
                      style={{ marginLeft: 8 }}
                    >
                      {getPriorityText(item.priority_score)} Priority
                    </Tag>
                  </div>
                  
                  <div style={{ marginBottom: 8 }}>
                    <strong>Scheduled:</strong> {moment(item.scheduled_date).format('YYYY-MM-DD HH:mm')}
                  </div>
                  
                  <div style={{ marginBottom: 8 }}>
                    <strong>Reasoning:</strong> {item.reasoning}
                  </div>
                </Col>
                
                <Col>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: getPriorityColor(item.priority_score) }}>
                      {item.priority_score.toFixed(1)}
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>Priority Score</div>
                  </div>
                </Col>
              </Row>
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* What-If Simulation Modal */}
      <Modal
        title="What-If Simulation"
        visible={simulationVisible}
        onCancel={() => setSimulationVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setSimulationVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="run" 
            type="primary" 
            loading={simulationLoading}
            onClick={runSimulation}
          >
            Run Simulation
          </Button>
        ]}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <label>Scenario Type:</label>
          <Select
            style={{ width: '100%', marginTop: 8 }}
            value={scenarioType}
            onChange={(value) => {
              setScenarioType(value);
              setTrainId(null);
              setReplacementTrainId(null);
              setSimulationResult(null);
            }}
          >
            <Option value="train_replacement">Train Replacement (Emergency)</Option>
            <Option value="branding_priority">Branding Priority</Option>
            <Option value="mileage_balancing">Mileage Balancing</Option>
            <Option value="shunting_cost">Shunting Cost</Option>
          </Select>
        </div>

        {scenarioType === 'train_replacement' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label>Scheduled Train ID (to be replaced):</label>
              <Input
                style={{ marginTop: 8 }}
                placeholder="Enter scheduled train ID"
                type="number"
                value={trainId}
                onChange={(e) => setTrainId(parseInt(e.target.value))}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label>Replacement Train ID (available train):</label>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                placeholder="Select available replacement train"
                value={replacementTrainId}
                onChange={setReplacementTrainId}
              >
                <Option value={5}>KMRL-005 (Available at Aluva Depot)</Option>
                <Option value={8}>KMRL-008 (Available at Pettah Depot)</Option>
                <Option value={12}>KMRL-012 (Available at Kalamassery Depot)</Option>
                <Option value={15}>KMRL-015 (Available at Aluva Depot)</Option>
                <Option value={18}>KMRL-018 (Available at Pettah Depot)</Option>
              </Select>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Only trains currently available for service are shown
              </div>
            </div>
          </>
        )}

        {scenarioType === 'branding_priority' && (
          <div style={{ marginBottom: 16 }}>
            <label>Branding Contract Priority:</label>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Select branding priority level"
              value={trainId}
              onChange={setTrainId}
            >
              <Option value={1}>High Priority - Premium Brands (Coca-Cola, Samsung)</Option>
              <Option value={2}>Medium Priority - Regional Brands (Kerala Tourism)</Option>
              <Option value={3}>Low Priority - Local Advertisers</Option>
            </Select>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Simulate scheduling based on branding contract value and visibility
            </div>
          </div>
        )}

        {scenarioType === 'mileage_balancing' && (
          <div style={{ marginBottom: 16 }}>
            <label>Mileage Balancing Strategy:</label>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Select mileage balancing approach"
              value={trainId}
              onChange={setTrainId}
            >
              <Option value={1}>Equalize High Mileage Trains (over 40,000 km)</Option>
              <Option value={2}>Rotate Low Usage Trains (under 20,000 km)</Option>
              <Option value={3}>Optimize Fleet-wide Mileage Distribution</Option>
            </Select>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Balance train usage to extend fleet lifespan and reduce maintenance costs
            </div>
          </div>
        )}

        {scenarioType === 'shunting_cost' && (
          <div style={{ marginBottom: 16 }}>
            <label>Shunting Cost Optimization:</label>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Select cost optimization strategy"
              value={trainId}
              onChange={setTrainId}
            >
              <Option value={1}>Minimize Cross-Depot Movements</Option>
              <Option value={2}>Reduce Empty Train Runs</Option>
              <Option value={3}>Optimize Depot-to-Service Routes</Option>
            </Select>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Reduce operational costs by optimizing train movement patterns
            </div>
          </div>
        )}

        {simulationResult && (
          <Card title="Simulation Results" style={{ marginTop: 16 }}>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Statistic
                  title="Total Fleet"
                  value={simulationResult.base_metrics.total_trains}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Available Trains"
                  value={simulationResult.simulation_metrics.available_trains}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Service Impact"
                  value={simulationResult.impact.service_disruption}
                  valueStyle={{ 
                    color: simulationResult.impact.service_disruption === 'Minimal' ? '#52c41a' : 
                           simulationResult.impact.service_disruption === 'Moderate' ? '#faad14' : '#ff4d4f'
                  }}
                />
              </Col>
            </Row>
            
            {simulationResult.replacement_details && (
              <div style={{ 
                padding: '16px', 
                background: '#f6ffed', 
                borderRadius: '8px', 
                border: '1px solid #d9f7be',
                marginBottom: '16px'
              }}>
                <h4 style={{ color: '#52c41a', marginBottom: '12px' }}>Replacement Plan</h4>
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Original Train:</strong> {simulationResult.replacement_details.original_train}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Replacement Train:</strong> {simulationResult.replacement_details.replacement_train}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Transfer Time:</strong> {simulationResult.replacement_details.depot_transfer_time}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Service Resumption:</strong> {simulationResult.replacement_details.service_resumption}
                    </div>
                  </Col>
                </Row>
              </div>
            )}
            
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ padding: '12px', background: '#fff2f0', borderRadius: '6px', border: '1px solid #ffccc7' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff4d4f', marginBottom: '4px' }}>Impact Analysis</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Estimated Delay: {simulationResult.impact.estimated_delay}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Replacement Available: {simulationResult.impact.replacement_found ? 'Yes' : 'No'}</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #bae7ff' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }}>Recommendation</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {simulationResult.scenario_type === 'train_replacement' 
                      ? 'Execute replacement plan immediately to minimize service disruption'
                      : 'Consider emergency replacement from available fleet'}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        )}
      </Modal>

      {/* History Modal */}
      <Modal
        title="Induction Plan History"
        visible={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        footer={[
          <Button key="close" onClick={() => setHistoryVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: '#666' }}>
            Historical record of all generated induction plans and their execution status
          </p>
        </div>
        
        <Table
          dataSource={historyData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          columns={[
            {
              title: 'Date & Time',
              dataIndex: 'date',
              key: 'date',
              render: (date) => (
                <div>
                  <div style={{ fontWeight: 'bold' }}>{moment(date).format('MMM DD, YYYY')}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{moment(date).format('HH:mm')}</div>
                </div>
              )
            },
            {
              title: 'Trains Scheduled',
              dataIndex: 'trains_scheduled',
              key: 'trains_scheduled',
              align: 'center',
              render: (count) => (
                <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
                  {count}
                </Tag>
              )
            },
            {
              title: 'High Priority',
              dataIndex: 'high_priority',
              key: 'high_priority',
              align: 'center',
              render: (count) => (
                <Tag color={count > 2 ? 'red' : count > 0 ? 'orange' : 'green'}>
                  {count}
                </Tag>
              )
            },
            {
              title: 'Avg Priority Score',
              dataIndex: 'avg_score',
              key: 'avg_score',
              align: 'center',
              render: (score) => (
                <div style={{ 
                  fontWeight: 'bold', 
                  color: score >= 70 ? '#ff4d4f' : score >= 40 ? '#faad14' : '#52c41a' 
                }}>
                  {score.toFixed(1)}
                </div>
              )
            },
            {
              title: 'Generated By',
              dataIndex: 'generated_by',
              key: 'generated_by',
              render: (user) => (
                <div style={{ fontSize: '12px' }}>
                  {user}
                </div>
              )
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Tag color={
                  status === 'Completed' ? 'green' : 
                  status === 'Partially Completed' ? 'orange' : 
                  status === 'Failed' ? 'red' : 'blue'
                }>
                  {status}
                </Tag>
              )
            }
          ]}
        />
        
        <div style={{ 
          marginTop: 16, 
          padding: 12, 
          background: '#f0f9ff', 
          borderRadius: 6, 
          border: '1px solid #bae7ff' 
        }}>
          <div style={{ fontSize: '12px', color: '#1890ff' }}>
            <strong>Note:</strong> Historical data shows past 30 days of induction planning activities. 
            Click on any row to view detailed plan information.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InductionPlan;