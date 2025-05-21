@echo off
echo Starting Energy Usage Monitor System...

:: Start the FastAPI Python server
start cmd /k "cd api && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: Start the app backend and frontend
start cmd /k "cd app/backend && npm start"
start cmd /k "cd app/frontend && npm start"

echo All components started successfully!