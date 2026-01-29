@echo off
echo ===================================================
echo   FGC PLATFORM - NUCLEAR RESTART (FLUSH CONFIGS)
echo ===================================================

echo 1. KILLING EVERYTHING...
taskkill /F /IM node.exe >nul 2>nul
taskkill /F /IM uvicorn.exe >nul 2>nul
taskkill /F /IM python.exe >nul 2>nul

echo.
echo 2. STARTING BACKEND (127.0.0.1:8000)...
start "FGC Backend" cmd /k "cd backend && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo.
echo 3. WAITING FOR BACKEND (5s)...
timeout /t 5 /nobreak >nul

echo.
echo 4. STARTING FRONTEND (Force New Port)...
:: Using specific host to avoid localhost ambiguity
start "FGC Frontend" cmd /k "npm run dev -- --host 127.0.0.1"

echo.
echo DONE! 
echo Please close all old browser tabs.
echo Open the new link visible in the 'FGC Frontend' window.
pause
