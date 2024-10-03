#!/bin/bash

# Navigate to the FidesInnova_Explorer directory
cd /home/FidesInnova_Explorer

# Pull the latest changes from the repository
echo "Pulling the latest code..."
git pull

# Build the frontend
echo "Building the frontend..."
cd frontend
npm run build

# Build the backend
echo "Building the backend..."
cd ../backend
npm run build

# Remove old frontend files and move the new build files
echo "Deploying the frontend..."
rm -rf /home/Runner_webapp/frontend
mkdir /home/Runner_webapp/frontend
mv /home/FidesInnova_Explorer/frontend/build/* /home/Runner_webapp/frontend/

# Restart all pm2 processes
echo "Restarting pm2 processes..."
pm2 restart all
pm2 save

echo "Update complete!"