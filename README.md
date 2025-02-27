<p align="center">
  <a href="https://fidesinnova.io/" target="blank"><img src="g-c-web-back.png" /></a>
</p>

# Step-by-step Installation Instructions for ZKP Explorer 

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.com/invite/NQdM6JGwcs" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://twitter.com/Fidesinnova" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>

To install the chain ZKP explorer components of the Fides Innova platform, you can follow the steps below. These instructions assume that you have a basic understanding of setting up development environments and are familiar with JavaScript, Node.js, and related technologies.


# Step 0. Create a Virtual Environment
```
sudo su
sudo apt update && sudo apt install python3-venv python3-full -y
sudo python3 -m venv web3env
source web3env/bin/activate
sudo pip install web3
pip install pymongo
pip install polynomial
pip install numpy sympy
pip install fastapi
python -c "import web3; print(web3.__version__)"
```

# Step A. Prepare operating system
First of all install Ubuntu 24.04 LTS on your server. 

## A.1. Install MongoDB
- Install MongoDB version 8.0
```
sudo apt update
sudo apt upgrade
sudo apt install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt update
sudo apt install -y mongodb-org
```

- Start the MongoDB service and test the database
```
sudo systemctl start mongod
sudo systemctl start mongod.service
sudo systemctl enable mongod
```

- Note: To manage the MongoDB service you can use the following commands
```
sudo systemctl status mongod
sudo systemctl stop mongod
sudo systemctl start mongod
sudo systemctl restart mongod
sudo systemctl disable mongod
sudo systemctl enable mongod
```

- Install mongosh
```bash
sudo apt-get install -y mongodb-mongosh
```

- Verify mongosh Installation
```bash
mongosh --version
```

- Add the following to your \`/etc/mongod.conf\` file to enable replica set mode:
```yaml
replication:
  replSetName: "rs0"
```

- Restart MongoDB after updating the configuration:
```bash
sudo systemctl restart mongod
```

- Run MongoDB shell (\`mongosh\`) to initialize the replica set:
```bash
mongosh
```
Then, initialize the replica set with the primary node:
```javascript
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "127.0.0.1:27017" }
  ]
});
```

## A.2. Install nginx web server 
```
sudo apt update
sudo apt -y install nginx
```
## A.3. Install Certbot
- First, stop the `nginx`
```
sudo systemctl stop nginx
```
- Now, install the `certbot`
```
sudo apt-get update
sudo apt-get install certbot
```
- To manually obtain an SSL certificate for your domains without directly modifying your web server configurations, run the following command:
```
sudo certbot certonly --standalone --preferred-challenges http
```
-  Make sure to create the certificate for domain and all subdomains
After running the command, enter your web app domain like this:
```
explorer.YOUR_DOMAIN
```
- The 'certbot' command generates `fullchain.pem` and `privkey.pem` in  `/etc/letsencrypt/explorer.YOURDOMAIN`
- Create the `ssl` folder inside `/etc/nginx` 
```
sudo mkdir /etc/nginx/ssl
```
- Copy both `fullchain.pem` and `privkey.pem` into `/etc/nginx/ssl`. 
```
sudo cp /etc/letsencrypt/live/explorer.YOUR_DOMAIN/fullchain.pem /etc/nginx/ssl/
sudo cp /etc/letsencrypt/live/explorer.YOUR_DOMAIN/privkey.pem /etc/nginx/ssl/
```

<!-- - Required commands for SSL by Certbot:
  - Check the expiration date of your SSL certificates:
  ```
  sudo certbot certificates
  ```
  - Renew your SSL certificate:
  ```
  sudo certbot renew
  ``` -->

## A.4. Update the `nginx.conf` file
- Replace the following configuration in your `nginx.conf` file located at `/etc/nginx/nginx.conf`.
```
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
	worker_connections 768;
	# multi_accept on;
}

http {
	##
	# Basic Settings
	##

	sendfile on;
	tcp_nopush on;
	tcp_nodelay on;
	keepalive_timeout 65;
	types_hash_max_size 2048;
	# server_tokens off;

	# server_names_hash_bucket_size 64;
	# server_name_in_redirect off;

	
	default_type application/octet-stream;
	include /etc/nginx/mime.types;
	##
	# SSL Settings
	##

	ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
	ssl_prefer_server_ciphers on;

	ssl_certificate  /etc/nginx/ssl/fullchain.pem;
	ssl_certificate_key /etc/nginx/ssl/privkey.pem;

	##
	# Logging Settings
	##

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	##
	# Gzip Settings
	##

	gzip on;

	server {
		listen 443 ssl;
		listen [::]:443 ssl;

		index index.html index.htm;
		server_name explorer.YOUR_DOMAIN;

		root /var/www/html/wikifidesdoc/site;

		add_header 'Access-Control-Allow-Credentials' 'true';
		add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
		add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

		# This section is for user Web App on port 4000
		location / {
			proxy_set_header Authorization $http_authorization;
			proxy_pass_header Authorization;
			add_header Access-Control-Allow-Origin '*';
			add_header Access-Control-Allow-Headers '*';
			proxy_pass https://localhost:4000;
		}

		# This section is for Server Backend on port 3000
		location /app {
			proxy_pass http://localhost:3000;
			add_header Access-Control-Allow-Origin *;
		}
	}
}

```
- Please update YOUR_DOMAIN with your actual domain name in explorer.YOUR_DOMAIN.
  
- Restart Nginx 
```
sudo systemctl restart nginx
```

## A.5. Instal Node.js and NestJS
```
sudo apt update
sudo apt install nodejs
sudo apt install npm
sudo npm install -g n
sudo n 20.9.0
sudo npm i -g @nestjs/cli 
```

## A.6. Configure Firewall 
- Install `ufw`, allow OpenSSH connection, allow nginx connection. Then, allow ports 3000, and 4000 on the server for Mobile App, and Web App, respectively. 
```
sudo apt install ufw
sudo ufw allow OpenSSH
sudo ufw allow 'nginx full'
sudo ufw allow 3000
sudo ufw allow 4000
```
- Enable the firewall
```
sudo ufw enable
```
- Check the firewall status
```
sudo ufw status
```

## A.7. Install PM2
```
sudo npm install -g pm2
```

## A.8. Clone the project
- Install `git`
```
sudo apt install git
```
- Clone the project
```
cd /home
sudo git clone https://github.com/FidesInnova/zkp-explorer.git
```

# Step B. Prepare the app
## B.1. Backend configurations
- In project root folder, create `.env` file and edit parameters based on your node URL info
```
cd /home/zkp-explorer/backend
sudo nano .env
```
- Inside the `.env` file, paste the following parameters. Note that your app URL is "explorer.YOUR_DOMAIN"  (e.g., "explorer.motioncertified.online").

```
NODE_ID='explorer2.fidesinnova.io' # Set this with your node URL (e.g., "explorer.motioncertified.online")
NODE_NAME='Exlorer 2 Fides Innova' Set this with your node name (e.g., "Fides Innova Chain Explorer")
SWAGGER_LOCAL_SERVER='http://localhost:5000'

# Rpc Url
RPC_URL='https://fidesf1-rpc.fidesinnova.io'

# Admin Wallet Private Key
ADMIN_WALLET_PRIVATE_KEY='xxxxx'

# Server Configuration
HOST_PROTOCOL='https://'
HOST_NAME_OR_IP='explorer2.fidesinnova.io'
HOST_PORT=3000
HOST_SUB_DIRECTORY='app'

MONGO_CONNECTION='mongodb://127.0.0.1:27017/fidesinnova'

# Multer Configuration     # Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
MULTER_MEDIA_PATH='./storages/resources'
MULTER_MEDIA_SIZE=10000000    # 10 MB
```

Update these parameters:
```
NODE_ID="your-node-url" # Set this to your node URL
NODE_NAME="your-node-name"
HOST_NAME_OR_IP='explorer.YOUR_DOMAIN'
```
-------------------------------------------------------------------------------------------------

# Step C. Install Explorer Web App

## C.1. Prepare app configuration
In project root folder, create `.env` file and edit parameters based on your node URL info
```
cd /home/zkp-explorer/frontend
sudo nano .env
```
Inside the `.env` file, past the parameters.
*  Make sure to add your explorer address to the config.
```
REACT_APP_API_BASE_URL='https://<EXPLORER>/app/v1/'
```
In Runner_webapp folder, create `.env` file and edit parameters based on your node URL info
```
cd /home/zkp-explorer/frontend/Runner_webapp
sudo nano .env
```
Inside the `.env` file, past the parameters.
```
PORT=4000
```
## C.3. Build and Execute
To automate the setup and build processes for both the backend and frontend applications, run the `initial_setup.sh` script located in the root directory of the project. This script will handle building both the backend and frontend applications and configuring PM2 services automatically. If you are installinng the exlorer on an EC2 AWS instance, use the following command.
   ```
   cd /home/zkp-explorer/
   sudo chmod +x initial_setup_backfrontend.sh
   sudo chmod +x initial_setup_python.sh
   sudo ./initial_setup_backfrontend.sh
   ./initial_setup_python.sh
   ```
  Note: the last command must be used without 'sudo'.
## Maintenance: ZKP Explorer Code or Config Change
- Every time Fidesinnova core development team push a new version of the code on GitHub.
```
cd /home/zkp-explorer/
sudo git fetch
sudo git pull
```
- Every time you pull a new version of the server code from GitHub or you make a change to any `.env` files in the system, you should apply the changes to your production server via update script.
```
cd /home/zkp-explorer/
sudo chmod +x update.sh
sudo ./update.sh
```

- Useful commands for troubleshooting
```
# to make file writable and other permissions :
chmod +rwx chainthreed

# see busy ports
sudo netstat -tulpn | grep LISTEN

# something similar to the top one
sudo ss -ltn

# kill a port
sudo kill -9 $(sudo lsof -t -i:6060)

# see firewall status
systemctl status ufw

# restart the firewall
systemctl restart ufw

# move something into something else:
mv source target

# delete a directory or file
rm -rf directoryName

pm2 list                               # Show running processes  
pm2 show my-app                        # Show details of a specific process  
pm2 stop my-app                        # Stop a process  
pm2 restart my-app                     # Restart a process  
pm2 delete my-app                      # Remove a process from PM2
pm2 logs                               # Show logs of all processes  
```

- You can install packages in a virtual enviroment
```
sudo su
sudo apt update && sudo apt install python3-venv python3-full -y
sudo python3 -m venv web3env
source web3env/bin/activate
pip install web3
pip install pymongo
pip install polynomial
pip install numpy sympy
pip install fastapi
python -c "import web3; print(web3.__version__)"

deactivate
```

- Python files description
  - monitor_blocks.py: write the newly created blocks to blockchain_data
  - polynomial.py: a math library to be used by verifier.py
  - SC-commitment.py: read commitment from the protocol smart contract and write into the database
  - SC-service-device.py: read the published services from the protocol smart contract and shared devices into the database.
  - SC-zkp.py: read the zkp from the protocol smart contract and wrtie them into the database.
  - verifier.py: bring the 'fastapi' module up to provide the 'app' api for zkp verification purposes.
