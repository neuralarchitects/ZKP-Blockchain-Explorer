echo "Navigating to python-files directory and starting Python Sources..."

sudo apt update && sudo apt install python3-venv python3-full -y
sudo python3 -m venv web3env
source web3env/bin/activate
pip install web3 pymongo numpy sympy fastapi uvicorn

echo "Starting the source files ..."
sudo pm2 start python-files/monitor_blocks.py --name "monitor_blocks.py" --interpreter web3env/bin/python3
sudo pm2 start python-files/SC-commitment.py --name "SC-commitment.py" --interpreter web3env/bin/python3
sudo pm2 start python-files/SC-service-device.py --name "SC-service-device.py" --interpreter web3env/bin/python3
sudo pm2 start python-files/SC-zkp.py --name "SC-zkp.py" --interpreter web3env/bin/python3

echo "Installing ZKP verifier python libraries and starting the source ..."
cd python-files || { echo "Error: Failed to navigate to python-files directory."; exit 1; }
pm2 start "uvicorn verifier:app --host 0.0.0.0 --port 7000" --name Verifier

# Save PM2 process list and ensure PM2 startup
echo "Saving PM2 process list and setting up PM2 startup..."
sudo pm2 startup || { echo "Error: Failed to setup PM2 startup."; exit 1; }
sudo pm2 save || { echo "Error: Failed to save PM2 processes."; exit 1; }

echo "All services started successfully."
