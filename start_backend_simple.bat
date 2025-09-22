@echo off
echo Starting KMRL Backend Server...
cd /d "%~dp0backend"
pip install -r requirements.txt
python main.py
pause