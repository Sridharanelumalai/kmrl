from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data
trains_data = [
    {"id": i, "trainNumber": f"KMRL-{str(i).zfill(3)}", "model": "Metro-A1", "status": "Available", "mileage": 30000 + i*1000, "currentDepot": "Aluva Depot", "healthScore": 85}
    for i in range(1, 21)
]

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat(), "trains_count": 20}

@app.get("/api/trains")
def get_trains():
    return {"success": True, "data": trains_data}

@app.get("/api/dashboard")
def get_dashboard():
    return {
        "success": True,
        "data": {
            "fleet_metrics": {"total_trains": 20, "available_trains": 16, "maintenance_due": 4, "in_service": 0, "availability_percentage": 80},
            "anomaly_metrics": {"total_anomalies": 2, "trains_with_anomalies": 2},
            "depot_utilization": [
                {"name": "Aluva Depot", "utilization": 75, "available_slots": 4},
                {"name": "Pettah Depot", "utilization": 80, "available_slots": 2}
            ],
            "recent_sensor_data": []
        }
    }

@app.post("/api/induction/generate-plan")
def generate_plan():
    plans = [
        {"train_id": 1, "train_number": "KMRL-001", "priority_score": 85.5, "scheduled_date": datetime.now().isoformat(), "depot_id": 1, "reasoning": "High priority maintenance"}
    ]
    return {"success": True, "data": plans}

if __name__ == "__main__":
    import uvicorn
    print("🚊 Starting Simple KMRL Backend...")
    print("🌐 Server: http://localhost:8001")
    uvicorn.run(app, host="127.0.0.1", port=8001)