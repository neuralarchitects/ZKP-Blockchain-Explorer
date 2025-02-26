
# Build the frontend
echo "Building the frontend..."
cd frontend
sudo npm i
sudo npm run build

# Build the backend
echo "Building the backend..."
cd ../backend
sudo npm run build

# Remove old frontend files and move the new build files
echo "Deploying the frontend..."
sudo rm -rf ../frontend/Runner_webapp/frontend
sudo mkdir ../frontend/Runner_webapp/frontend
sudo mv ../frontend/build/* ../frontend/Runner_webapp/frontend/

# Restart all pm2 processes
echo "Restarting pm2 processes..."
sudo pm2 restart all

echo "Update complete!"
