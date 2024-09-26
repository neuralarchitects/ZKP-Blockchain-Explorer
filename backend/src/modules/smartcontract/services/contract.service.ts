import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as contractData from '../contract-data';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { DeviceService } from 'src/modules/device/services/device.service';
import { ServiceService } from 'src/modules/service/services/service.service';
import { MongoClient, Db, Collection } from "mongodb";


function parseProofString(proofString) {
  let cleanedString = proofString.substring(1, proofString.length - 1);
  let sections = cleanedString.split('],[');
  return sections.map((section) => {
    section = section.replace(/^\[|\]$/g, '');
    return section.split(',').map((item) => item.trim().replace(/^'|'$/g, ''));
  });
}

const base64ToHex = (base64String: string) => {
  const buffer = Buffer.from(base64String, 'base64');
  return buffer.toString('hex');
};


@Injectable()
export class ContractService {
  private readonly rpcUrl = 'https://fidesf1-rpc.fidesinnova.io';
  private readonly chainId = 706883;
  private readonly faucetAmount = 5;
  private readonly minFaucetAmount = 0.5;
  private lastRequestTime = {};
  private provider: any;
  private faucetWallet: any;
  private adminWallet: any;
  private contracts = {
    zkp: null,
    serviceDevice: null,
  };
  private db: Db;
	private zkpCollection: Collection;
	private serviceDeviceCollection: Collection;
	private readonly mongoUrl = process.env.MONGO_CONNECTION;
	private readonly dbName = "smartcontract_db";
	private readonly zkpCollectionName = "zkp_smartcontract";
	private readonly serviceDeviceCollectionName = "services_devices_smartcontract";
  private serviceDataArray = [];
  private zkpDataArray = [];  


  constructor(
    @Inject(forwardRef(() => DeviceService))
    private readonly deviceService?: DeviceService,
    @Inject(forwardRef(() => ServiceService))
    private readonly serviceService?: ServiceService,
  ) {
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl, {
      name: 'FidesInnova',
      chainId: this.chainId,
    });

    this.faucetWallet = new ethers.Wallet(
      process.env.FAUCET_WALLET_PRIVATE_KEY,
      this.provider,
    );

    this.adminWallet = new ethers.Wallet(
      process.env.ADMIN_WALLET_PRIVATE_KEY,
      this.provider,
    );

    this.contracts.zkp = new ethers.Contract(
      contractData.zkpContractAddress,
      contractData.zkpContractABI,
      this.adminWallet,
    );

    this.contracts.serviceDevice = new ethers.Contract(
      contractData.serviceDeviceContractAddress,
      contractData.serviceDeviceContractABI,
      this.adminWallet,
    );

    this.connectToMongo()

    this.contracts.serviceDevice.on('ServiceCreated', async (id, service) => {
      let newService = {
        nodeId: service[0],
        nodeServiceId: service[1],
        userId: service[1],
        serviceName: service[2],
        description: service[3],
        serviceImage: service[8],
        serviceType: service[4],
        installationPrice: service[6],
        runningPrice: service[7],
        status: 'tested',
        blocklyJson: '',
        code: service[9],
        devices: service[5],
        insertDate: service[10],
        updateDate: service[11],
        published: true,
      };

      try {
        const createService = await this.serviceService.insertService(
          newService,
        );
      } catch (error) {
        console.log(error);
      }
    });

    this.contracts.serviceDevice.on('ServiceRemoved', async (id, service) => {
      console.log(`${service[0]} , ${service[1]}`);

      try {
        await this.serviceService.deleteServiceByNodeServiceIdAndNodeId(
          service[0],
          service[1],
        );
      } catch (error) {
        console.log(error);
      }
    });

    this.contracts.serviceDevice.on('DeviceCreated', (id, device) => {
      let newDevice = {
        nodeId: device[0],
        nodeDeviceId: device[1],
        userId: device[2],
        isShared: true,
        deviceName: device[3],
        deviceType: device[4],
        deviceEncryptedId: device[5],
        hardwareVersion: device[6],
        firmwareVersion: device[7],
        parameters: device[8].map((str) => JSON.parse(str)),
        costOfUse: device[9],
        location: { coordinates: device[10] },
        insertDate: device[11],
        updateDate: device[11],
      };

      this.deviceService.insertDevice(newDevice);
    });

    this.contracts.serviceDevice.on('DeviceRemoved', (id, device) => {
      this.deviceService.deleteOtherNodeDeviceByNodeIdAndDeviceId(
        device[0],
        device[1],
        device[5],
      );
    });
  }

  async connectToMongo() {
    const client = new MongoClient(this.mongoUrl);
    await client.connect();
    console.log("Api Connected to MongoDB");
    this.db = client.db(this.dbName);
  
    this.zkpCollection = this.db.collection(this.zkpCollectionName);
    this.serviceDeviceCollection = this.db.collection(this.serviceDeviceCollectionName);
  
    // Fetch initial data and populate arrays
    this.serviceDataArray = await this.serviceDeviceCollection.find().toArray();
    this.zkpDataArray = await this.zkpCollection.find().toArray();
  
    //console.log("ZKP is :", this.zkpDataArray);
    

    // Set up Change Stream for serviceDeviceCollection
    const serviceDeviceChangeStream = this.serviceDeviceCollection.watch();
    serviceDeviceChangeStream.on("change", (change: any) => {
      switch (change.operationType) {
        case "insert":
          this.handleServiceInsert(change.fullDocument);
          break;
        /* case "update":
          this.handleServiceUpdate(change.documentKey._id, change.updateDescription.updatedFields);
          break;
        case "delete":
          this.handleServiceDelete(change.documentKey._id);
          break; */
        default:
          console.log("Unrecognized operation type:", change.operationType);
      }
    });
  
    // Set up Change Stream for zkpCollection (if needed)
    const zkpChangeStream = this.zkpCollection.watch();
    zkpChangeStream.on("change", (change: any) => {
      switch (change.operationType) {
        case "insert":
          this.handleZkpInsert(change.fullDocument);
          break;
        /* case "update":
          this.handleZkpUpdate(change.documentKey._id, change.updateDescription.updatedFields);
          break;
        case "delete":
          this.handleZkpDelete(change.documentKey._id);
          break; */
        default:
          console.log("Unrecognized operation type:", change.operationType);
      }
    });
  }
  
  handleServiceInsert(newService: any) {
    this.serviceDataArray.push(newService); // Sync the new service with the array
    console.log("Service inserted into array:", newService);
  }
  
  handleZkpInsert(newDevice: any) {
    this.zkpDataArray.push(newDevice); // Sync the new device with the array
    console.log("ZKP inserted into array:", newDevice);
  }
  

  handleServiceUpdate(id: any, updatedFields: any) {
    const index = this.serviceDataArray.findIndex((item) => item._id.equals(id));
    if (index !== -1) {
      this.serviceDataArray[index] = { ...this.serviceDataArray[index], ...updatedFields }; // Update the array
      console.log("Service updated in array:", this.serviceDataArray[index]);
    }
  }
  
  handleZkpUpdate(id: any, updatedFields: any) {
    const index = this.zkpDataArray.findIndex((item) => item._id.equals(id));
    if (index !== -1) {
      this.zkpDataArray[index] = { ...this.zkpDataArray[index], ...updatedFields }; // Update the array
      console.log("ZKP updated in array:", this.zkpDataArray[index]);
    }
  }
  
  handleServiceDelete(id: any) {
    this.serviceDataArray = this.serviceDataArray.filter((item) => !item._id.equals(id)); // Remove from the array
    console.log("Service deleted from array:", id);
  }
  
  handleZkpDelete(id: any) {
    this.zkpDataArray = this.zkpDataArray.filter((item) => !item._id.equals(id)); // Remove from the array
    console.log("ZKP deleted from array:", id);
  }

  
  
  searchData = async (searchString: string) => {
    const results: any[] = [];
  
    console.log("typeof:", typeof this.serviceDeviceCollection, ", serviceDeviceCollection", this.serviceDeviceCollection);
  
    // Helper function to check if a value in an object matches the search string
    const isMatch = (obj: any, searchString: string): boolean => {
      const hexSearchString = base64ToHex(searchString); // Convert Base64 to hex
    
      return Object.values(obj).some((value: any) => {
        if (typeof value === 'object' && value !== null) {
          // Handle binary values like transactionHash
          if (value._bsontype === 'Binary' && value.sub_type === 0) {
            const hexValue = value.buffer.toString('hex'); // Convert binary to hex
            return hexValue === hexSearchString;
          }
          // If value is an object, perform a recursive check on nested objects
          return isMatch(value, searchString);
        }
        // Case-insensitive comparison for other values
        return String(value).toLowerCase() === searchString.toLowerCase();
      });
    };
    
    
    
  
    console.log("ZKP array is:", this.zkpDataArray);
    console.log("Service array is:", this.serviceDataArray);
  
    // Search in serviceDataArray
    this.serviceDataArray.forEach((service) => {
      if (isMatch(service, searchString)) {
        results.push(service); // Add matching service to results
      }
    });
  
    // Search in zkpDataArray
    this.zkpDataArray.forEach((zkp) => {
      if (isMatch(zkp, searchString)) {
        results.push(zkp); // Add matching zkp to results
      }
    });
  
    return results; // Return all matching objects
  };
  
  

  async adminWalletData() {
    return {
      address: this.adminWallet.address,
      balance: await this.getWalletBalance(this.adminWallet.address),
    };
  }

  async faucetWalletData() {
    return {
      address: this.faucetWallet.address,
      balance: await this.getWalletBalance(this.faucetWallet.address),
    };
  }

  formatBigInt(bigIntValue: bigint): number {
    if (bigIntValue === 0n) {
      return 0;
    }
    const divisor = 1000000000000000000n;
    const result = Number(bigIntValue) / Number(divisor);
    return Number(result.toFixed(5));
  }

  async getWalletBalance(walletAddress: string) {
    try {
      const res = await this.provider.getBalance(walletAddress);
      return this.formatBigInt(res);
    } catch (error) {
      return null;
    }
  }

  async requestFaucet(walletAddress: string): Promise<string> {
    const currentTime = Date.now();
    const twentyFourHours = 1000 * 24 * 60 * 60;

    if (
      this.lastRequestTime[walletAddress] &&
      currentTime - this.lastRequestTime[walletAddress] < twentyFourHours
    ) {
      throw new GeneralException(
        ErrorTypeEnum.FORBIDDEN,
        `You can only use the faucet once every 24 hours.`,
      );
    }

    this.lastRequestTime[walletAddress] = currentTime;

    const balance = await this.getWalletBalance(walletAddress);

    if (balance < this.faucetAmount) {
      const amountToSend = this.faucetAmount - balance;

      if (amountToSend < this.minFaucetAmount) {
        throw new GeneralException(
          ErrorTypeEnum.UNPROCESSABLE_ENTITY,
          `Minimum amount for faucet is ${this.minFaucetAmount}`,
        );
      }

      try {
        const tx = await this.faucetWallet.sendTransaction({
          to: walletAddress,
          value: ethers.parseUnits(amountToSend.toString(), 'ether'),
        });

        await tx.wait();
      } catch (error) {
        throw new GeneralException(
          ErrorTypeEnum.NOT_FOUND,
          'Wallet address is not valid !',
        );
      }

      return `Success: Topped up ${amountToSend} FDS to ${walletAddress}.`;
    }

    throw new GeneralException(
      ErrorTypeEnum.INTERNAL_SERVER_ERROR,
      `already has a balance of ${this.faucetAmount} FDS or more.`,
    );
  }

  async shareDevice(
    nodeId: string,
    deviceId: string,
    ownerId: string,
    name: string,
    deviceType: string,
    encryptedID: string,
    hardwareVersion: string,
    firmwareVersion: string,
    parameters: Array<string>,
    useCost: string,
    locationGPS: Array<string>,
    installationDate: string,
  ) {
    return this.contracts.serviceDevice.createDevice(
      nodeId,
      deviceId,
      ownerId,
      name,
      deviceType,
      encryptedID,
      hardwareVersion,
      firmwareVersion,
      parameters,
      useCost,
      locationGPS,
      installationDate,
    );
  }

  async removeSharedDevice(nodeId: string, deviceId: string) {
    return this.contracts.serviceDevice.removeDevice(nodeId, deviceId);
  }

  async createService(
    nodeId: string,
    serviceId: string,
    name: string,
    description: string,
    serviceType: string,
    devices: string,
    installationPrice: string,
    executionPrice: string,
    imageURL: string,
    program: string,
    creationDate: string,
    publishedDate: string,
  ) {
    return this.contracts.serviceDevice.createService(
      nodeId,
      serviceId,
      name,
      description,
      serviceType,
      devices,
      installationPrice,
      executionPrice,
      imageURL,
      program,
      creationDate,
      publishedDate,
    );
  }

  async removeService(nodeId: string, serviceId: string) {
    return this.contracts.serviceDevice.removeService(nodeId, serviceId);
  }

  async fetchAllDevices() {
    return this.contracts.serviceDevice.fetchAllDevices();
  }

  async fetchAllServices() {
    return this.contracts.serviceDevice.fetchAllServices();
  }

  async syncAllServices() {
    const allContractServices = await this.fetchAllServices();
    const allNodeServices = await this.serviceService.getAllPublishedServices();

    allNodeServices.map((nodeServices: any) => {
      let exist = false;
      allContractServices.map((contractServices: any) => {
        if (
          String(nodeServices.nodeId) == String(contractServices[0]) &&
          (String(nodeServices.nodeServiceId) == String(contractServices[1]) ||
            String(nodeServices._id) == String(contractServices[1]))
        ) {
          exist = true;
        }
      });
      if (exist == false) {
        try {
          this.serviceService.deleteServiceByNodeServiceIdAndNodeId(
            nodeServices.nodeId,
            nodeServices.nodeServiceId,
          );
        } catch (error) {
          console.log(error);
        }
      }
    });

    allContractServices.map((contractServices: any) => {
      let exist = false;
      allNodeServices.map((nodeServices: any) => {
        if (
          String(nodeServices.nodeId) == String(contractServices[0]) &&
          (String(nodeServices.nodeServiceId) == String(contractServices[1]) ||
            String(nodeServices._id) == String(contractServices[1]))
        ) {
          exist = true;
        }
      });
      if (exist == false) {
        let newService = {
          nodeId: contractServices[0],
          nodeServiceId: contractServices[1],
          userId: contractServices[1],
          serviceName: contractServices[2],
          description: contractServices[3],
          serviceImage: contractServices[8],
          serviceType: contractServices[4],
          installationPrice: contractServices[6],
          runningPrice: contractServices[7],
          status: 'tested',
          blocklyJson: '',
          code: contractServices[9],
          devices: contractServices[5],
          insertDate: contractServices[10],
          updateDate: contractServices[11],
          published: true,
        };

        try {
          this.serviceService.insertService(newService);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  async syncAllDevices() {
    const allContractDevices = await this.fetchAllDevices();
    const allNodeDevices = await this.deviceService.getAllSharedDevices();

    allNodeDevices.map((nodeDevices: any) => {
      let exist = false;
      allContractDevices.map((contractDevices: any) => {
        if (
          String(nodeDevices.nodeId) == String(contractDevices[0]) &&
          (String(nodeDevices.nodeDeviceId) == String(contractDevices[1]) ||
            String(nodeDevices._id) == String(contractDevices[1]))
        ) {
          exist = true;
        }
      });
      if (exist == false) {
        try {
          this.deviceService.deleteOtherNodeDeviceByNodeIdAndDeviceId(
            nodeDevices.nodeId,
            nodeDevices.nodeDeviceId,
            nodeDevices.deviceEncryptedId,
          );
        } catch (error) {
          console.log(error);
        }
      }
    });

    allContractDevices.map((contractDevices: any) => {
      let exist = false;
      allNodeDevices.map((nodeDevices: any) => {
        if (
          String(nodeDevices.nodeId) == String(contractDevices[0]) &&
          (String(nodeDevices.nodeDeviceId) == String(contractDevices[1]) ||
            String(nodeDevices._id) == String(contractDevices[1]))
        ) {
          exist = true;
        }
      });
      if (exist == false) {
        let newDevice = {
          nodeId: contractDevices[0],
          nodeDeviceId: contractDevices[1],
          userId: contractDevices[2],
          isShared: true,
          deviceName: contractDevices[3],
          deviceType: contractDevices[4],
          deviceEncryptedId: contractDevices[5],
          hardwareVersion: contractDevices[6],
          firmwareVersion: contractDevices[7],
          parameters: contractDevices[8].map((str) => JSON.parse(str)),
          costOfUse: contractDevices[9],
          location: { coordinates: contractDevices[10] },
          insertDate: contractDevices[11],
          updateDate: contractDevices[11],
        };

        this.deviceService.insertDevice(newDevice);
      }
    });
  }

  async zpkProof(proofString: string): Promise<boolean> {
    try {
      const proofSlices = parseProofString(proofString);
      const result = await this.contracts.zkp.verifyProof(
        proofSlices[0],
        [proofSlices[1], proofSlices[2]],
        proofSlices[3],
        proofSlices[4],
      );
      return result;
    } catch (error) {
      console.error('Error calling verifyProof:', error);
      return false;
    }
  }

}
