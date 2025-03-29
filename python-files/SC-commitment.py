from web3 import Web3
import pymongo
import time

# Connect to the blockchain via the RPC link
rpc_url = "https://rpc1.fidesinnova.io/"
web3 = Web3(Web3.HTTPProvider(rpc_url))

# Check connection
if web3.is_connected():
    print("Connected to blockchain")
else:
    print("Failed to connect to blockchain")
    exit()

# Contract address and ABI
# contract_address = '0x96259fba1f845b42c257f72088dd38c7e8540504'
contract_address = Web3.to_checksum_address('0x96259fba1f845b42c257f72088dd38c7e8540504')

contract_abi = [
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": False,
				"internalType": "string",
				"name": "commitmentId",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "nodeId",
				"type": "string"
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
				"name": "commitmentId",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "nodeId",
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
				"name": "deviceIdType",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "deviceModel",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "manufacturer",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "softwareVersion",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "commitment",
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
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "commitmentIds",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
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
				"name": "commitmentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "nodeId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceIdType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceModel",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "manufacturer",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "softwareVersion",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "commitment",
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
		"name": "getAllCommitmentsData",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "commitmentId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "nodeId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "deviceType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "deviceIdType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "deviceModel",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "manufacturer",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "softwareVersion",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "commitment",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct CommitmentStorage.Commitment[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "commitmentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "nodeId",
				"type": "string"
			}
		],
		"name": "getCommitment",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
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
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "commitmentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "nodeId",
				"type": "string"
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
				"name": "commitmentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "nodeId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceIdType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceModel",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "manufacturer",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "softwareVersion",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "commitment",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "storeCommitment",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

# Create a contract instance
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# MongoDB connection setup
mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")

# Database name
db_name = "smartcontract_db"

# Collection name
collection_name = "commitment_smartcontract"


# Check if database exists, if not create it by accessing it
if db_name not in mongo_client.list_database_names():
    print(f"Database '{db_name}' does not exist. Creating it...")
    # Just accessing the database will create it when data is inserted
    db = mongo_client[db_name]
else:
    db = mongo_client[db_name]
    # print(f"Database '{db_name}' already exists.")

# Check if collection exists, if not create it by accessing it
if collection_name not in db.list_collection_names():
    print(f"Collection '{collection_name}' does not exist. Creating it...")
    # Just accessing the collection will create it when data is inserted
    collection = db[collection_name]
else:
    collection = db[collection_name]
    # print(f"Collection '{collection_name}' already exists.")

# Now you can use the collection for your operations

# db = mongo_client["smartcontract_db"]
# collection = db["commitment_smartcontract"]


def get_transaction_details(tx_hash):
    try:
        tx_receipt = web3.eth.get_transaction_receipt(tx_hash)
        tx = web3.eth.get_transaction(tx_hash)
        current_time = int(time.time())
        
        if tx_receipt and tx:
            tx_hash = tx_hash.hex()
            if not tx_hash.startswith('0x'):
                 tx_hash = f"0x{tx_hash}"
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
                tx_hash = event.transactionHash
                event_data = {
					"commitmentId": event.args.commitmentId,
					"nodeId": event.args.nodeId,
					"deviceType": event.args.deviceType,
					"deviceIdType": event.args.deviceIdType,
					"deviceModel": event.args.deviceModel,
					"manufacturer": event.args.manufacturer,
					"softwareVersion": event.args.softwareVersion,
					"commitment": event.args.commitment,
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
                    "commitmentId": event.args.commitmentId,
                    "nodeId": event.args.nodeId,
                    "deviceType": event.args.deviceType,
                    "deviceIdType": event.args.deviceIdType,
                    "deviceModel": event.args.deviceModel,
                    "manufacturer": event.args.manufacturer,
                    "softwareVersion": event.args.softwareVersion,
                    "commitment": event.args.commitment,
					"timestamp": event.args.timestamp,
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
