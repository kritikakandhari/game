# Force Restart Backend Script
Write-Host "Searching for process on port 8000..." -ForegroundColor Cyan

$port = 8000
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($connections) {
    foreach ($conn in $connections) {
        $pid_to_kill = $conn.OwningProcess
        Write-Host "Found process ID $pid_to_kill listening on port $port. Killing it..." -ForegroundColor Yellow
        Stop-Process -Id $pid_to_kill -Force -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "No process found on port $port." -ForegroundColor Green
}

# Also kill any rogue python uvicorn processes just in case
Get-Process | Where-Object {$_.ProcessName -eq "python" -and $_.CommandLine -like "*uvicorn*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Starting backend server on 127.0.0.1..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "uvicorn" -ArgumentList "app.main:app", "--reload", "--host", "127.0.0.1", "--port", "8000" -WorkingDirectory "C:\Users\Kritika Kandhari\OneDrive\Desktop\FGCMM-benzura-main\backend" -PassThru -NoNewWindow
Write-Host "Backend started with PID: $($backendProcess.Id)" -ForegroundColor Cyan
Write-Host "Please wait 10 seconds for the server to initialize." -ForegroundColor White
