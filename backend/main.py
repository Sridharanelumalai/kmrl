from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime, timedelta
import random

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

# Sample dataset of 20 trains with complete details
def create_train_data(id, train_num, model, status, mileage, depot, health, last_maint, next_maint):
    return {
        "id": id,
        "trainNumber": train_num,
        "model": model,
        "status": status,
        "mileage": mileage,
        "currentDepot": depot,
        "healthScore": health,
        "lastMaintenance": last_maint,
        "nextMaintenance": next_maint,
        "manufacturer": "Alstom" if "A1" in model else "BEML" if "B2" in model else "Siemens",
        "yearOfManufacture": 2020 + (id % 4),
        "capacity": 1200,
        "maxSpeed": 80,
        "powerType": "Electric",
        "airConditioning": "Yes",
        "wifiEnabled": True,
        "cctv": 8,
        "emergencyBrakes": "Functional",
        "doorSystem": "Automatic",
        "totalServiceHours": mileage * 2,
        "fitnessCertificate": {
            "certificateNumber": f"FC-KMRL-{str(id).zfill(3)}-2024",
            "issuedDate": "2024-01-01",
            "expiryDate": "2025-01-01",
            "certifyingAuthority": "Commissioner of Railway Safety (CRS)",
            "status": "Valid" if health > 70 else "Under Review",
            "lastInspectionDate": last_maint,
            "nextInspectionDue": next_maint
        },
        "brandingContract": {
            "companyName": ["Kerala Tourism", "Coca-Cola", "Samsung", "LuLu Group"][id % 4],
            "contractedHours": 2400,
            "usedHours": int(mileage / 20),
            "contractStartDate": "2024-01-01",
            "contractEndDate": "2024-12-31",
            "brandingType": "Full Wrap" if id % 2 == 0 else "Partial Wrap"
        }
    }

trains_db = [
    create_train_data(1, "KMRL-001", "Metro-A1", "Available", 45000, "Aluva Depot", 75, "2024-01-10", "2024-02-10"),
    create_train_data(2, "KMRL-002", "Metro-B2", "Available", 38000, "Pettah Depot", 85, "2024-01-15", "2024-02-15"),
    create_train_data(3, "KMRL-003", "Metro-A1", "Maintenance", 52000, "Kalamassery Depot", 65, "2024-01-05", "2024-02-05"),
    create_train_data(4, "KMRL-004", "Metro-C3", "Available", 29000, "Aluva Depot", 92, "2024-01-20", "2024-02-20"),
    create_train_data(5, "KMRL-005", "Metro-B2", "In Service", 41000, "Pettah Depot", 78, "2024-01-12", "2024-02-12"),
    create_train_data(6, "KMRL-006", "Metro-A1", "Available", 33000, "Kalamassery Depot", 88, "2024-01-18", "2024-02-18"),
    create_train_data(7, "KMRL-007", "Metro-C3", "Available", 47000, "Aluva Depot", 72, "2024-01-08", "2024-02-08"),
    create_train_data(8, "KMRL-008", "Metro-B2", "Available", 35000, "Pettah Depot", 90, "2024-01-22", "2024-02-22"),
    create_train_data(9, "KMRL-009", "Metro-A1", "Maintenance", 49000, "Kalamassery Depot", 68, "2024-01-03", "2024-02-03"),
    create_train_data(10, "KMRL-010", "Metro-C3", "Available", 31000, "Aluva Depot", 86, "2024-01-25", "2024-02-25"),
    create_train_data(11, "KMRL-011", "Metro-B2", "Available", 43000, "Pettah Depot", 80, "2024-01-14", "2024-02-14"),
    create_train_data(12, "KMRL-012", "Metro-A1", "Available", 36000, "Kalamassery Depot", 84, "2024-01-19", "2024-02-19"),
    create_train_data(13, "KMRL-013", "Metro-C3", "In Service", 40000, "Aluva Depot", 76, "2024-01-11", "2024-02-11"),
    create_train_data(14, "KMRL-014", "Metro-B2", "Available", 28000, "Pettah Depot", 94, "2024-01-26", "2024-02-26"),
    create_train_data(15, "KMRL-015", "Metro-A1", "Available", 44000, "Kalamassery Depot", 82, "2024-01-16", "2024-02-16"),
    create_train_data(16, "KMRL-016", "Metro-C3", "Maintenance", 51000, "Aluva Depot", 63, "2024-01-02", "2024-02-02"),
    create_train_data(17, "KMRL-017", "Metro-B2", "Available", 32000, "Pettah Depot", 89, "2024-01-23", "2024-02-23"),
    create_train_data(18, "KMRL-018", "Metro-A1", "Available", 37000, "Kalamassery Depot", 87, "2024-01-17", "2024-02-17"),
    create_train_data(19, "KMRL-019", "Metro-C3", "Available", 39000, "Aluva Depot", 81, "2024-01-13", "2024-02-13"),
    create_train_data(20, "KMRL-020", "Metro-B2", "Maintenance", 48000, "Pettah Depot", 70, "2024-01-06", "2024-02-06")
]
induction_plans = []

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
    print(f"GET /api/trains called with status: {status}")
    print(f"Total trains in database: {len(trains_db)}")
    
    if status:
        filtered_trains = [t for t in trains_db if t.get('status', '').lower() == status.lower()]
        print(f"Filtered trains: {len(filtered_trains)}")
        return {"success": True, "data": filtered_trains}
    
    print(f"Returning all trains: {len(trains_db)}")
    return {"success": True, "data": trains_db}

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
    train = next((t for t in trains_db if t["id"] == train_id), None)
    if not train:
        raise HTTPException(status_code=404, detail="Train not found")
    return {"success": True, "data": train}

@app.post("/api/induction/generate-plan")
async def generate_induction_plan():
    print(f"POST /api/induction/generate-plan called")
    print(f"Available trains for planning: {len(trains_db)}")
    
    # Enhanced AI-powered induction planning logic
    plans = []
    
    # Use the trains from database
    trains_to_plan = trains_db
    print(f"Using {len(trains_to_plan)} trains for planning")
    
    # Sort trains by priority (high mileage, low health score = high priority)
    sorted_trains = sorted(trains_to_plan, key=lambda t: (t.get('mileage', 0) * 0.7 + (100 - t.get('healthScore', 100)) * 0.3), reverse=True)
    
    for i, train in enumerate(sorted_trains[:10]):  # Top 10 trains
        mileage = train.get('mileage', 0)
        health_score = train.get('healthScore', 100)
        
        # Calculate priority score based on multiple factors
        mileage_factor = min(mileage / 50000, 1.0) * 40  # Max 40 points for mileage
        health_factor = (100 - health_score) / 100 * 30  # Max 30 points for poor health
        urgency_factor = random.uniform(10, 30)  # Random urgency factor
        
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
            "depot_id": (i % 3) + 1,  # Distribute across depots
            "reasoning": reasoning
        }
        plans.append(plan)
    
    global induction_plans
    induction_plans = plans
    print(f"Generated {len(plans)} induction plans")
    return {"success": True, "data": plans}

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
    print(f"GET /api/dashboard called")
    print(f"Trains in database: {len(trains_db)}")
    
    if trains_db:
        available_trains = len([t for t in trains_db if t.get("status") == "Available"])
        maintenance_trains = len([t for t in trains_db if t.get("status") == "Maintenance"])
        in_service_trains = len([t for t in trains_db if t.get("status") == "In Service"])
        total_trains = len(trains_db)
        print(f"Available: {available_trains}, Maintenance: {maintenance_trains}, In Service: {in_service_trains}")
    else:
        # Default values when no trains in database
        total_trains = 20
        available_trains = 16
        maintenance_trains = 4
        in_service_trains = 0
    
    dashboard_data = {
        "fleet_metrics": {
            "total_trains": total_trains,
            "available_trains": available_trains,
            "maintenance_due": maintenance_trains,
            "in_service": in_service_trains,
            "availability_percentage": (available_trains * 100 / total_trains) if total_trains > 0 else 0
        },
        "anomaly_metrics": {"total_anomalies": 3, "trains_with_anomalies": 2},
        "depot_utilization": [
            {"name": "Aluva Depot", "utilization": 75, "available_slots": 4},
            {"name": "Pettah Depot", "utilization": 80, "available_slots": 2},
            {"name": "Kalamassery Depot", "utilization": 70, "available_slots": 5}
        ],
        "recent_sensor_data": [
            {"id": 1, "train_id": 3, "value": 95.2, "sensor_type": "temperature", "unit": "°C", "timestamp": datetime.now().isoformat(), "is_anomaly": True},
            {"id": 2, "train_id": 5, "value": 8.5, "sensor_type": "vibration", "unit": "mm/s", "timestamp": datetime.now().isoformat(), "is_anomaly": True}
        ]
    }
    return {"success": True, "data": dashboard_data}

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

if __name__ == "__main__":
    import uvicorn
    print(f"✅ Starting KMRL Backend Server...")
    print(f"📊 Loaded {len(trains_db)} trains in database")
    print(f"🌐 Backend running at: http://localhost:8001")
    print(f"📖 API Documentation: http://localhost:8001/docs")
    print(f"🔗 Health Check: http://localhost:8001/api/health")
    uvicorn.run(app, host="127.0.0.1", port=8001)