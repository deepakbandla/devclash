#!/bin/bash

# DevClash Project - Quick Start Script
# Run this script to start both backend and frontend

echo "🚀 DevClash - Quick Start"
echo "========================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js is installed: $(node -v)"
echo ""

# Start backend in background
echo "📚 Starting Backend Server..."
cd backend
npm install &> /dev/null
npm run dev &
BACKEND_PID=$!
echo "✅ Backend Process ID: $BACKEND_PID"
echo ""

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "🎨 Starting Frontend Development Server..."
cd ../frontend
npm install &> /dev/null
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend Process ID: $FRONTEND_PID"
echo ""

echo "========================"
echo "🎉 DevClash is Starting!"
echo "========================"
echo ""
echo "📍 Frontend: http://localhost:5173 (or next available port)"
echo "📍 Backend:  http://localhost:5001"
echo ""
echo "💡 Tip: Open http://localhost:5173 in your browser"
echo ""
echo "To stop both servers, press Ctrl+C"
echo ""

# Keep the script running
wait
