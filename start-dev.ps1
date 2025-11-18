# JKN Dial Service - Development Startup Script (Windows PowerShell)
# Copyright (c) 2025 Global Palvion. All Rights Reserved.

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   JKN Dial Service - Development Environment" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Function to get local IP address
function Get-LocalIP {
    try {
        # Get active network adapters with IPv4 addresses
        $ip = Get-NetIPAddress -AddressFamily IPv4 | 
              Where-Object { 
                  $_.IPAddress -notlike "127.*" -and 
                  $_.IPAddress -notlike "169.254.*" -and
                  $_.PrefixOrigin -eq "Dhcp" -or $_.PrefixOrigin -eq "Manual"
              } | 
              Select-Object -First 1 -ExpandProperty IPAddress
        
        if (-not $ip) {
            # Fallback method using ipconfig
            $ipconfig = ipconfig | Select-String "IPv4" | Select-Object -First 1
            if ($ipconfig) {
                $ip = $ipconfig.ToString().Split(":")[1].Trim()
            }
        }
        
        return $ip
    }
    catch {
        return $null
    }
}

# Detect local IP
Write-Host "[1/5] Detecting local IP address..." -ForegroundColor Yellow
$LocalIP = Get-LocalIP

if (-not $LocalIP) {
    Write-Host "Error: Could not detect local IP address" -ForegroundColor Red
    Write-Host "Please check your network connection or manually set IP in mobile/config.js" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Local IP detected: $LocalIP" -ForegroundColor Green
Write-Host ""

# Update mobile config
Write-Host "[2/5] Updating mobile configuration..." -ForegroundColor Yellow
$ConfigFile = "mobile\config.js"

if (-not (Test-Path $ConfigFile)) {
    Write-Host "Error: $ConfigFile not found" -ForegroundColor Red
    exit 1
}

# Backup original config
Copy-Item $ConfigFile "$ConfigFile.backup" -Force

# Read config file
$content = Get-Content $ConfigFile -Raw

# Update API_BASE_URL with detected IP
$pattern = "const API_BASE_URL = 'http://[0-9.]+:[0-9]+'"
$replacement = "const API_BASE_URL = 'http://$LocalIP:3000'"
$content = $content -replace $pattern, $replacement

# Write updated config
Set-Content -Path $ConfigFile -Value $content -NoNewline

Write-Host "✓ Config updated: API_BASE_URL = http://${LocalIP}:3000" -ForegroundColor Green
Write-Host ""

# Check if dependencies are installed
Write-Host "[3/5] Checking dependencies..." -ForegroundColor Yellow

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "Installing backend dependencies..."
    Push-Location backend
    npm install
    Pop-Location
}

if (-not (Test-Path "mobile\node_modules")) {
    Write-Host "Installing mobile dependencies..."
    Push-Location mobile
    npm install
    Pop-Location
}

Write-Host "✓ Dependencies OK" -ForegroundColor Green
Write-Host ""

# Setup backend database if needed
Write-Host "[4/5] Setting up backend database..." -ForegroundColor Yellow

if (-not (Test-Path "backend\prisma\dev.db")) {
    Write-Host "Initializing database..."
    Push-Location backend
    npx prisma generate
    npx prisma migrate dev --name init
    npm run prisma:seed
    Pop-Location
}
else {
    Push-Location backend
    npx prisma generate | Out-Null
    Pop-Location
}

Write-Host "✓ Database ready" -ForegroundColor Green
Write-Host ""

# Start services
Write-Host "[5/5] Starting services..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Green
Write-Host "Backend (Network): " -NoNewline
Write-Host "http://${LocalIP}:3000" -ForegroundColor Green
Write-Host "API Docs: " -NoNewline
Write-Host "http://localhost:3000/api/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "1. Wait for Expo QR code to appear"
Write-Host "2. Open Expo Go app on your phone"
Write-Host "3. Scan the QR code"
Write-Host "4. Make sure your phone is on the same WiFi network"
Write-Host "5. In the app, dial *354# and press CALL"
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Function to cleanup on exit
function Cleanup {
    Write-Host ""
    Write-Host "Shutting down services..." -ForegroundColor Yellow
    
    # Stop all jobs
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    
    # Restore original config
    if (Test-Path "$ConfigFile.backup") {
        Move-Item "$ConfigFile.backup" $ConfigFile -Force
        Write-Host "✓ Config restored" -ForegroundColor Green
    }
    
    exit 0
}

# Register cleanup on Ctrl+C
Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

try {
    # Start backend
    Write-Host "Starting backend server..." -ForegroundColor Cyan
    $backendJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        Set-Location backend
        npm run dev
    }
    
    # Wait for backend to start
    Write-Host "Waiting for backend to initialize..." -ForegroundColor Cyan
    Start-Sleep -Seconds 5
    
    # Start mobile
    Write-Host "Starting Expo development server..." -ForegroundColor Cyan
    $mobileJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        Set-Location mobile
        npm start
    }
    
    # Monitor jobs and display output
    while ($true) {
        # Check if jobs are still running
        if ($backendJob.State -eq "Failed" -or $mobileJob.State -eq "Failed") {
            Write-Host "One of the services failed. Check logs above." -ForegroundColor Red
            break
        }
        
        # Receive and display output from backend
        $backendOutput = Receive-Job -Job $backendJob
        if ($backendOutput) {
            Write-Host $backendOutput
        }
        
        # Receive and display output from mobile
        $mobileOutput = Receive-Job -Job $mobileJob
        if ($mobileOutput) {
            Write-Host $mobileOutput
        }
        
        Start-Sleep -Milliseconds 500
    }
}
catch {
    Write-Host "Error occurred: $_" -ForegroundColor Red
}
finally {
    Cleanup
}
