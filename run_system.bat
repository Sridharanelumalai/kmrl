@echo off
echo Starting KMRL Train Induction Planning System...

echo.
echo 1. Starting Database Services...
docker-compose up -d postgres redis

echo Waiting for database to be ready...
timeout /t 10 /nobreak > nul

echo.
echo 2. Initializing Database with Sample Data...
cd backend
call venv\Scripts\activate
python -m app.database.init_data
cd ..

echo.
echo 3. Starting Backend API Server...
start "KMRL Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo 4. Starting Frontend Development Server...
start "KMRL Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo KMRL System is starting up!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press any key to stop all services...
pause > nul

echo.
echo Stopping services...
docker-compose down
taskkill /f /im "node.exe" 2>nul
taskkill /f /im "python.exe" 2>nul

echo System stopped.
pause