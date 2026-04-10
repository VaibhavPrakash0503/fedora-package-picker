#!/bin/bash

echo "🚀 Fedora Package Picker - Quick Start"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo ""
    echo "Steps:"
    echo "1. Copy .env.example to .env"
    echo "   cp .env.example .env"
    echo ""
    echo "2. Edit .env and add your Neo4j Aura credentials"
    echo "   - Get credentials from: https://neo4j.com/cloud/aura/"
    echo ""
    echo "3. Run this script again"
    exit 1
fi

echo "✅ .env file found"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "🗄️  Seeding database..."
npm run seed

echo ""
echo "✅ All set!"
echo ""
echo "To start the server:"
echo "  npm start"
echo ""
echo "Then visit: http://localhost:3000"
