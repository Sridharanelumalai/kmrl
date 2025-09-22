#!/usr/bin/env python3
import uvicorn
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("🚊 Starting KMRL Backend Server...")
    print("📡 Server will run on: http://127.0.0.1:8001")
    print("🔗 Health check: http://127.0.0.1:8001/api/health")
    print("📚 API docs: http://127.0.0.1:8001/docs")
    print("-" * 50)
    
    try:
        uvicorn.run(
            "backend.main:app",
            host="127.0.0.1",
            port=8001,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        input("Press Enter to exit...")