# Restart Backend Script
Write-Host "Stopping any running uvicorn processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "python" -and $_.CommandLine -like "*uvicorn*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Starting backend server..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "uvicorn" -ArgumentList "app.main:app", "--reload", "--port", "8000" -WorkingDirectory "C:\Users\Kritika Kandhari\OneDrive\Desktop\FGCMM-benzura-main\backend" -PassThru -NoNewWindow
Write-Host "Backend started with PID: $($backendProcess.Id)" -ForegroundColor Cyan
Write-Host "Please wait 10 seconds for the server to initialize, then try logging in again." -ForegroundColor White
