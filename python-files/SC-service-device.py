from web3 import Web3
import pymongo
import time
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Connect to the blockchain via the RPC link
rpc_url = "https://rpc1.fidesinnova.io/"
web3 = Web3(Web3.HTTPProvider(rpc_url))

# Check connection
if web3.is_connected():
    logger.info("Connected to blockchain")
else:
    logger.error("Failed to connect to blockchain")
    exit()

# Contract address and ABI (Update with actual ABI)
# contract_address = '0x4b08ea934e6bfb7c72a376c842c911e1dd2aa74f'
contract_address = Web3.to_checksum_address('0x4b08ea934e6bfb7c72a376c842c911e1dd2aa74f')


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
		"name": "DeviceManagement__DeviceIdNotExist",
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
		"name": "DeviceManagement__DuplicatedId",
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
		"name": "NodeManagers__IsAlreadyManager",
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
		"name": "NodeManagers__IsNotManager",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "nodeId",
				"type": "string"
			}
		],
		"name": "NodeManagers__NodeIdMismatch",
		"type": "error"
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
				"name": "nodeId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "serviceId",
				"type": "string"
			}
		],
		"name": "ServiceManagement__DuplicatedId",
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
		"name": "ServiceManagement__ServiceIdNotExist",
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
						"name": "deviceCoordination",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "ownernershipId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "sharedDateTime",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "softwareVersion",
						"type": "string"
					}
				],
				"indexed": False,
				"internalType": "struct DeviceSharingManagement.Device",
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
						"name": "deviceCoordination",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "ownernershipId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "sharedDateTime",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "softwareVersion",
						"type": "string"
					}
				],
				"indexed": False,
				"internalType": "struct DeviceSharingManagement.Device",
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
				"name": "manager",
				"type": "address"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "nodeId",
				"type": "string"
			}
		],
		"name": "ManagerAdded",
		"type": "event"
	},
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": True,
				"internalType": "address",
				"name": "manager",
				"type": "address"
			}
		],
		"name": "ManagerRemoved",
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
						"name": "imageUrl",
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
				"internalType": "struct ServiceManagement.Service",
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
						"name": "imageUrl",
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
				"internalType": "struct ServiceManagement.Service",
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
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "nodeId",
				"type": "string"
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
				"name": "deviceCoordination",
				"type": "string[]"
			},
			{
				"internalType": "string",
				"name": "ownernershipId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "sharedDateTime",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "softwareVersion",
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
				"name": "imageUrl",
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
						"name": "deviceCoordination",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "ownernershipId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "sharedDateTime",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "softwareVersion",
						"type": "string"
					}
				],
				"internalType": "struct DeviceSharingManagement.Device[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fetchAllDevicesPerNode",
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
						"name": "deviceCoordination",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "ownernershipId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "sharedDateTime",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "softwareVersion",
						"type": "string"
					}
				],
				"internalType": "struct DeviceSharingManagement.Device[]",
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
						"name": "imageUrl",
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
				"internalType": "struct ServiceManagement.Service[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fetchAllServicesPerNode",
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
						"name": "imageUrl",
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
				"internalType": "struct ServiceManagement.Service[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllManagers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
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
		"name": "getManagerNodeId",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
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
			},
			{
				"internalType": "string",
				"name": "nodeId",
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
			},
			{
				"internalType": "string",
				"name": "nodeId",
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
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
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
collection_name = "services_devices_smartcontract"

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



# db = mongo_client["smartcontract_db"]  # Use your database name
# collection = db["services_devices_smartcontract"]  # Use your collection name




# def get_transaction_details(tx_hash):
#     try:
#         tx = web3.eth.get_transaction(tx_hash)
#         tx_receipt = web3.eth.get_transaction_receipt(tx_hash)
#         current_time = int(time.time())
        
#         if 'gasPrice' in tx:
#             gas_fee = tx_receipt.gasUsed * tx.gasPrice
#         else:
#             # EIP-1559 transaction fee calculation
#             gas_fee = tx_receipt.gasUsed * (tx.maxFeePerGas + tx.maxPriorityFeePerGas)
        
#         return {
#             "transactionHash": tx_hash,
#             "to": tx.to,
#             "from": tx['from'],
#             "gasFee": gas_fee,
#             "TransactionTime": current_time

#         }
#     except Exception as e:
#         logger.error(f"Error fetching transaction details: {e}")
#         return {}


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
                        "imageUrl": service_data.get('imageUrl', ''),
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
                        "deviceType": device_data.get('deviceType', 'Unknown'),
                        "deviceIdType": device_data.get('deviceIdType', 'Unknown'),
                        "deviceModel": device_data.get('deviceModel', 'Unknown'),
                        "manufacturer": device_data.get('manufacturer', 'Unknown'),
                        "parameters": device_data.get('parameters', []),
                        "useCost": device_data.get('useCost', 0),
                        "deviceCoordination": device_data.get('deviceCoordination', 'Unknown'),
                        "sharedDateTime": device_data.get('sharedDateTime', 'Unknown'),
                        "softwareVersion": device_data.get('softwareVersion', 'Unknown'),
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
                        "imageUrl": service_data.get('imageUrl', ''),
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
                        "deviceType": device_data.get('deviceType', 'Unknown'),
                        "deviceIdType": device_data.get('deviceIdType', 'Unknown'),
                        "deviceModel": device_data.get('deviceModel', 'Unknown'),
                        "manufacturer": device_data.get('manufacturer', 'Unknown'),
                        "parameters": device_data.get('parameters', []),
                        "useCost": device_data.get('useCost', 0),
                        "deviceCoordination": device_data.get('deviceCoordination', 'Unknown'),
                        "sharedDateTime": device_data.get('sharedDateTime', 'Unknown'),
                        "softwareVersion": device_data.get('softwareVersion', 'Unknown'),
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
