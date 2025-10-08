@echo off
echo 🔄 Restarting backend server...

echo 🛑 Stopping existing backend process...
taskkill /f /im node.exe 2>nul

echo ⏳ Waiting for process to stop...
timeout /t 2 /nobreak > nul

echo 🚀 Starting backend server...
cd backend
start "Acadira Backend" cmd /k "npm start"

echo ✅ Backend server restarted!
echo 📋 Backend URL: http://localhost:3001
echo 🔍 Health check: http://localhost:3001/health
echo.
pause
