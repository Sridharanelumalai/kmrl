# KMRL System Demo Guide

## 🎯 Demo Flow (5 minutes)

### 1. System Startup
```bash
# Option 1: One-click start
start_system.bat

# Option 2: Manual start
cd backend && python main.py
cd frontend && npm start
```

### 2. Login Demo
- **URL**: http://localhost:3000
- **Action**: Choose "New User" → Enter any name → Login
- **Result**: Professional login with KMRL branding

### 3. Dashboard Overview
- **Fleet Metrics**: 20 trains, 14 available, 4 maintenance
- **Depot Utilization**: 3 depots with capacity info
- **Connection Status**: "Backend Connected" (green tag)
- **Real-time Data**: Live metrics from backend

### 4. Train Management
- **Navigate**: Click "Train Management"
- **View Data**: 20 trains with realistic details
- **Add Train**: Click "Add New Train" → Fill form → Create
- **Details**: Click any train → View comprehensive info

### 5. Induction Planning (Main Feature)
- **Navigate**: Click "Induction Planning"
- **Generate Plan**: Click "Generate New Plan"
- **Result**: 10 trains ranked by AI priority
- **Features**: Priority scores, reasoning, scheduling

### 6. What-If Simulations
- **Click**: "What-If Simulation"
- **Scenarios**: 
  - Train Replacement (emergency)
  - Branding Priority (revenue)
  - Mileage Balancing (efficiency)
  - Shunting Cost (operations)
- **Results**: Impact analysis with metrics

## 🎪 Demo Script

### Opening (30 seconds)
"This is the KMRL Train Induction Planning System - an AI-powered solution for optimizing metro train maintenance scheduling."

### Dashboard (1 minute)
"The dashboard shows real-time fleet status - 20 trains across 3 depots. Notice the 'Backend Connected' status showing live API integration."

### Train Management (1 minute)
"Here's our complete train fleet with detailed specifications, health scores, and maintenance history. I can add new trains or view detailed information."

### Induction Planning (2 minutes)
"This is the core AI feature. The system analyzes all trains and generates an optimized maintenance schedule. See how it prioritizes trains with high mileage and low health scores, provides clear reasoning, and distributes across depots."

### Simulations (30 seconds)
"The what-if simulator lets operators test different scenarios - like emergency train replacements or cost optimization strategies."

## 🔧 Technical Highlights

- **Full-Stack**: React frontend + FastAPI backend
- **Real Data**: 20 trains with realistic parameters
- **AI Logic**: Priority scoring algorithm
- **Professional UI**: Ant Design with KMRL branding
- **Robust**: Error handling and fallbacks
- **Scalable**: REST API architecture

## 📊 Key Metrics to Show

- **20 trains** in the system
- **10 trains** in induction planning
- **4 scenario types** for simulation
- **3 depots** with capacity management
- **Real-time** backend connectivity

---

**Demo Time**: 5 minutes
**Audience**: Technical and non-technical
**Impact**: Shows complete working system ready for deployment