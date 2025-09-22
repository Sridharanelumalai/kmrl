@echo off
echo ========================================
echo KMRL Full System Setup
echo ========================================
echo.

echo [1/5] Installing Python dependencies...
cd backend
pip install fastapi uvicorn sqlite3 websockets python-multipart
cd ..

echo.
echo [2/5] Installing Node.js dependencies...
cd frontend
npm install
npm install recharts moment axios antd @ant-design/icons
cd ..

echo.
echo [3/5] Setting up database...
cd backend
python -c "from database import db; print('Database initialized successfully')"
cd ..

echo.
echo [4/5] Creating environment files...
echo DATABASE_URL=sqlite:///kmrl.db > backend\.env
echo REACT_APP_API_URL=http://localhost:8001/api > frontend\.env

echo.
echo [5/5] System setup complete!
echo.
echo ========================================
echo Quick Start Commands:
echo ========================================
echo Backend:  start_backend.bat
echo Frontend: cd frontend && npm start
echo.
echo Features Available:
echo - Real-time sensor monitoring
echo - AI-powered induction planning  
echo - Advanced analytics dashboard
echo - Comprehensive maintenance management
echo - Smart alerts and notifications
echo - Automated report generation
echo - Full CRUD operations for trains
echo - WebSocket real-time updates
echo - SQLite database with persistence
echo ========================================

pause