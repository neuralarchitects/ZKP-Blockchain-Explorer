#!/bin/bash

# Navigate to the backend directory
cd backend || { echo "Error: Failed to navigate to backend directory."; exit 1; }

echo "Installing new packages for backend via npm..."
if sudo npm install; then
    echo "Packages for backend installed successfully."
else
    echo "Error: Failed to install backend packages."
    exit 1
fi

echo "Building backend..."
if sudo npm run build; then
    echo "Backend build completed successfully."
else
    echo "Error: Backend build failed."
    exit 1
fi

# Go back to the base directory
cd ../ || { echo "Error: Failed to return to base directory."; exit 1; }

# Build and move for frontend
echo "Navigating to frontend..."
cd frontend || { echo "Error: Failed to navigate to frontend directory."; exit 1; }

echo "Installing new packages for frontend via npm..."
if sudo npm install; then
    echo "Packages for frontend installed successfully."
else
    echo "Error: Failed to install frontend packages."
    exit 1
fi

echo "Building frontend..."
if sudo npm run build; then
    echo "frontend build completed successfully."
    echo "Cleaning up Runner_webapp frontend folder..."
    if [ ! -d "Runner_webapp/frontend" ]; then
        echo "Frontend folder does not exist. Creating it..."
        mkdir "Runner_webapp/frontend"
    else
        echo "Frontend folder exists. Cleaning it up..."
        rm -rf "Runner_webapp/frontend"
        mkdir "Runner_webapp/frontend"
    fi
    echo "Moving frontend files to Runner_webapp/frontend..."
    mv build/* Runner_webapp/frontend/ || { echo "Error: Failed to move frontend files."; exit 1; }
    echo "frontend files moved successfully."
else
    echo "Error: frontend build failed."
    exit 1
fi


echo "Installing new packages for frontend/Runner_webapp..."
cd Runner_webapp || { echo "Error: Failed to navigate to Runner_webapp directory."; exit 1; }
if sudo npm install; then
    echo "Packages of Runner_webapp for frontend installed successfully."
else
    echo "Error: Runner_webapp package installation failed."
    exit 1
fi

# Go back to the base directory
cd ../../ || { echo "Error: Failed to return to base directory."; exit 1; }

# Start Backend Server
echo "Navigating to backend directory and starting Backend Server..."
cd backend || { echo "Error: Failed to navigate to backend directory."; exit 1; }
sudo pm2 start dist/main.js --name "Backend Server" || { echo "Error: Failed to start Backend Server."; exit 1; }

# Start Web App
echo "Navigating to frontend directory and starting Web App..."
cd ../frontend/Runner_webapp || { echo "Error: Failed to navigate to frontend directory."; exit 1; }
sudo pm2 start main.js --name "Web App" || { echo "Error: Failed to start Web App."; exit 1; }

cd ../../ || { echo "Error: Failed to return to base directory."; exit 1; }

