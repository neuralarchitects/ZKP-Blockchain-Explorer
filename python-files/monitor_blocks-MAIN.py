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

# Store Block in mongo
def save_block_to_db(block):
    block_data = {
        "number": block["number"],
        "hash": block["hash"].hex(),
        "parentHash": block["parentHash"].hex(),
        "miner": block["miner"],
        "timestamp": block["timestamp"],
        "transactions": block["transactions"].hex(),
    }

    # Adding transactions
   # for tx_hash in block["transactions"]:
    #    try:
    #        tx = web3.eth.get_transaction(tx_hash)
           # tx_data = {
           #     "hash": to_hex(tx["hash"]),
           #     "from": tx["from"],
           #     "to": tx["to"],
           #     "value": float(web3.from_wei(tx["value"], "ether")),
           #     "gas": tx["gas"],
            #    "gasPrice": float(web3.from_wei(tx["gasPrice"], "gwei")),
           # }
    #        block_data["transactions"].append(tx)
    #    except Exception as e:
    #        print(f"Error fetching transaction {tx_hash}: {e}")

    # Store block in DB
    blocks_collection.insert_one(block_data)
    print(f"Block {block['number']} saved to MongoDB.")

# Checking new block
def monitor_blocks():
    latest_block = web3.eth.block_number
    print(f"Latest block: {latest_block}")

    while True:
        new_block = web3.eth.block_number
        if new_block > latest_block:
            for block_num in range(latest_block + 1, new_block + 1):
                block = web3.eth.get_block(block_num, full_transactions=True)
                save_block_to_db(block)
            latest_block = new_block
        time.sleep(3.5)

if __name__ == "__main__":
    try:
        monitor_blocks()
    except KeyboardInterrupt:
        print("Stopped monitoring blocks.")
