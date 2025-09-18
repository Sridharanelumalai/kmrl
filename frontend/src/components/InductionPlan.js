import React, { useState, useEffect } from 'react';
import { Card, Button, List, Tag, Modal, Select, Input, message, Row, Col, Statistic } from 'antd';
import { PlayCircleOutlined, ExperimentOutlined, HistoryOutlined } from '@ant-design/icons';
import { inductionService } from '../services/api';
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

  const generatePlan = async () => {
    try {
      setLoading(true);
      const response = await inductionService.generatePlan();
      setInductionPlan(response.data);
      message.success('Induction plan generated successfully');
    } catch (error) {
      console.error('Plan generation error:', error);
      // Use mock data when backend is not available
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
      message.warning('Using demo data - Backend server not connected');
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    try {
      setSimulationLoading(true);
      const parameters = {};
      
      if (scenarioType === 'train_breakdown' && trainId) {
        parameters.train_id = trainId;
      }

      const response = await inductionService.simulateWhatIf({
        scenario_type: scenarioType,
        parameters
      });
      
      setSimulationResult(response.data);
      message.success('Simulation completed');
    } catch (error) {
      message.error('Simulation failed');
      console.error('Simulation error:', error);
    } finally {
      setSimulationLoading(false);
    }
  };

  useEffect(() => {
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

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Row justify="space-between" align="middle">
              <Col>
                <h2>Train Induction Planning</h2>
              </Col>
              <Col>
                <Button.Group>
                  <Button 
                    type="primary" 
                    icon={<PlayCircleOutlined />}
                    onClick={generatePlan}
                    loading={loading}
                  >
                    Generate New Plan
                  </Button>
                  <Button 
                    icon={<ExperimentOutlined />}
                    onClick={() => setSimulationVisible(true)}
                  >
                    What-If Simulation
                  </Button>
                  <Button icon={<HistoryOutlined />}>
                    View History
                  </Button>
                </Button.Group>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {inductionPlan.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Trains Scheduled"
                value={inductionPlan.length}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="High Priority Trains"
                value={inductionPlan.filter(p => p.priority_score >= 70).length}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Average Priority Score"
                value={inductionPlan.reduce((sum, p) => sum + p.priority_score, 0) / inductionPlan.length}
                precision={1}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card title="Ranked Induction List" loading={loading}>
        <List
          itemLayout="vertical"
          dataSource={inductionPlan}
          renderItem={(item, index) => (
            <List.Item
              key={item.train_id}
              className={`induction-plan-item priority-${getPriorityText(item.priority_score).toLowerCase()}`}
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
            onChange={setScenarioType}
          >
            <Option value="train_breakdown">Train Breakdown</Option>
            <Option value="additional_capacity">Additional Maintenance Capacity</Option>
            <Option value="delayed_maintenance">Delayed Maintenance</Option>
          </Select>
        </div>

        {scenarioType === 'train_breakdown' && (
          <div style={{ marginBottom: 16 }}>
            <label>Train ID:</label>
            <Input
              style={{ marginTop: 8 }}
              placeholder="Enter train ID"
              type="number"
              value={trainId}
              onChange={(e) => setTrainId(parseInt(e.target.value))}
            />
          </div>
        )}

        {simulationResult && (
          <Card title="Simulation Results" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Base Plan Trains"
                  value={simulationResult.base_metrics.total_trains}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Modified Plan Trains"
                  value={simulationResult.simulation_result.modified_plan.length}
                />
              </Col>
            </Row>
            
            <div style={{ marginTop: 16 }}>
              <strong>Impact:</strong>
              <ul>
                <li>Trains affected: {Math.abs(simulationResult.simulation_result.comparison.trains_added)}</li>
                <li>Priority score change: {simulationResult.simulation_result.comparison.priority_score_change.toFixed(2)}</li>
                <li>Estimated cost savings: ₹{simulationResult.simulation_result.metrics.estimated_cost_savings.toFixed(0)}</li>
              </ul>
            </div>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default InductionPlan;