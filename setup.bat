@echo off
echo Setting up KMRL Train Induction Planning System...

echo.
echo 1. Setting up Backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo.
echo 2. Setting up Frontend...
cd frontend
npm install
cd ..

echo.
echo 3. Starting Docker services...
docker-compose up -d postgres redis

echo.
echo Setup complete!
echo.
echo To start the application:
echo 1. Backend: cd backend && venv\Scripts\activate && uvicorn app.main:app --reload
echo 2. Frontend: cd frontend && npm start
echo 3. Database: Already running via Docker
echo.
echo Access the application at: http://localhost:3000
echo API documentation at: http://localhost:8000/docs

pause