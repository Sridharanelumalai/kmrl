@echo off
echo Installing FastAPI...
pip install fastapi uvicorn

echo Starting KMRL Backend...
cd backend
python simple_server.py
pause