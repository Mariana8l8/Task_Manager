#!/bin/bash

# Task Manager - Quick Setup Script for macOS/Linux

echo "🚀 Task Manager - Setup Script"
echo "==============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Check if docker is available
if command -v docker &> /dev/null; then
    echo "✅ Docker found - Setting up MongoDB with Docker..."
    docker-compose up -d
    echo "⏳ Waiting for MongoDB to be ready..."
    sleep 5
    echo "✅ MongoDB is running on port 27017"
else
    echo "⚠️  Docker not found. MongoDB must be installed locally or use MongoDB Atlas"
    echo "   See MONGODB_SETUP.md for instructions"
fi

echo ""
echo "📦 Installing dependencies..."

# Server
cd server || exit
npm install
echo "✅ Server dependencies installed"
cd ..

# Client
cd client/client || exit
npm install
echo "✅ Client dependencies installed"
cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Open terminal 1: cd server && npm run dev"
echo "  2. Open terminal 2: cd client/client && npm run dev"
echo "  3. Visit http://localhost:5173"
echo ""
echo "If MongoDB fails to connect:"
echo "  - See MONGODB_SETUP.md for setup instructions"
echo "  - Try MongoDB Atlas (free cloud): https://www.mongodb.com/cloud/atlas"
