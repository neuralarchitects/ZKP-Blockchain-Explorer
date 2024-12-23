import pymongo
import random
import time
from datetime import datetime

# MongoDB connection details
mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
db = mongo_client["smartcontract_db"]  # Use your database name
collection = db["services_devices_smartcontract"]  # Use your collection name

# Function to generate random transaction hash (64-character hex string)
def generate_transaction_hash():
    return ''.join(random.choices('abcdef0123456789', k=64))

# Function to generate random gas fee
def generate_gas_fee():
    return random.randint(2000000000000000, 3000000000000000)

# Function to generate random node ID (hex string)
def generate_node_id():
    return ''.join(random.choices('abcdef0123456789', k=24))

# Function to generate random service ID (hex string)
def generate_service_id():
    return ''.join(random.choices('abcdef0123456789', k=24))

# Function to generate random URL
def generate_image_url():
    return f"https://example.com/image{random.randint(1, 100)}.jpg"

# Function to generate random name and description
def generate_name_description():
    names = ["Security Service", "Temperature Control", "Lighting System", "Surveillance"]
    descriptions = ["Monitors and controls temperature.", "Provides 24/7 security.", "Manages lighting.", "Advanced surveillance system."]
    return random.choice(names), random.choice(descriptions)

# Function to return specific devices list
def generate_devices():
    return ["MULTI_SENSOR_1"]

# Function to generate random price
def generate_price():
    return round(random.uniform(50, 500), 2)

# Function to generate random service type
def generate_service_type():
    return random.choice(["Installation", "Maintenance", "Monitoring"])

# Function to generate random program
def generate_program():
    programs = ["Basic", "Advanced", "Premium"]
    return random.choice(programs)

# Function to generate random dates
def generate_dates():
    creation_date = datetime.utcnow().isoformat()
    published_date = (datetime.utcnow().replace(microsecond=0)).isoformat()
    return creation_date, published_date

# Function to generate random record
def generate_random_record():
    name, description = generate_name_description()
    creation_date, published_date = generate_dates()

    return {
        "nodeId": generate_node_id(),
        "serviceId": generate_service_id(),
        "name": name,
        "description": description,
        "serviceType": generate_service_type(),
        "devices": generate_devices(),
        "installationPrice": generate_price(),
        "execcutionPrice": generate_price(),
        "imageURL": generate_image_url(),
        "program": generate_program(),
        "creationDate": creation_date,
        "publishedDate": published_date,
        "eventType": "ServiceCreated",
        "transactionHash": generate_transaction_hash(),
        "to": "0xCFC00106081c541389D449183D4EEADF5d895D37",
        "from": "0xC69F809f7dF222626Ea8e936C77D4A54a223034F",
        "gasFee": generate_gas_fee(),
        "transactionTime": datetime.utcnow().isoformat()
    }

# Insert 300 random records with a 3-second delay between each insertion
for _ in range(10):
    record = generate_random_record()
    collection.insert_one(record)
    print(f"Inserted record: {record['transactionHash']}")
    time.sleep(3)  # 3-second delay between each insertion

print("Finished inserting 300 records with a 3-second delay.")
