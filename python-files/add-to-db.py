import pymongo
import random
import time
from datetime import datetime

# MongoDB connection details
mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
db = mongo_client["smartcontract_db"]
collection = db["zkp_smartcontract"]

# Function to generate random transaction hash (64-character hex string)
def generate_transaction_hash():
    return ''.join(random.choices('abcdef0123456789', k=64))

# Function to generate random gas fee
def generate_gas_fee():
    return random.randint(2000000000000000, 3000000000000000)

# Function to generate random device ID (hex string)
def generate_device_id():
    return ''.join(random.choices('abcdef0123456789', k=24))

# Function to generate random ZKP payload structure
def generate_zkp_payload():
    return {
        "P1AHP": [random.randint(1, 100)],
        "P2AHP": random.sample(range(1, 200), random.randint(1, 5)),
        "P3AHP": random.sample(range(1, 200), random.randint(1, 6)),
        "P4AHP": random.sample(range(1, 200), random.randint(1, 6)),
        "P5AHP": random.sample(range(1, 200), random.randint(1, 5)),
        "P6AHP": random.sample(range(1, 200), random.randint(1, 8)),
        "P7AHP": random.sample(range(1, 200), random.randint(1, 5)),
        "P8AHP": random.sample(range(1, 200), random.randint(1, 3)),
        "P9AHP": random.sample(range(1, 200), random.randint(1, 5)),
        "P10AHP": [random.randint(1, 100)],
        "P11AHP": random.sample(range(1, 200), random.randint(1, 3)),
        "P12AHP": random.sample(range(1, 200), random.randint(1, 3)),
        "P13AHP": [random.randint(1, 100)],
    }

# Function to generate random data payload
def generate_data_payload():
    options = [
        "Temperature: 22 °C",
        "Humidity: 34%",
        "Door: Open",
        "Movement: Detected",
        "Button: Pressed",
        "Button: Not Pressed"
    ]
    return random.choice(options)

# Function to generate random record
def generate_random_record():
    return {
        "nodeId": random.randint(1000, 9999),
        "deviceId": generate_device_id(),
        "deviceType": random.choice(["E-CARD", "MULTI_SENSOR"]),
        "hardwareVersion": str(random.randint(1, 4)),
        "firmwareVersion": str(random.randint(1, 4)),
        "data_payload": generate_data_payload(),
        "zkp_payload": generate_zkp_payload(),
        "unixtime_payload": random.randint(1600000000, 1800000000),  # Random future Unix time
        "timestamp": datetime.utcnow().isoformat(),  # Current UTC timestamp
        "transactionHash": generate_transaction_hash(),
        "to": "0xCFC00106081c541389D449183D4EEADF5d895D37",
        "from": "0xC69F809f7dF222626Ea8e936C77D4A54a223034F",
        "gasFee": generate_gas_fee(),
        "eventType": "ZKPStored"
    }

# Insert 300 random records with a 3-second delay between each insertion
for _ in range(100):
    record = generate_random_record()
    collection.insert_one(record)
    print(f"Inserted record: {record['transactionHash']}")
    time.sleep(2)  # 3-second delay between each insertion

print("Finished inserting 300 records with a 3-second delay.")
