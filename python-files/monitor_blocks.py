from web3 import Web3
from pymongo import MongoClient
from web3.middleware import ExtraDataToPOAMiddleware
import time
from eth_utils import to_hex

# Setting Blockchain
RPC_URL = "https://fidesf1-rpc.fidesinnova.io"  
web3 = Web3(Web3.HTTPProvider(RPC_URL))

# Inject the PoA middleware
web3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)

if not web3.is_connected():
    raise Exception("Cannot connect to the blockchain node.")

# Setting Mongo
MONGO_URI = "mongodb://localhost:27017/"
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["blockchain_data"]
blocks_collection = db["blocks"]
transactions_collection = db["transactions"]

# Store Block in mongo
def process_new_block(block_number):
    block = web3.eth.get_block(block_number, full_transactions=True)
    block_data = {
        "number": block["number"],
        "hash": block["hash"].hex(),
        "parentHash": block["parentHash"].hex(),
        "miner": block["miner"],
        "timestamp": block["timestamp"],
        "transactions": block["transactions"],
    }

    # Adding transactions 
    for tx in block["transactions"]:
        tx_hash = tx['hash'].hex()
        if not tx_hash.startswith('0x'):
            tx_hash = f"0x{tx_hash}"
        # print("-" * 60)
        # print(f"Transaction Hash: {tx_hash}")
        # print(f"From: {tx['from']}")
        # print(f"To: {tx['to']}")
        # print(f"Value: {web3.from_wei(tx['value'], 'ether')} ETH")
        # print(f"Gas: {tx['gas']}")
        # print(f"Nonce: {tx['nonce']}")
        # print(f"Input Data: {tx['input']}")
        # print("-" * 60)
        tx_data = {
        "transaction_id": tx_hash,  # Transaction ID as a hex string
        "from": tx["from"],
        "to": tx["to"],
        "value": float(web3.from_wei(tx["value"], "ether")),  
        "gas": tx["gas"],
        "gasPrice": float(web3.from_wei(tx["gasPrice"], "gwei")),   
        "nonce": tx["nonce"],
        "transactionIndex": tx["transactionIndex"],
        "input": tx["input"].hex(),
        "timestamp": block["timestamp"],
            }
        transactions_collection.insert_one(tx_data)


    # Store block in DB
    blocks_collection.insert_one(block_data)
    print(f"Block {block['number']} saved to MongoDB.")


if __name__ == "__main__":   
# Subscribe to new blocks using the polling approach
    try:
        print("Listening for new blocks...")
        latest_block = web3.eth.block_number
        print(f"Starting from block: {latest_block}")

        while True:
            current_block = web3.eth.block_number
            if current_block > latest_block:
                for block_number in range(latest_block + 1, current_block + 1):
                    process_new_block(block_number)
                latest_block = current_block
    except KeyboardInterrupt:
        print("Exiting...")
