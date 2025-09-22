@echo off
echo ========================================
echo KMRL Train Induction Planning System
echo ========================================
echo.
echo Starting Backend Server...
cd backend
start "KMRL Backend" cmd /k "python main.py"
echo Backend started on http://localhost:8001
echo.
echo Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend...
cd ..\frontend
start "KMRL Frontend" cmd /k "npm start"
echo Frontend will start on http://localhost:3000
echo.
echo ========================================
echo System Status:
echo Backend: http://localhost:8001/api/health
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit...
pause > nul