#!/bin/bash

# JKN Dial Service - Development Startup Script (Linux/Mac)
# Local JSON-based Data - No Backend Required
# Copyright (c) 2025 Global Palvion. All Rights Reserved.

set -e

echo "=================================================="
echo "   JKN Dial Service - Development Environment"
echo "   (Local JSON-based Data - No Backend Required)"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if dependencies are installed
echo -e "${YELLOW}[1/2] Checking dependencies...${NC}"

if [ ! -d "mobile/node_modules" ]; then
    echo "Installing mobile dependencies..."
    cd mobile && npm install && cd ..
fi

echo -e "${GREEN}✓ Dependencies OK${NC}"
echo ""

# Start mobile
echo -e "${YELLOW}[2/2] Starting mobile development server...${NC}"
echo ""
echo -e "${GREEN}Mobile App:${NC} Expo development server"
echo -e "${GREEN}Data Mode:${NC} Local JSON-based"
echo ""
echo -e "${YELLOW}Instructions:${NC}"
echo "1. Wait for Expo QR code to appear"
echo "2. Open Expo Go app on your phone"
echo "3. Scan the QR code"
echo "4. In the app, dial *354# and press CALL"
echo "5. All data is loaded from local JSON files"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the app${NC}"
echo ""
echo "=================================================="
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start mobile
cd mobile
npm start

