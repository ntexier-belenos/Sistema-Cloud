#!/bin/bash

# Display welcome message
echo "🛡️ Welcome to Sistema-Cloud Development Environment 🛡️"
echo "---------------------------------------------------"

# Function to check if a process is running on a specific port
check_port() {
    local port=$1
    local process_name=$2
    if curl -s http://localhost:$port > /dev/null; then
        echo "✅ $process_name is running on port $port"
        return 0
    else
        echo "❌ $process_name is not running on port $port"
        return 1
    fi
}

# Function to open the application in the browser
open_app() {
    local port=${1:-3000}
    echo "🌐 Opening Sistema-Cloud in your browser on port $port..."
    "$BROWSER" "http://localhost:$port" &
}

# Check if the frontend is already running on port 3000 or 3001
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is already running on port 3000."
    open_app 3000
elif curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Frontend is already running on port 3001."
    open_app 3001
else
    # Start frontend
    echo "🚀 Starting Frontend (React TypeScript)..."
    cd /workspace/frontend
    # Automatically answer yes to the port change prompt if needed
    echo "y" | npm start &
    FRONTEND_PID=$!

    # Wait for the frontend to start (more reliable method)
    echo "⏳ Waiting for the frontend to start..."
    # Try port 3000 first, then 3001 if 3000 is busy
    PORT=3000
    MAX_WAIT=30
    COUNTER=0
    
    while ! curl -s http://localhost:$PORT > /dev/null && [ $COUNTER -lt $MAX_WAIT ]; do
        sleep 1
        COUNTER=$((COUNTER+1))
        # After a few seconds, try port 3001
        if [ $COUNTER -eq 10 ]; then
            PORT=3001
            echo "⏳ Trying alternate port 3001..."
        fi
    done

    # Check if frontend is running on either port
    if check_port $PORT "Frontend"; then
        echo "💻 Frontend is ready on port $PORT!"
        open_app $PORT
    elif [ $PORT -eq 3001 ] && check_port 3000 "Frontend"; then
        echo "💻 Frontend is ready on port 3000!"
        open_app 3000
    elif [ $PORT -eq 3000 ] && check_port 3001 "Frontend"; then
        echo "💻 Frontend is ready on port 3001!"
        open_app 3001
    else
        echo "❗ Frontend failed to start. Check logs for errors."
    fi
fi

# Keep the script running to maintain the processes
echo "📝 Development environment is running. Press Ctrl+C to stop."
wait
