import {
  forwardRef,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ethers } from 'ethers';
import * as contractData from '../contract-data';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { DeviceService } from 'src/modules/device/services/device.service';
import { ServiceService } from 'src/modules/service/services/service.service';
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import axios from 'axios';
import { transformTransactions } from 'src/getaways/events.gateway';

function parseProofString(proofString: string) {
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

type DailyCount = {
  date: string; // Date in YYYY-MM-DD format
  count: number;
};

type GeneratedData = {
  startDate: string;
  endDate: string;
  dailyCounts: DailyCount[];
};

@Injectable()
export class ContractService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    await this.connectToMongo();
    console.log('ContractService initialization complete.');
  }
  private pythonApiUrl = 'http://localhost:7000/process'; // FastAPI URL
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
  private blockChainDb: Db;
  private transactionsCollection: Collection;
  private commitmentCollection: Collection;
  private readonly mongoUrl = process.env.MONGO_CONNECTION;
  private readonly dbName = 'smartcontract_db';
  private readonly zkpCollectionName = 'zkp_smartcontract';
  private readonly commitmentCollectionName = 'commitment_smartcontract';
  private readonly serviceDeviceCollectionName =
    'services_devices_smartcontract';
  private readonly blockChainDbName = 'blockchain_data';
  private readonly transactionsCollectionName = 'transactions';
  private transactionDataArray = [];
  private serviceDataArray = [];
  private zkpDataArray = [];
  private commitmentDataArray = [];
  private sortedRecords: any[] = [];

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

    this.connectToMongo();

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

  async zkpVerifyProofFromPython(input: string): Promise<boolean> {
    let theProof = '';
    try {
      theProof = JSON.parse(input);
    } catch (error) {
      theProof = input;
    }
    try {
      const response = await axios.post(this.pythonApiUrl, { input: theProof });
      return response.data.output;
    } catch (error) {
      console.error('Error calling Python service:', error.message);
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        `Failed to process verify request in Python service`,
      );
    }
  }

  private standardizeRecord(record: any): any {
    const { TransactionTime, transactionTime, timestamp, ...rest } = record;
    return {
      ...rest,
      // Use timestamp if available, otherwise TransactionTime (or fallback to epoch)
      timestamp: timestamp || transactionTime || TransactionTime || new Date(0),
    };
  }

  private insertSorted(arr: any[], newRecord: any): void {
    // We assume that newRecord.timestamp is a value that can be compared directly (e.g., a Date or a number)
    let low = 0;
    let high = arr.length;
    while (low < high) {
      let mid = Math.floor((low + high) / 2);
      // Compare timestamps (if they are dates, ensure you use getTime(), or compare as numbers)
      if (
        new Date(arr[mid].timestamp).getTime() <
        new Date(newRecord.timestamp).getTime()
      ) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    arr.splice(low, 0, newRecord);
  }

  private initializeSortedRecords(): void {
    // Process each array to standardize the records
    const standardizedService = this.serviceDataArray.map((r) =>
      this.standardizeRecord(r),
    );
    const standardizedZkp = this.zkpDataArray.map((r) =>
      this.standardizeRecord(r),
    );
    const standardizedCommitment = this.commitmentDataArray.map((r) =>
      this.standardizeRecord(r),
    );
    // For transactions, be aware of any transformation needed:
    const standardizedTransactions = this.transactionDataArray
      .map((item) => transformTransactions(item))
      .flat()
      .map((r) => this.standardizeRecord(r));

    // Merge all standardized records
    const allRecords = [
      ...standardizedService,
      ...standardizedZkp,
      ...standardizedTransactions,
      ...standardizedCommitment,
    ];

    // Sort the merged array in descending order by timestamp (newest first)
    allRecords.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    // Store into our sortedRecords property
    this.sortedRecords = allRecords;
  }

  async connectToMongo() {
    const client = new MongoClient(this.mongoUrl);
    await client.connect();
    console.log('Api Connected to MongoDB');
    this.db = client.db(this.dbName);
    this.blockChainDb = client.db(this.blockChainDbName);

    this.commitmentCollection = this.db.collection(
      this.commitmentCollectionName,
    );

    this.zkpCollection = this.db.collection(this.zkpCollectionName);
    this.serviceDeviceCollection = this.db.collection(
      this.serviceDeviceCollectionName,
    );

    this.transactionsCollection = this.blockChainDb.collection(
      this.transactionsCollectionName,
    );

    this.serviceDataArray = await this.serviceDeviceCollection.find().toArray();

    this.zkpDataArray = await this.zkpCollection.find().toArray();

    this.transactionDataArray = await this.transactionsCollection
      .find()
      .toArray();

    this.commitmentDataArray = await this.commitmentCollection.find().toArray();

    this.initializeSortedRecords();

    const commitmentCollectionStream = this.commitmentCollection.watch();
    commitmentCollectionStream.on('change', (change: any) => {
      switch (change.operationType) {
        case 'insert':
          this.handleCommitmentInsert(change.fullDocument);
          break;
        /* case "update":
            this.handleServiceUpdate(change.documentKey._id, change.updateDescription.updatedFields);
            break;
          case "delete":
            this.handleServiceDelete(change.documentKey._id);
            break; */
        default:
          console.log('Unrecognized transaction type:', change.operationType);
      }
    });

    const transactionsCollectionStream = this.transactionsCollection.watch();
    transactionsCollectionStream.on('change', (change: any) => {
      switch (change.operationType) {
        case 'insert':
          this.handleBlockChainInsert(change.fullDocument);
          break;
        /* case "update":
            this.handleServiceUpdate(change.documentKey._id, change.updateDescription.updatedFields);
            break;
          case "delete":
            this.handleServiceDelete(change.documentKey._id);
            break; */
        default:
          console.log('Unrecognized transaction type:', change.operationType);
      }
    });

    // Set up Change Stream for serviceDeviceCollection
    const serviceDeviceChangeStream = this.serviceDeviceCollection.watch();
    serviceDeviceChangeStream.on('change', (change: any) => {
      switch (change.operationType) {
        case 'insert':
          this.handleServiceInsert(change.fullDocument);
          break;
        /* case "update":
          this.handleServiceUpdate(change.documentKey._id, change.updateDescription.updatedFields);
          break;
        case "delete":
          this.handleServiceDelete(change.documentKey._id);
          break; */
        default:
          console.log('Unrecognized operation type:', change.operationType);
      }
    });

    // Set up Change Stream for zkpCollection (if needed)
    const zkpChangeStream = this.zkpCollection.watch();
    zkpChangeStream.on('change', (change: any) => {
      switch (change.operationType) {
        case 'insert':
          this.handleZkpInsert(change.fullDocument);
          break;
        /* case "update":
          this.handleZkpUpdate(change.documentKey._id, change.updateDescription.updatedFields);
          break;
        case "delete":
          this.handleZkpDelete(change.documentKey._id);
          break; */
        default:
          console.log('Unrecognized operation type:', change.operationType);
      }
    });
  }

  generateTransactionCounts(startDate: string, endDate: string): GeneratedData {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Initialize a map to store counts for each date
    const dailyCountsMap: Record<string, number> = {};

    // Initialize dates in the range with a count of 0
    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const dateString = date.toISOString().split('T')[0];
      dailyCountsMap[dateString] = 0;
    }

    // Process each transaction to aggregate counts by day
    this.transactionDataArray.forEach((transaction) => {
      const transactionDate = new Date(transaction.timestamp * 1000)
        .toISOString()
        .split('T')[0]; // Convert UNIX timestamp to YYYY-MM-DD

      if (dailyCountsMap.hasOwnProperty(transactionDate)) {
        dailyCountsMap[transactionDate] += 1;
      }
    });

    // Convert the map to an array of daily counts
    const dailyCounts: DailyCount[] = Object.entries(dailyCountsMap).map(
      ([date, count]) => ({ date, count }),
    );

    return {
      startDate,
      endDate,
      dailyCounts,
    };
  }

  getPaginatedRecords = async (
    limit: number = 10,
    offset: number = 1,
    filter?: string,
  ): Promise<any> => {
    console.log('filter:', filter);

    // Determine the event types to filter by based on the provided filter.
    let eventTypes: string[] | null = null;
    if (filter) {
      switch (filter) {
        case 'transaction':
          eventTypes = ['Transaction'];
          break;
        case 'zkp':
          eventTypes = ['ZKPStored'];
          break;
        case 'device':
          eventTypes = ['DeviceCreated', 'DeviceRemoved'];
          break;
        case 'service':
          eventTypes = ['ServiceCreated', 'ServiceRemoved'];
          break;
        case 'commitment':
          eventTypes = ['CommitmentStored'];
          break;
        default:
          // Unrecognized filter: leave eventTypes null to include all records.
          eventTypes = null;
      }
    }

    // Start with the full sortedRecords array.
    let filteredRecords = this.sortedRecords;

    // If a filter is provided (eventTypes is not null), filter by eventType.
    if (eventTypes) {
      filteredRecords = filteredRecords.filter(
        (record) => record.eventType && eventTypes.includes(record.eventType),
      );
    }

    // Apply pagination.
    const total = filteredRecords.length;
    const startIndex = Number(offset);
    const paginatedResults = filteredRecords.slice(
      startIndex,
      startIndex + Number(limit),
    );

    return {
      data: paginatedResults,
      total: Number(total),
      page: Number(offset) / Number(limit),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  };

  handleBlockChainInsert(newTransaction: any) {
    // Keep your original array (if needed)
    this.transactionDataArray.push(newTransaction);

    // Transform and standardize the transaction record.
    // (If transformTransactions() returns an array, loop over each record.)
    const transformedRecords = transformTransactions(newTransaction).map(
      (rec: any) => this.standardizeRecord(rec),
    );
    transformedRecords.forEach((record: any) => {
      this.insertSorted(this.sortedRecords, record);
    });
  }

  handleCommitmentInsert(newCommitment: any) {
    this.commitmentDataArray.push(newCommitment);
    const standardized = this.standardizeRecord(newCommitment);
    this.insertSorted(this.sortedRecords, standardized);
  }

  handleServiceInsert(newService: any) {
    this.serviceDataArray.push(newService);
    const standardized = this.standardizeRecord(newService);
    this.insertSorted(this.sortedRecords, standardized);
  }

  handleZkpInsert(newZkp: any) {
    this.zkpDataArray.push(newZkp);
    const standardized = this.standardizeRecord(newZkp);
    this.insertSorted(this.sortedRecords, standardized);
  }

  handleServiceUpdate(id: any, updatedFields: any) {
    const index = this.serviceDataArray.findIndex((item) =>
      item._id.equals(id),
    );
    if (index !== -1) {
      this.serviceDataArray[index] = {
        ...this.serviceDataArray[index],
        ...updatedFields,
      }; // Update the array
      console.log('Service updated in array:', this.serviceDataArray[index]);
    }
  }

  handleZkpUpdate(id: any, updatedFields: any) {
    const index = this.zkpDataArray.findIndex((item) => item._id.equals(id));
    if (index !== -1) {
      this.zkpDataArray[index] = {
        ...this.zkpDataArray[index],
        ...updatedFields,
      }; // Update the array
      console.log('ZKP updated in array:', this.zkpDataArray[index]);
    }
  }

  handleServiceDelete(id: any) {
    this.serviceDataArray = this.serviceDataArray.filter(
      (item) => !item._id.equals(id),
    ); // Remove from the array
    console.log('Service deleted from array:', id);
  }

  handleZkpDelete(id: any) {
    this.zkpDataArray = this.zkpDataArray.filter(
      (item) => !item._id.equals(id),
    ); // Remove from the array
    console.log('ZKP deleted from array:', id);
  }

  getCommitmentData = async (commitmentId: string) => {
    return await this.commitmentCollection
      .find({ commitmentID: commitmentId })
      .toArray();
  };

  // Add this helper method in your ContractService class:
  private mergeSortedArrays(arr1: any[], arr2: any[]): any[] {
    let merged = [];
    let i = 0,
      j = 0;

    // Both arr1 and arr2 must be sorted in descending order by timestamp.
    while (i < arr1.length && j < arr2.length) {
      const time1 = new Date(arr1[i].timestamp).getTime();
      const time2 = new Date(arr2[j].timestamp).getTime();
      if (time1 >= time2) {
        merged.push(arr1[i++]);
      } else {
        merged.push(arr2[j++]);
      }
    }
    // Append any remaining items
    while (i < arr1.length) {
      merged.push(arr1[i++]);
    }
    while (j < arr2.length) {
      merged.push(arr2[j++]);
    }
    return merged;
  }

  private isMatch = (obj: any, searchString: string): boolean => {
    const hexSearchString = base64ToHex(searchString);
    return Object.values(obj).some((value: any) => {
      if (typeof value === 'object' && value !== null) {
        // Handle binary values like transactionHash
        if (value._bsontype === 'Binary' && value.sub_type === 0) {
          const hexValue = value.buffer.toString('hex'); // Convert binary to hex
          return hexValue === hexSearchString;
        }
        // Recursive check for nested objects
        return this.isMatch(value, searchString);
      }
      return String(value).toLowerCase() === searchString.toLowerCase();
    });
  };

  searchData = async (
    searchString: string,
    page: number = 1,
    limit: number = 10,
    filter?: string,
  ): Promise<any> => {
    if (String(searchString).trim().length === 0) {
      return this.getPaginatedRecords(limit, Number(page - 1) * limit, filter)
    }

    // Determine the event types to filter by, based on the filter value
    let eventTypes: string[] | null = null;
    if (filter) {
      switch (filter) {
        case 'transaction':
          eventTypes = ['Transaction'];
          break;
        case 'zkp':
          eventTypes = ['ZKPStored'];
          break;
        case 'device':
          eventTypes = ['DeviceCreated', 'DeviceRemoved'];
          break;
        case 'service':
          eventTypes = ['ServiceCreated', 'ServiceRemoved'];
          break;
        case 'commitment':
          eventTypes = ['CommitmentStored'];
          break;
        default:
          // If the filter value is not recognized, we could either set eventTypes to null
          // (which will search through all records) or return an empty result.
          eventTypes = null;
      }
    }

    // Filter the sortedRecords array:
    // 1. If eventTypes is set, only keep records with a matching eventType.
    // 2. Also filter using your existing isMatch logic.
    const filteredRecords = this.sortedRecords.filter((record) => {
      if (eventTypes) {
        // Only include records that have an eventType property matching one of the values.
        if (!record.eventType || !eventTypes.includes(record.eventType)) {
          return false;
        }
      }
      return this.isMatch(record, searchString);
    });

    // Apply pagination logic.
    const total = filteredRecords.length;
    const startIndex = Number(page - 1) * limit;
    const paginatedResults = filteredRecords.slice(
      startIndex,
      Number(startIndex) + Number(limit),
    );

    return {
      data: paginatedResults,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
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
