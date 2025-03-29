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
# contract_address = '0x897264b7d872e07a3d8e1d22b199f12cfb4bb26d'
contract_address = Web3.to_checksum_address('0x897264b7d872e07a3d8e1d22b199f12cfb4bb26d')

contract_abi =  [
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": False,
				"internalType": "string",
				"name": "nodeId",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "deviceId",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "zkpPayload",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "dataPayload",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "ZKPStored",
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
		"name": "getZKP",
		"outputs": [
			{
				"internalType": "string",
				"name": "nodeId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "zkpPayload",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dataPayload",
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
		"name": "getZKPCount",
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
				"name": "nodeId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "zkpPayload",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dataPayload",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "storeZKP",
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
		"name": "zkps",
		"outputs": [
			{
				"internalType": "string",
				"name": "nodeId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "zkpPayload",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dataPayload",
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
	}
]

# Create a contract instance
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# MongoDB connection setup
mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
# Database name
db_name = "smartcontract_db"

# Collection name
collection_name = "zkp_smartcontract"


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





# db = mongo_client["smartcontract_db"]
# collection = db["zkp_smartcontract"]


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
        stored_event_filter = contract.events.ZKPStored.create_filter(from_block='latest')
        # deleted_event_filter = contract.events.ZKPDeleted.create_filter(from_block='latest')
        
        print("Listening for ZKPStored events...")
        
        while True:
            # Poll for new ZKPStored events
            for event in stored_event_filter.get_new_entries():
                tx_hash = event.transactionHash
                event_data = {
                    "nodeId": event.args.nodeId,
                    "deviceId": event.args.deviceId,
                    "zkpPayload": event.args.zkpPayload,
                    "dataPayload": event.args.dataPayload,
                    "timestamp": event.args.timestamp,
                    "eventType": "ZKPStored"

                }
                print(f"New ZKPStored event: {event_data}")
                # Save the latest event data
                save_latest_data(event_data, tx_hash)
            




            # # Poll for new ZKPDeleted events
            # for event in deleted_event_filter.get_new_entries():
            #     tx_hash = event.transactionHash.hex()
            #     event_data = {
            #         "nodeId": event.args.nodeId,
            #         "deviceId": event.args.deviceId,
            #         "deviceType": event.args.deviceType,
            #         "hardwareVersion": event.args.hardwareVersion,
            #         "firmwareVersion": event.args.firmwareVersion,
            #         "data_payload": event.args.data_payload,
            #         "zkp_payload": event.args.zkp_payload,
            #         "unixtime_payload": event.args.unixtime_payload,
            #         "timestamp": event.args.timestamp,
            #         "index": event.args.index,
            #         "eventType": "ZKPDeleted"
            #     }
            #     print(f"New ZKPDeleted event: {event_data}")
            #     # Save the latest event data
            #     save_latest_data(event_data, tx_hash)
            
           
            time.sleep(5)  # Polling interval
    except Exception as e:
        print(f"Error listening for events: {e}")

if __name__ == '__main__':
    listen_for_events()
