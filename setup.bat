@echo off
REM Task Manager - Quick Setup Script for Windows

echo 🚀 Task Manager - Setup Script
echo ===============================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found

echo.
echo 📦 Installing dependencies...
echo.

REM Server
echo Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Server installation failed
    pause
    exit /b 1
)
echo ✅ Server dependencies installed
cd ..

REM Client
echo Installing client dependencies...
cd client\client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Client installation failed
    pause
    exit /b 1
)
echo ✅ Client dependencies installed
cd ..\..

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo   1. Open PowerShell Terminal 1: cd server; npm run dev
echo   2. Open PowerShell Terminal 2: cd client\client; npm run dev
echo   3. Visit http://localhost:5173
echo.
echo ⚠️  MongoDB Setup Required:
echo   - See MONGODB_SETUP.md for detailed instructions
echo   - Easiest option: Download MongoDB Community Edition for Windows
echo   - Or use free MongoDB Atlas: https://www.mongodb.com/cloud/atlas
echo.
pause
