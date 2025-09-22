@echo off
echo Starting KMRL System...
echo Backend: http://localhost:8001
echo Frontend: http://localhost:3000
echo.
cd backend
start cmd /k python main.py
cd ..\frontend  
start cmd /k npm start
echo System started!