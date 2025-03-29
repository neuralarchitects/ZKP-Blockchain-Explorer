from web3 import Web3

# Connect to an Ethereum node (Example: Infura)
infura_url = "https://mainnet.infura.io/v3/46aca51c5a444fbc8d2052867666367f"
web3 = Web3(Web3.HTTPProvider(infura_url))

# Check if connected
if web3.is_connected():
    print("Connected to Ethereum network")
else:
    print("Failed to connect")
