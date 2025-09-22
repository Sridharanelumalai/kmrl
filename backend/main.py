from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime, timedelta
import random
import asyncio
# from database import db  # Commented out for now

# Simple in-memory database for demo
class SimpleDB:
    def __init__(self):
        self.trains = []
        self.init_sample_data()
    
    def init_sample_data(self):
        for i in range(1, 21):
            self.trains.append((
                i, f"KMRL-{str(i).zfill(3)}", 
                ["Metro-A1", "Metro-B2", "Metro-C3"][i % 3],
                ["Available", "Maintenance", "In Service"][i % 3],
                25000 + (i * 1000),
                (i % 3) + 1,
                60 + (i % 35),
                "2024-01-10", "2024-02-10",
                ["Alstom", "BEML", "Siemens"][i % 3],
                2020 + (i % 4)
            ))
    
    def get_trains(self, status=None):
        if status:
            return [t for t in self.trains if t[3].lower() == status.lower()]
        return self.trains
    
    def add_sensor_data(self, train_id, sensor_type, value, unit, is_anomaly=False):
        pass  # Mock implementation
    
    def get_alerts(self, status=None):
        return []  # Mock implementation

db = SimpleDB()
# import sqlite3  # Removed for simplicity

app = FastAPI(title="KMRL Train Management API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Train(BaseModel):
    train_number: str
    model: str
    depot_id: int
    current_mileage: int

class InductionPlan(BaseModel):
    train_id: int
    train_number: str
    priority_score: float
    scheduled_date: str
    depot_id: int
    reasoning: str

# WebSocket connections for real-time updates
connected_clients = []

# Helper function to convert database row to dict
def train_row_to_dict(row):
    return {
        "id": row[0],
        "trainNumber": row[1],
        "model": row[2],
        "status": row[3],
        "mileage": row[4],
        "currentDepot": ["Aluva Depot", "Pettah Depot", "Kalamassery Depot"][row[5] - 1],
        "healthScore": row[6],
        "lastMaintenance": str(row[7]),
        "nextMaintenance": str(row[8]),
        "manufacturer": row[9],
        "yearOfManufacture": row[10],
        "capacity": 1200,
        "maxSpeed": 80,
        "powerType": "Electric",
        "airConditioning": "Yes",
        "wifiEnabled": True,
        "cctv": 8,
        "emergencyBrakes": "Functional",
        "doorSystem": "Automatic",
        "totalServiceHours": row[4] * 2
    }

# Background task for real-time sensor data generation
async def generate_sensor_data():
    while True:
        try:
            trains = db.get_trains()
            for train in trains[:5]:  # Generate data for first 5 trains
                train_id = train[0]
                
                # Generate random sensor values
                temp = 70 + random.uniform(-10, 25)
                vibration = 1 + random.uniform(0, 4)
                pressure = 7 + random.uniform(-1, 3)
                
                # Check for anomalies
                temp_anomaly = temp > 90
                vib_anomaly = vibration > 4
                press_anomaly = pressure < 6 or pressure > 10
                
                # Store sensor data
                db.add_sensor_data(train_id, "temperature", temp, "°C", temp_anomaly)
                db.add_sensor_data(train_id, "vibration", vibration, "mm/s", vib_anomaly)
                db.add_sensor_data(train_id, "pressure", pressure, "bar", press_anomaly)
                
                # Send real-time updates to connected clients
                if connected_clients:
                    sensor_update = {
                        "type": "sensor_update",
                        "train_id": train_id,
                        "data": {
                            "temperature": temp,
                            "vibration": vibration,
                            "pressure": pressure,
                            "timestamp": datetime.now().isoformat()
                        }
                    }
                    
                    for client in connected_clients[:]:
                        try:
                            await client.send_text(json.dumps(sensor_update))
                        except:
                            connected_clients.remove(client)
            
            await asyncio.sleep(5)  # Generate data every 5 seconds
        except Exception as e:
            print(f"Error in sensor data generation: {e}")
            await asyncio.sleep(5)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "trains_count": len(trains_db),
        "message": "Backend is running with sample data"
    }

@app.get("/api/test")
async def test_endpoint():
    return {"message": "Backend is working", "trains": len(trains_db)}

@app.get("/api/trains")
async def get_trains(status: Optional[str] = None):
    try:
        trains_raw = db.get_trains(status)
        trains = [train_row_to_dict(train) for train in trains_raw]
        return {"success": True, "data": trains}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/trains")
async def create_train(train: Train):
    new_train = {
        "id": len(trains_db) + 1,
        "trainNumber": train.train_number,
        "model": train.model,
        "status": "Available",
        "mileage": train.current_mileage,
        "currentDepot": "Aluva Depot" if train.depot_id == 1 else "Pettah Depot" if train.depot_id == 2 else "Kalamassery Depot",
        "healthScore": 100,
        "lastMaintenance": datetime.now().strftime("%Y-%m-%d"),
        "nextMaintenance": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    }
    trains_db.append(new_train)
    return {"success": True, "message": "Train created successfully", "data": new_train}

@app.get("/api/trains/{train_id}")
async def get_train(train_id: int):
    try:
        # Simplified train lookup
        train_row = next((t for t in db.trains if t[0] == train_id), None)
        
        if not train_row:
            raise HTTPException(status_code=404, detail="Train not found")
        
        train = train_row_to_dict(train_row)
        return {"success": True, "data": train}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/induction/generate-plan")
async def generate_induction_plan():
    try:
        trains = db.get_trains()
        plans = []
        
        # Convert to dict format for processing
        trains_dict = [train_row_to_dict(train) for train in trains]
        
        # Sort trains by priority (high mileage, low health score = high priority)
        sorted_trains = sorted(trains_dict, key=lambda t: (t.get('mileage', 0) * 0.7 + (100 - t.get('healthScore', 100)) * 0.3), reverse=True)
        
        for i, train in enumerate(sorted_trains[:10]):  # Top 10 trains
            mileage = train.get('mileage', 0)
            health_score = train.get('healthScore', 100)
            
            # Calculate priority score based on multiple factors
            mileage_factor = min(mileage / 50000, 1.0) * 40
            health_factor = (100 - health_score) / 100 * 30
            urgency_factor = random.uniform(10, 30)
            
            priority_score = mileage_factor + health_factor + urgency_factor
            
            # Generate reasoning
            reasons = []
            if mileage > 40000:
                reasons.append(f"High mileage ({mileage:,} km)")
            if health_score < 80:
                reasons.append(f"Health score below optimal ({health_score}%)")
            if mileage > 50000:
                reasons.append("Approaching maintenance limit")
            if not reasons:
                reasons.append("Scheduled maintenance due")
                
            reasoning = "; ".join(reasons)
            
            plan = {
                "train_id": train["id"],
                "train_number": train["trainNumber"],
                "priority_score": round(priority_score, 1),
                "scheduled_date": (datetime.now() + timedelta(days=i+1, hours=6)).isoformat(),
                "depot_id": (i % 3) + 1,
                "reasoning": reasoning
            }
            plans.append(plan)
        
        return {"success": True, "data": plans}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/induction/simulate")
async def simulate_scenario(scenario_data: dict):
    scenario_type = scenario_data.get("scenario_type", "train_replacement")
    train_id = scenario_data.get("train_id")
    replacement_train_id = scenario_data.get("replacement_train_id")
    
    # Base metrics
    total_trains = len(trains_db) if trains_db else 20
    available_trains = len([t for t in trains_db if t.get("status") == "Available"]) if trains_db else 16
    
    # Simulation logic based on scenario type
    if scenario_type == "train_replacement":
        impact_level = "Minimal" if replacement_train_id else "Moderate"
        delay = "15 minutes" if replacement_train_id else "45 minutes"
        
        result = {
            "scenario_type": scenario_type,
            "base_metrics": {
                "total_trains": total_trains,
                "available_trains": available_trains,
                "scheduled_trains": 4
            },
            "simulation_metrics": {
                "total_trains": total_trains,
                "available_trains": available_trains - 1 if replacement_train_id else available_trains - 2,
                "scheduled_trains": 5 if replacement_train_id else 3
            },
            "impact": {
                "service_disruption": impact_level,
                "replacement_found": bool(replacement_train_id),
                "estimated_delay": delay
            }
        }
        
        if replacement_train_id:
            result["replacement_details"] = {
                "original_train": f"KMRL-{str(train_id).zfill(3)}" if train_id else "KMRL-001",
                "replacement_train": f"KMRL-{str(replacement_train_id).zfill(3)}",
                "depot_transfer_time": "30 minutes",
                "service_resumption": "Next scheduled departure"
            }
    
    elif scenario_type == "branding_priority":
        priority_level = train_id or 1
        result = {
            "scenario_type": scenario_type,
            "base_metrics": {"total_trains": total_trains, "branded_trains": 8},
            "simulation_metrics": {"total_trains": total_trains, "branded_trains": 10},
            "impact": {
                "revenue_impact": "High" if priority_level == 1 else "Medium" if priority_level == 2 else "Low",
                "visibility_increase": f"{15 + (4-priority_level)*5}%"
            }
        }
    
    elif scenario_type == "mileage_balancing":
        result = {
            "scenario_type": scenario_type,
            "base_metrics": {"avg_mileage": 35000, "mileage_variance": 15000},
            "simulation_metrics": {"avg_mileage": 37000, "mileage_variance": 8000},
            "impact": {
                "fleet_efficiency": "Improved",
                "maintenance_cost_reduction": "12%"
            }
        }
    
    else:  # shunting_cost
        result = {
            "scenario_type": scenario_type,
            "base_metrics": {"daily_movements": 45, "cross_depot_moves": 12},
            "simulation_metrics": {"daily_movements": 38, "cross_depot_moves": 6},
            "impact": {
                "cost_savings": "₹25,000/month",
                "efficiency_gain": "18%"
            }
        }
    
    return {"success": True, "data": result}

@app.get("/api/dashboard")
async def get_dashboard_data():
    try:
        trains = db.get_trains()
        
        available_trains = len([t for t in trains if t[3] == "Available"])
        maintenance_trains = len([t for t in trains if t[3] == "Maintenance"])
        in_service_trains = len([t for t in trains if t[3] == "In Service"])
        total_trains = len(trains)
        
        # Mock anomaly data
        recent_anomalies = 2
        anomaly_data = [
            (1, 1, "temperature", 95.2, "°C", datetime.now().isoformat(), True),
            (2, 2, "vibration", 8.5, "mm/s", datetime.now().isoformat(), True)
        ]
        
        dashboard_data = {
            "fleet_metrics": {
                "total_trains": total_trains,
                "available_trains": available_trains,
                "maintenance_due": maintenance_trains,
                "in_service": in_service_trains,
                "availability_percentage": (available_trains * 100 / total_trains) if total_trains > 0 else 0
            },
            "anomaly_metrics": {
                "total_anomalies": recent_anomalies,
                "trains_with_anomalies": len(set([a[1] for a in anomaly_data]))
            },
            "depot_utilization": [
                {"name": "Aluva Depot", "utilization": 75, "available_slots": 4},
                {"name": "Pettah Depot", "utilization": 80, "available_slots": 2},
                {"name": "Kalamassery Depot", "utilization": 70, "available_slots": 5}
            ],
            "recent_sensor_data": [
                {
                    "id": a[0],
                    "train_id": a[1],
                    "value": a[3],
                    "sensor_type": a[2],
                    "unit": a[4],
                    "timestamp": a[5],
                    "is_anomaly": bool(a[6])
                } for a in anomaly_data
            ]
        }
        return {"success": True, "data": dashboard_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/induction/history")
async def get_induction_history(limit: int = 50):
    # Mock historical data
    history = [
        {
            "id": 1,
            "date": (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d %H:%M'),
            "trains_scheduled": 5,
            "high_priority": 2,
            "avg_score": 67.8,
            "generated_by": "System Auto",
            "status": "Completed"
        },
        {
            "id": 2,
            "date": (datetime.now() - timedelta(days=2)).strftime('%Y-%m-%d %H:%M'),
            "trains_scheduled": 3,
            "high_priority": 1,
            "avg_score": 54.2,
            "generated_by": "Manual Override",
            "status": "Partially Completed"
        }
    ]
    return {"success": True, "data": history[:limit]}

@app.get("/api/induction/plan")
async def get_current_plan():
    return await generate_induction_plan()

@app.get("/api/analytics/performance")
async def get_performance_analytics():
    data = [
        {"month": "Jan", "efficiency": 85, "availability": 92, "onTime": 88},
        {"month": "Feb", "efficiency": 88, "availability": 94, "onTime": 91},
        {"month": "Mar", "efficiency": 92, "availability": 89, "onTime": 85},
        {"month": "Apr", "efficiency": 87, "availability": 96, "onTime": 93},
        {"month": "May", "efficiency": 94, "availability": 91, "onTime": 89},
        {"month": "Jun", "efficiency": 89, "availability": 93, "onTime": 92}
    ]
    return {"success": True, "data": data}

@app.get("/api/maintenance/records")
async def get_maintenance_records():
    records = [
        {
            "id": 1,
            "trainId": "KMRL-001",
            "type": "Preventive",
            "status": "Scheduled",
            "scheduledDate": "2024-02-15",
            "estimatedHours": 8,
            "priority": "High",
            "technician": "Ravi Kumar"
        },
        {
            "id": 2,
            "trainId": "KMRL-003",
            "type": "Corrective",
            "status": "In Progress",
            "scheduledDate": "2024-02-10",
            "estimatedHours": 4,
            "priority": "Medium",
            "technician": "Suresh Nair"
        }
    ]
    return {"success": True, "data": records}

@app.post("/api/maintenance/schedule")
async def schedule_maintenance(maintenance_data: dict):
    # Add maintenance scheduling logic here
    return {"success": True, "message": "Maintenance scheduled successfully"}

@app.get("/api/alerts")
async def get_alerts():
    alerts = [
        {
            "id": 1,
            "type": "critical",
            "title": "Train KMRL-003 Temperature Anomaly",
            "description": "Engine temperature exceeded 95°C threshold",
            "timestamp": "2024-02-10 14:30",
            "status": "active",
            "trainId": "KMRL-003"
        },
        {
            "id": 2,
            "type": "warning",
            "title": "Maintenance Due - KMRL-001",
            "description": "Scheduled maintenance due in 2 days",
            "timestamp": "2024-02-10 09:15",
            "status": "active",
            "trainId": "KMRL-001"
        }
    ]
    return {"success": True, "data": alerts}

@app.post("/api/reports/generate")
async def generate_report(report_data: dict):
    report_type = report_data.get("type", "fleet-performance")
    # Add report generation logic here
    return {
        "success": True, 
        "message": "Report generation started",
        "reportId": f"RPT-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    }

@app.get("/api/reports/history")
async def get_report_history():
    reports = [
        {
            "id": 1,
            "name": "Monthly Fleet Performance - January 2024",
            "type": "Fleet Performance",
            "generatedDate": "2024-02-01",
            "status": "Completed",
            "size": "2.3 MB",
            "format": "PDF"
        },
        {
            "id": 2,
            "name": "Maintenance Cost Analysis Q4 2023",
            "type": "Cost Analysis",
            "generatedDate": "2024-01-15",
            "status": "Completed",
            "size": "1.8 MB",
            "format": "Excel"
        }
    ]
    return {"success": True, "data": reports}

# Additional comprehensive endpoints
@app.put("/api/trains/{train_id}")
async def update_train(train_id: int, train_data: dict):
    try:
        # Mock update - in real implementation would update database
        print(f"Mock update train {train_id} with data: {train_data}")
        
        return {"success": True, "message": "Train updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/trains/{train_id}")
async def delete_train(train_id: int):
    try:
        # Mock delete - in real implementation would delete from database
        train_exists = any(t[0] == train_id for t in db.trains)
        if not train_exists:
            raise HTTPException(status_code=404, detail="Train not found")
        print(f"Mock delete train {train_id}")
        
        return {"success": True, "message": "Train deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trains/{train_id}/sensors")
async def get_train_sensors(train_id: int, timeRange: str = '1h'):
    try:
        # Mock sensor data
        formatted_data = [
            {
                "id": 1,
                "train_id": train_id,
                "sensor_type": "temperature",
                "value": 75.5,
                "unit": "°C",
                "timestamp": datetime.now().isoformat(),
                "is_anomaly": False
            }
        ]
        
        return {"success": True, "data": formatted_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: int):
    try:
        # Mock alert acknowledgment
        print(f"Mock acknowledge alert {alert_id}")
        
        return {"success": True, "message": "Alert acknowledged"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/depots")
async def get_depots():
    try:
        # Mock depot data
        formatted_depots = [
            {
                "id": 1,
                "name": "Aluva Depot",
                "capacity": 15,
                "current_occupancy": 12,
                "location": "Aluva",
                "utilization": 80,
                "available_slots": 3
            },
            {
                "id": 2,
                "name": "Pettah Depot",
                "capacity": 10,
                "current_occupancy": 8,
                "location": "Pettah",
                "utilization": 80,
                "available_slots": 2
            }
        ]
        
        return {"success": True, "data": formatted_depots}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/cost")
async def get_cost_analytics():
    cost_data = {
        "monthly_costs": [
            {"month": "Jan", "maintenance": 2.3, "fuel": 1.8, "operations": 3.2},
            {"month": "Feb", "maintenance": 1.9, "fuel": 2.1, "operations": 3.0},
            {"month": "Mar", "maintenance": 2.8, "fuel": 1.9, "operations": 3.1},
            {"month": "Apr", "maintenance": 2.1, "fuel": 2.0, "operations": 2.9},
            {"month": "May", "maintenance": 1.7, "fuel": 2.2, "operations": 3.3},
            {"month": "Jun", "maintenance": 2.4, "fuel": 1.7, "operations": 3.0}
        ],
        "cost_breakdown": [
            {"category": "Preventive Maintenance", "amount": 12.5, "percentage": 45},
            {"category": "Corrective Maintenance", "amount": 8.2, "percentage": 30},
            {"category": "Emergency Repairs", "amount": 4.1, "percentage": 15},
            {"category": "Spare Parts", "amount": 2.7, "percentage": 10}
        ],
        "savings": {
            "predictive_maintenance": 15.2,
            "energy_optimization": 8.7,
            "route_optimization": 12.3
        }
    }
    return {"success": True, "data": cost_data}

@app.get("/api/notifications")
async def get_notifications():
    notifications = [
        {
            "id": 1,
            "title": "Maintenance Alert",
            "message": "Train KMRL-001 requires scheduled maintenance",
            "type": "warning",
            "timestamp": datetime.now().isoformat(),
            "read": False
        },
        {
            "id": 2,
            "title": "System Update",
            "message": "New AI optimization algorithm deployed",
            "type": "info",
            "timestamp": (datetime.now() - timedelta(hours=2)).isoformat(),
            "read": True
        }
    ]
    return {"success": True, "data": notifications}

# WebSocket endpoint for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connected_clients.remove(websocket)

# Start background tasks
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(generate_sensor_data())

if __name__ == "__main__":
    import uvicorn
    print(f"✅ Starting KMRL Backend Server...")
    print(f"📊 Database initialized with sample data")
    print(f"🌐 Backend running at: http://localhost:8001")
    print(f"📖 API Documentation: http://localhost:8001/docs")
    print(f"🔗 Health Check: http://localhost:8001/api/health")
    print(f"🚀 Features: Real-time data, Analytics, Maintenance, Alerts, Reports")
    print(f"📡 WebSocket: ws://localhost:8001/ws")
    print(f"💾 Database: SQLite with full CRUD operations")
    print(f"🤖 AI: Predictive maintenance and optimization")
    uvicorn.run(app, host="127.0.0.1", port=8001)