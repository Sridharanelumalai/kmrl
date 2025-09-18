# KMRL Train Induction Planning System

AI-Driven Train Induction Planning & Scheduling for Kochi Metro Rail Limited (KMRL)

## 🚀 Features

- **Automated Induction Planning**: AI-powered optimization engine for train scheduling
- **Real-time Dashboard**: Live metrics, fleet status, and depot utilization
- **What-If Simulation**: Test different scenarios and their impacts
- **Multi-depot Support**: Handle multiple depots with capacity constraints
- **Predictive Maintenance**: Integration with sensor data and maintenance records
- **Explainable AI**: Clear reasoning for each induction decision

## 🏗️ Architecture

### Backend (FastAPI + PostgreSQL)
- **Data Ingestion**: Maximo, IoT sensors, UNS overrides, depot data
- **Optimization Engine**: Multi-objective scheduling with constraints
- **Predictive Models**: Failure probability and maintenance planning
- **REST APIs**: Complete API for frontend integration

### Frontend (React + Ant Design)
- **Dashboard**: Real-time metrics and visualizations
- **Induction Planning**: Ranked lists and scheduling interface
- **Train Management**: Fleet management and maintenance tracking
- **Simulation Tools**: What-if analysis and scenario testing

### Database (PostgreSQL)
- **Train Fleet**: Models, status, mileage tracking
- **Maintenance Records**: Scheduled and unscheduled maintenance
- **Sensor Data**: IoT telemetry with anomaly detection
- **Induction Plans**: Historical and current planning data

## 🛠️ Quick Start

### Prerequisites
- Python 3.11+
- Node.js 16+
- Docker & Docker Compose
- PostgreSQL (via Docker)

### Installation

1. **Clone and Setup**
   ```bash
   git clone <repository>
   cd KMRL
   setup.bat  # Windows
   ```

2. **Start Services**
   ```bash
   # Start database
   docker-compose up -d postgres redis
   
   # Start backend
   cd backend
   venv\Scripts\activate  # Windows
   uvicorn app.main:app --reload
   
   # Start frontend (new terminal)
   cd frontend
   npm start
   ```

3. **Access Application**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs
   - Database: localhost:5432

## 📊 Key Components

### Optimization Engine
- **Priority Scoring**: Mileage, maintenance due, sensor anomalies
- **Constraint Handling**: Safety rules, depot capacity, maintenance windows
- **Multi-objective**: Minimize costs, maximize availability
- **Algorithms**: Mixed Integer Programming (MIP) + heuristics

### Data Sources
- **Maximo Integration**: Maintenance work orders and schedules
- **IoT Sensors**: Temperature, vibration, brake pressure, door cycles
- **UNS Overrides**: Manual operator inputs and exceptions
- **Depot Management**: Capacity, occupancy, stabling information

### Simulation Capabilities
- **Train Breakdown**: Impact of unexpected failures
- **Capacity Changes**: Additional maintenance windows
- **Schedule Optimization**: Different priority weightings
- **Cost Analysis**: Maintenance cost projections

## 🔧 Configuration

### Environment Variables (.env)
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/kmrl_db
SECRET_KEY=your-secret-key-here
REDIS_URL=redis://localhost:6379
```

### Safety Constraints
- Maximum mileage before maintenance: 50,000 km
- Minimum hours between services: 4 hours
- Maximum consecutive service hours: 18 hours

## 📈 Metrics & KPIs

- **Fleet Availability**: Percentage of trains available for service
- **Unscheduled Withdrawals**: Reduction in emergency maintenance
- **Depot Utilization**: Optimal use of maintenance facilities
- **Cost Savings**: Predictive vs reactive maintenance costs
- **Response Time**: Speed of induction plan generation

## 🧪 Testing & Validation

### Sample Data
The system includes realistic simulated data:
- 20 trains across 3 depots
- Historical maintenance records
- IoT sensor readings with anomaly detection
- Maintenance windows and capacity constraints

### Validation Scenarios
1. **High Priority Scheduling**: Trains with critical maintenance needs
2. **Depot Capacity**: Handling over-capacity situations
3. **Sensor Anomalies**: Emergency induction triggers
4. **Multi-depot Optimization**: Cross-depot scheduling

## 🔒 Security & Compliance

- **Data Validation**: Input sanitization and validation
- **Audit Trails**: Complete logging of all decisions
- **Access Control**: Role-based permissions (future)
- **Data Privacy**: Anonymized operational data

## 📚 API Documentation

### Key Endpoints
- `GET /induction/plan` - Generate optimized induction plan
- `POST /induction/simulate` - Run what-if scenarios
- `GET /induction/dashboard` - Dashboard metrics
- `GET /trains/` - Fleet management
- `GET /trains/{id}/sensors` - Sensor data

### Response Format
```json
{
  "train_id": 1,
  "train_number": "KMRL-001",
  "priority_score": 85.5,
  "scheduled_date": "2024-01-15T06:00:00",
  "depot_id": 1,
  "reasoning": "High priority due to maintenance requirements; Approaching mileage limit (45000 km)"
}
```

## 🚀 Deployment

### Production Setup
1. **Database**: PostgreSQL cluster with replication
2. **Backend**: Multiple FastAPI instances with load balancer
3. **Frontend**: Static hosting (Nginx/CDN)
4. **Monitoring**: Prometheus + Grafana for metrics

### Scaling Considerations
- **Horizontal Scaling**: Multiple API instances
- **Database Optimization**: Indexing and query optimization
- **Caching**: Redis for frequently accessed data
- **Real-time Updates**: WebSocket connections for live data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is developed for SIH 2025 - Problem Statement SIH25081

## 📞 Support

For technical support and questions:
- Create an issue in the repository
- Contact the development team
- Check API documentation at `/docs`

---

**Built for Smart India Hackathon 2025**  
*Transforming Kerala's Metro Operations with AI*