from web3 import Web3
import pymongo
import time

# Connect to the blockchain via the RPC link
rpc_url = "https://fidesf1-rpc.fidesinnova.io/"
web3 = Web3(Web3.HTTPProvider(rpc_url))

# Check connection
if web3.is_connected():
    print("Connected to blockchain")
else:
    print("Failed to connect to blockchain")
    exit()

# Contract address and ABI
# contract_address = '0xfe6dccbc74603414ba1ac8f3f8def6d7e7eb92de'
contract_address = Web3.to_checksum_address('0xfe6dccbc74603414ba1ac8f3f8def6d7e7eb92de')

contract_abi = [
    	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": False,
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": False,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "CommitmentRemoved",
		"type": "event"
	},
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": False,
				"internalType": "string",
				"name": "manufacturerName",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "deviceType",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "deviceHardwareVersion",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "firmwareVersion",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "lines",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "commitmentData",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "CommitmentStored",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "removeCommitment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "manufacturerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceHardwareVersion",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "firmwareVersion",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "lines",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "commitmentData",
				"type": "string"
			}
		],
		"name": "storeCommitment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "commitments",
		"outputs": [
			{
				"internalType": "string",
				"name": "manufacturerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceHardwareVersion",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "firmwareVersion",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "lines",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "commitmentData",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getCommitment",
		"outputs": [
			{
				"internalType": "string",
				"name": "manufacturerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceHardwareVersion",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "firmwareVersion",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "lines",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "commitmentData",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCommitmentCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}

]

# Create a contract instance
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# MongoDB connection setup
mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
db = mongo_client["smartcontract_db"]
collection = db["commitment_smartcontract"]

def get_transaction_details(tx_hash):
    try:
        tx_receipt = web3.eth.get_transaction_receipt(tx_hash)
        tx = web3.eth.get_transaction(tx_hash)
        current_time = int(time.time())

        if tx_receipt and tx:
            return {
                "transactionHash": tx_hash,
                "to": tx.to,
                "from": tx["from"],
                "gasFee": tx_receipt.gasUsed * tx.gasPrice,
                "transactionTime": current_time
            }
    except Exception as e:
        print(f"Error getting transaction details: {e}")
        return {}

def save_latest_data(event_data, tx_hash):
    try:
        tx_details = get_transaction_details(tx_hash)
        data = {**event_data, **tx_details}
        # Insert the event data along with transaction details into MongoDB
        collection.insert_one(data)
        print("Latest data saved to MongoDB")
    except Exception as e:
        print(f"Error saving data to MongoDB: {e}")

def listen_for_events():
    try:
        # Create filters for both events
        stored_event_filter = contract.events.CommitmentStored.create_filter(from_block='latest')
        removed_event_filter = contract.events.CommitmentRemoved.create_filter(from_block='latest')
        
        print("Listening for CommitmentStored and CommitmentRemoved events...")
        
        while True:
            # Poll for new CommitmentStored events
            for event in stored_event_filter.get_new_entries():
                tx_hash = event.transactionHash.hex()
                event_data = {
                    "index": event.args.get('index', 'Unknown'),
                    "manufacturerName": event.args.manufacturerName,
                    "deviceType": event.args.deviceType,
                    "deviceHardwareVersion": event.args.deviceHardwareVersion,
                    "firmwareVersion": event.args.firmwareVersion,
                    "lines": event.args.lines,
                    "commitmentData": event.args.commitmentData,
                    "timestamp": event.args.timestamp,
                    "eventType": "CommitmentStored"
                }
                print(f"New CommitmentStored event: {event_data}")
                # Save the latest event data
                save_latest_data(event_data, tx_hash)
            
            # Poll for new CommitmentRemoved events
            for event in removed_event_filter.get_new_entries():
                tx_hash = event.transactionHash.hex()
                event_data = {
                    "index": event.args.get('index', 'Unknown'),
                    "manufacturerName": event.args.get('manufacturerName', 'Unknown'),
                    "deviceType": event.args.get('deviceType', 'Unknown'),
                    "deviceHardwareVersion": event.args.get('deviceHardwareVersion', 'Unknown'),
                    "firmwareVersion": event.args.get('firmwareVersion', 'Unknown'),
                    "lines": event.args.get('lines', 'Unknown'),
                    "commitmentData": event.args.get('commitmentData', 'Unknown'),
                    "timestamp": event.args.get('timestamp', 'Unknown'),
                    "eventType": "CommitmentRemoved"
                }
                print(f"New CommitmentRemoved event: {event_data}")
                # Save the latest event data
                save_latest_data(event_data, tx_hash)
            
            time.sleep(5)  # Polling interval
    except Exception as e:
        print(f"Error listening for events: {e}")

if __name__ == '__main__':
    listen_for_events()
