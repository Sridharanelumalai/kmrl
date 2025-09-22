# KMRL Quick Start Guide

## 🚀 Start the System

### 1. Start Backend (Required)
```bash
# Option 1: Use the simple startup script
start_backend_simple.bat

# Option 2: Manual start
cd backend
pip install -r requirements.txt
python main.py
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm start
```

### 3. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

## ✅ Verify Backend Connection

1. Open browser to http://localhost:8001/api/health
2. Should see: `{"status": "healthy", "timestamp": "...", "trains_count": 20, "message": "Backend is running with sample data"}`

## 🔧 Troubleshooting

### Backend Not Starting?
- Make sure Python 3.8+ is installed
- Run: `pip install fastapi uvicorn pydantic`
- Check if port 8001 is available

### Frontend Not Connecting?
- Verify backend is running on port 8001
- Check browser console for CORS errors
- Ensure both services are running

## 📱 Demo Features Available

- ✅ **Dashboard**: Real-time fleet overview
- ✅ **Train Management**: Full CRUD operations  
- ✅ **Induction Planning**: AI-powered scheduling
- ✅ **Analytics**: Performance insights
- ✅ **Maintenance**: Schedule tracking
- ✅ **Alerts**: System notifications
- ✅ **Reports**: Data export

**Note**: System uses mock data when database is not available.