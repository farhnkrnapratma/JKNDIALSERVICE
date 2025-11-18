#!/bin/bash

# JKN Dial Service - Development Startup Script (Linux/Mac)
# Copyright (c) 2025 Global Palvion. All Rights Reserved.

set -e

echo "=================================================="
echo "   JKN Dial Service - Development Environment"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to get local IP address
get_local_ip() {
    # Try different methods to get IP
    if command -v hostname &> /dev/null; then
        IP=$(hostname -I 2>/dev/null | awk '{print $1}')
    fi
    
    if [ -z "$IP" ]; then
        IP=$(ip addr show | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1 | head -n1)
    fi
    
    if [ -z "$IP" ]; then
        IP=$(ifconfig 2>/dev/null | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n1)
    fi
    
    echo "$IP"
}

# Detect local IP
echo -e "${YELLOW}[1/5] Detecting local IP address...${NC}"
LOCAL_IP=$(get_local_ip)

if [ -z "$LOCAL_IP" ]; then
    echo -e "${RED}Error: Could not detect local IP address${NC}"
    echo "Please check your network connection or manually set IP in mobile/config.js"
    exit 1
fi

echo -e "${GREEN}✓ Local IP detected: $LOCAL_IP${NC}"
echo ""

# Update mobile config
echo -e "${YELLOW}[2/5] Updating mobile configuration...${NC}"
CONFIG_FILE="mobile/config.js"

if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Error: $CONFIG_FILE not found${NC}"
    exit 1
fi

# Backup original config
cp "$CONFIG_FILE" "$CONFIG_FILE.backup"

# Update API_BASE_URL with detected IP
sed -i.tmp "s|const API_BASE_URL = 'http://[0-9.]*:[0-9]*'|const API_BASE_URL = 'http://$LOCAL_IP:3000'|g" "$CONFIG_FILE"
rm -f "$CONFIG_FILE.tmp"

echo -e "${GREEN}✓ Config updated: API_BASE_URL = http://$LOCAL_IP:3000${NC}"
echo ""

# Check if dependencies are installed
echo -e "${YELLOW}[3/5] Checking dependencies...${NC}"

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "mobile/node_modules" ]; then
    echo "Installing mobile dependencies..."
    cd mobile && npm install && cd ..
fi

echo -e "${GREEN}✓ Dependencies OK${NC}"
echo ""

# Setup backend database if needed
echo -e "${YELLOW}[4/5] Setting up backend database...${NC}"

if [ ! -f "backend/prisma/dev.db" ]; then
    echo "Initializing database..."
    cd backend
    npx prisma generate
    npx prisma migrate dev --name init
    npm run prisma:seed
    cd ..
else
    cd backend
    npx prisma generate > /dev/null 2>&1
    cd ..
fi

echo -e "${GREEN}✓ Database ready${NC}"
echo ""

# Start services
echo -e "${YELLOW}[5/5] Starting services...${NC}"
echo ""
echo -e "${GREEN}Backend:${NC} http://localhost:3000"
echo -e "${GREEN}Backend (Network):${NC} http://$LOCAL_IP:3000"
echo -e "${GREEN}API Docs:${NC} http://localhost:3000/api/docs"
echo ""
echo -e "${YELLOW}Instructions:${NC}"
echo "1. Wait for Expo QR code to appear"
echo "2. Open Expo Go app on your phone"
echo "3. Scan the QR code"
echo "4. Make sure your phone is on the same WiFi network"
echo "5. In the app, dial *354# and press CALL"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""
echo "=================================================="
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    kill $(jobs -p) 2>/dev/null
    
    # Restore original config
    if [ -f "$CONFIG_FILE.backup" ]; then
        mv "$CONFIG_FILE.backup" "$CONFIG_FILE"
        echo -e "${GREEN}✓ Config restored${NC}"
    fi
    
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 5

# Start mobile
cd mobile
npm start &
MOBILE_PID=$!
cd ..

# Wait for both processes
wait $BACKEND_PID $MOBILE_PID
