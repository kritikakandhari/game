@echo off
echo Starting FGC Money Match Platform...

:: Check if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    pause
    exit /b
)

:: Kill existing processes
echo stopping existing servers...
taskkill /F /IM node.exe >nul 2>nul
taskkill /F /IM uvicorn.exe >nul 2>nul
taskkill /F /IM python.exe >nul 2>nul

echo.
echo Starting Backend (Port 8000)...
start "FGC Backend" cmd /k "cd backend && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo.
echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend (Port 5173)...
start "FGC Frontend" cmd /k "npm run dev"

echo.
echo DONE! The app should open shortly.
echo If it doesn't open automatically, visit: http://localhost:5173/login
echo.
pause
