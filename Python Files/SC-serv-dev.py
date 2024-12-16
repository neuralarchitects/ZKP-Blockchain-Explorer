from web3 import Web3
import pymongo
import time
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Connect to the blockchain via the RPC link
rpc_url = "https://fidesf1-rpc.fidesinnova.io/"
web3 = Web3(Web3.HTTPProvider(rpc_url))

# Check connection
if web3.is_connected():
    logger.info("Connected to blockchain")
else:
    logger.error("Failed to connect to blockchain")
    exit()

# Contract address and ABI (Update with actual ABI)
# contract_address = '0x0caf2cdaefa7a2c553f1fe45add08d812dacc35e'
contract_address = Web3.to_checksum_address('0x0caf2cdaefa7a2c553f1fe45add08d812dacc35e')


contract_abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "initialOwner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "AccessManagers__IsAlreadyManager",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "AccessManagers__IsNotManager",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "addManager",
		"outputs": [],
		"stateMutability": "nonpayable",
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
				"name": "ownerId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "deviceType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "encryptedID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "hardwareVersion",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "firmwareVersion",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "parameters",
				"type": "string[]"
			},
			{
				"internalType": "string",
				"name": "useCost",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "locationGPS",
				"type": "string[]"
			},
			{
				"internalType": "string",
				"name": "installationDate",
				"type": "string"
			}
		],
		"name": "createDevice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
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
				"name": "serviceId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "serviceType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "devices",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "installationPrice",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "executionPrice",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "imageURL",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "program",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "creationDate",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "publishedDate",
				"type": "string"
			}
		],
		"name": "createService",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "targetNodeId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "targetDeviceId",
				"type": "string"
			}
		],
		"name": "removeDevice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "removeManager",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "targetNodeId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "targetServiceId",
				"type": "string"
			}
		],
		"name": "removeService",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
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
				"name": "serviceId",
				"type": "string"
			}
		],
		"name": "ServiceMarket__DuplicatedId",
		"type": "error"
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
				"name": "serviceId",
				"type": "string"
			}
		],
		"name": "ServiceMarket__ServiceIdNotExist",
		"type": "error"
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
			}
		],
		"name": "SharedDevice__DeviceIdNotExist",
		"type": "error"
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
			}
		],
		"name": "SharedDevice__DuplicatedId",
		"type": "error"
	},
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": True,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"components": [
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
						"name": "ownerId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "deviceType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "encryptedID",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "hardwareVersion",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "firmwareVersion",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "parameters",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "useCost",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "locationGPS",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "installationDate",
						"type": "string"
					}
				],
				"indexed": False,
				"internalType": "struct Device",
				"name": "device",
				"type": "tuple"
			}
		],
		"name": "DeviceCreated",
		"type": "event"
	},
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": True,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"components": [
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
						"name": "ownerId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "deviceType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "encryptedID",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "hardwareVersion",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "firmwareVersion",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "parameters",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "useCost",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "locationGPS",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "installationDate",
						"type": "string"
					}
				],
				"indexed": False,
				"internalType": "struct Device",
				"name": "device",
				"type": "tuple"
			}
		],
		"name": "DeviceRemoved",
		"type": "event"
	},
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": True,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": True,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": True,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "nodeId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "serviceId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "serviceType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "devices",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "installationPrice",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "executionPrice",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "imageURL",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "program",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "creationDate",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "publishedDate",
						"type": "string"
					}
				],
				"indexed": False,
				"internalType": "struct Service",
				"name": "service",
				"type": "tuple"
			}
		],
		"name": "ServiceCreated",
		"type": "event"
	},
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": True,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "nodeId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "serviceId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "serviceType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "devices",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "installationPrice",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "executionPrice",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "imageURL",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "program",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "creationDate",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "publishedDate",
						"type": "string"
					}
				],
				"indexed": False,
				"internalType": "struct Service",
				"name": "service",
				"type": "tuple"
			}
		],
		"name": "ServiceRemoved",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fetchAllDevices",
		"outputs": [
			{
				"components": [
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
						"name": "ownerId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "deviceType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "encryptedID",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "hardwareVersion",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "firmwareVersion",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "parameters",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "useCost",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "locationGPS",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "installationDate",
						"type": "string"
					}
				],
				"internalType": "struct Device[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fetchAllServices",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "nodeId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "serviceId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "serviceType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "devices",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "installationPrice",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "executionPrice",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "imageURL",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "program",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "creationDate",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "publishedDate",
						"type": "string"
					}
				],
				"internalType": "struct Service[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
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
db = mongo_client["smartcontract_db"]  # Use your database name
collection = db["services_devices_smartcontract"]  # Use your collection name

def get_transaction_details(tx_hash):
    try:
        tx = web3.eth.get_transaction(tx_hash)
        tx_receipt = web3.eth.get_transaction_receipt(tx_hash)
        current_time = int(time.time())
        
        if 'gasPrice' in tx:
            gas_fee = tx_receipt.gasUsed * tx.gasPrice
        else:
            # EIP-1559 transaction fee calculation
            gas_fee = tx_receipt.gasUsed * (tx.maxFeePerGas + tx.maxPriorityFeePerGas)
        
        return {
            "transactionHash": tx_hash,
            "to": tx.to,
            "from": tx['from'],
            "gasFee": gas_fee,
            "TransactionTime": current_time

        }
    except Exception as e:
        logger.error(f"Error fetching transaction details: {e}")
        return {}

def save_latest_data(event_data, tx_details):
    try:
        # Combine event data with transaction details
        data_to_save = {**event_data, **tx_details}
        # Insert the event data into MongoDB
        collection.insert_one(data_to_save)
        logger.info("Latest data saved to MongoDB")
    except Exception as e:
        logger.error(f"Error saving data to MongoDB: {e}")

def listen_for_events():
    try:
        # Create filters for the events
        service_event_filter = contract.events.ServiceCreated.create_filter(from_block='latest')
        device_event_filter = contract.events.DeviceCreated.create_filter(from_block='latest')
        service_removed_filter = contract.events.ServiceRemoved.create_filter(from_block='latest')
        device_removed_filter = contract.events.DeviceRemoved.create_filter(from_block='latest')
        
        logger.info("Listening for Service and Device events...")

        while True:
            # Poll for new Service events
            for event in service_event_filter.get_new_entries():
                logger.info(f"Received Service event: {event}")
                logger.info(f"Event args: {event.args}")

                try:
                    service_data = event.args.service
                    tx_details = get_transaction_details(event.transactionHash)
                    event_data = {
                        "nodeId": service_data.get('nodeId', 'Unknown'),
                        "serviceId": service_data.get('serviceId', 'Unknown'),
                        "name": service_data.get('name', 'Unknown'),
                        "description": service_data.get('description', 'Unknown'),
                        "serviceType": service_data.get('serviceType', 'Unknown'),
                        "devices": service_data.get('devices', []),
                        "installationPrice": service_data.get('installationPrice', 0),
                        "executionPrice": service_data.get('executionPrice', 0),
                        "imageURL": service_data.get('imageURL', ''),
                        "program": service_data.get('program', ''),
                        "creationDate": service_data.get('creationDate', 'Unknown'),
                        "publishedDate": service_data.get('publishedDate', 'Unknown'),
                        "eventType": "ServiceCreated"

                    }
                    logger.info(f"Processed Service event: {event_data}")
                    save_latest_data(event_data, tx_details)
                except Exception as e:
                    logger.error(f"Error processing Service event data: {e}")
            


            # Poll for new Device events
            for event in device_event_filter.get_new_entries():
                logger.info(f"Received Device event: {event}")
                logger.info(f"Event args: {event.args}")

                try:
                    
                    device_data = event.args.device
                    tx_details = get_transaction_details(event.transactionHash)
                    event_data = {
                        "nodeId": device_data.get('nodeId', 'Unknown'),
                        "deviceId": device_data.get('deviceId', 'Unknown'),
                        "ownerId": device_data.get('ownerId', 'Unknown'),
                        "name": device_data.get('name', 'Unknown'),
                        "deviceType": device_data.get('deviceType', 'Unknown'),
                        "encryptedID": device_data.get('encryptedID', 'Unknown'),
                        "hardwareVersion": device_data.get('hardwareVersion', 'Unknown'),
                        "firmwareVersion": device_data.get('firmwareVersion', 'Unknown'),
                        "parameters": device_data.get('parameters', []),
                        "useCost": device_data.get('useCost', 0),
                        "locationGPS": device_data.get('locationGPS', 'Unknown'),
                        "installationDate": device_data.get('installationDate', 'Unknown'),
                        "eventType": "DeviceCreated"
                    }
                    logger.info(f"Processed Device event: {event_data}")
                    save_latest_data(event_data, tx_details)
                except Exception as e:
                    logger.error(f"Error processing Device event data: {e}")
            


            # Poll for ServiceRemoved events
            for event in service_removed_filter.get_new_entries():
                logger.info(f"Received ServiceRemoved event: {event}")
                try:
                    service_data = event.args.service
                    tx_details = get_transaction_details(event.transactionHash)
                    event_data = {
                        "nodeId": service_data.get('nodeId', 'Unknown'),
                        "serviceId": service_data.get('serviceId', 'Unknown'),
                        "name": service_data.get('name', 'Unknown'),
                        "description": service_data.get('description', 'Unknown'),
                        "serviceType": service_data.get('serviceType', 'Unknown'),
                        "devices": service_data.get('devices', []),
                        "installationPrice": service_data.get('installationPrice', 0),
                        "executionPrice": service_data.get('executionPrice', 0),
                        "imageURL": service_data.get('imageURL', ''),
                        "program": service_data.get('program', ''),
                        "creationDate": service_data.get('creationDate', 'Unknown'),
                        "publishedDate": service_data.get('publishedDate', 'Unknown'),
						"eventType": "ServiceRemoved"
						}
                    save_latest_data(event_data, tx_details)
                except Exception as e:
                    logger.error(f"Error processing ServiceRemoved event: {e}")
            


            # Poll for DeviceRemoved events
            for event in device_removed_filter.get_new_entries():
                logger.info(f"Received DeviceRemoved event: {event}")
                try:
                    device_data = event.args.device
                    tx_details = get_transaction_details(event.transactionHash)
                    event_data = {
                        "nodeId": device_data.get('nodeId', 'Unknown'),
                        "deviceId": device_data.get('deviceId', 'Unknown'),
                        "ownerId": device_data.get('ownerId', 'Unknown'),
                        "name": device_data.get('name', 'Unknown'),
                        "deviceType": device_data.get('deviceType', 'Unknown'),
                        "encryptedID": device_data.get('encryptedID', 'Unknown'),
                        "hardwareVersion": device_data.get('hardwareVersion', 'Unknown'),
                        "firmwareVersion": device_data.get('firmwareVersion', 'Unknown'),
                        "parameters": device_data.get('parameters', []),
                        "useCost": device_data.get('useCost', 0),
                        "locationGPS": device_data.get('locationGPS', 'Unknown'),
                        "installationDate": device_data.get('installationDate', 'Unknown'),
						"eventType": "DeviceRemoved"					
						}
                    save_latest_data(event_data, tx_details)
                except Exception as e:
                    logger.error(f"Error processing DeviceRemoved event: {e}")



            time.sleep(5)  # Polling interval
    except Exception as e:
        logger.error(f"Error listening for events: {e}")

if __name__ == '__main__':
    listen_for_events()
