@echo off
echo 🚀 Starting Acadira Production Environment...
echo.

echo 📦 Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo 🔧 Starting backend server...
start "Acadira Backend" cmd /k "npm start"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo 🌐 Starting frontend...
cd ..
start "Acadira Frontend" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting!
echo.
echo 📋 Access your application:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo    Health:   http://localhost:3001/health
echo.
echo 💡 To test production Cashfree integration:
echo    1. Go to http://localhost:3000/subscribe
echo    2. Fill in the form
echo    3. Click "Pay with Cashfree"
echo    4. It will now use REAL Cashfree API!
echo.
pause
