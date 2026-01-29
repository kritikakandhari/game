@echo off
set HTTP_PROXY=
set HTTPS_PROXY=
set http_proxy=
set https_proxy=

echo ===================================================
echo   FGC FINAL FIX - BIND ALL INTERFACES
echo ===================================================

echo 1. Stopping Old Servers...
taskkill /F /IM node.exe >nul 2>nul
taskkill /F /IM uvicorn.exe >nul 2>nul
taskkill /F /IM python.exe >nul 2>nul

echo.
echo 2. STARTING BACKEND LOGGING...
:: Starting on 0.0.0.0 to avoid localhost/127.0.0.1 confusion
start "FGC Backend" cmd /k "cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo 3. Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo.
echo 4. STARTING FRONTEND...
:: Host 0.0.0.0 to match backend availability
start "FGC Frontend" cmd /k "npm run dev -- --host 0.0.0.0"

echo.
echo DONE!
echo Please use the NEW LINK that appears (likely http://localhost:5173 or 5174)
pause
