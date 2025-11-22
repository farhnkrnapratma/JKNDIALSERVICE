# JKN Dial Service - Development Startup Script (Windows PowerShell)
# Local JSON-based Data - No Backend Required
# Copyright (c) 2025 Global Palvion. All Rights Reserved.

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   JKN Dial Service - Development Environment" -ForegroundColor Cyan
Write-Host "   (Local JSON-based Data - No Backend Required)" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if dependencies are installed
Write-Host "[1/2] Checking dependencies..." -ForegroundColor Yellow

if (-not (Test-Path "mobile\node_modules")) {
    Write-Host "Installing mobile dependencies..."
    Push-Location mobile
    npm install
    Pop-Location
}

Write-Host "✓ Dependencies OK" -ForegroundColor Green
Write-Host ""

# Start mobile
Write-Host "[2/2] Starting mobile development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Mobile App: " -NoNewline
Write-Host "Expo development server" -ForegroundColor Green
Write-Host "Data Mode: " -NoNewline
Write-Host "Local JSON-based" -ForegroundColor Green
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "1. Wait for Expo QR code to appear"
Write-Host "2. Open Expo Go app on your phone"
Write-Host "3. Scan the QR code"
Write-Host "4. In the app, dial *354# and press CALL"
Write-Host "5. All data is loaded from local JSON files"
Write-Host ""
Write-Host "Press Ctrl+C to stop the app" -ForegroundColor Yellow
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Function to cleanup on exit
function Cleanup {
    Write-Host ""
    Write-Host "Shutting down services..." -ForegroundColor Yellow
    
    # Stop all jobs
    Get-Job | Stop-Job -ErrorAction SilentlyContinue
    Get-Job | Remove-Job -ErrorAction SilentlyContinue
    
    exit 0
}

# Register cleanup on Ctrl+C
$null = Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

try {
    # Start mobile
    Write-Host "Starting Expo development server..." -ForegroundColor Cyan
    $mobileJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        Set-Location mobile
        npm start
    }
    
    # Monitor job and display output
    while ($true) {
        # Check if job is still running
        if ($mobileJob.State -eq "Failed") {
            Write-Host "The service failed. Check logs above." -ForegroundColor Red
            break
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

