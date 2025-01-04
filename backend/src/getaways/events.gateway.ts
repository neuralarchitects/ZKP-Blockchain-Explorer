import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

interface Transaction {
  _id: ObjectId;
  timestamp: number;
  transaction_id: string;
  hash: string;
  from: string;
  to: string;
  gas: number;
  gasPrice: number;
  [key: string]: any; // Additional keys that we don't care about
}

interface TransformedTransaction {
  _id: ObjectId;
  unixtime_payload: string;
  timestamp: number;
  nodeId: string;
  eventType: string;
  deviceId: string;
  transactionHash: string;
  to: string;
  from: string;
  gasFee: number;
}

// Transformation function
export function transformTransactions(
  transaction: Transaction,
): TransformedTransaction[] {
  return [
    {
      _id: transaction._id,
      unixtime_payload: transaction.timestamp.toString(),
      timestamp: transaction.timestamp,
      eventType: 'Transaction',
      nodeId: 'Fidesinnova',
      deviceId: transaction.transaction_id,
      transactionHash: transaction.transaction_id || '',
      to: transaction.to || '',
      from: transaction.from || '',
      gasFee: (transaction.gas || 0) * (transaction.gasPrice || 0),
    },
  ];
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private totalTransactions: number = 0;
  private totalOperations: number = 0;
  private blockChainCount: number = 0;
  private zkpCount: number = 0;
  private serviceDeviceCount: number = 0;
  private server: Server;
  private db: Db;
  private blockChainDb: Db;
  private blockChainCollection: Collection;
  private zkpCollection: Collection;
  private serviceDeviceCollection: Collection;
  private transactionsCollection: Collection;

  constructor() {}

  // MongoDB connection details
  private readonly mongoUrl = process.env.MONGO_CONNECTION;
  private readonly dbName = 'smartcontract_db';
  private readonly blockChainDbName = 'blockchain_data';
  private readonly blockChainCollectionName = 'blocks';
  private readonly zkpCollectionName = 'zkp_smartcontract';
  private readonly serviceDeviceCollectionName =
    'services_devices_smartcontract';
  private readonly transactionsCollectionName = 'transactions';

  // Called when the gateway is initialized
  afterInit(server: Server) {
    this.server = server;
    console.log('WebSocket server initialized');
    this.connectToMongoDB();
  }

  // Called when a client connects
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  // Called when a client disconnects
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  private async connectToMongoDB() {
    const client = new MongoClient(this.mongoUrl);
    await client.connect();
    console.log('Socket Connected to MongoDB');

    this.db = client.db(this.dbName);

    this.zkpCollection = this.db.collection(this.zkpCollectionName);
    this.serviceDeviceCollection = this.db.collection(
      this.serviceDeviceCollectionName,
    );

    this.blockChainDb = client.db(this.blockChainDbName);

    this.blockChainCollection = this.blockChainDb.collection(
      this.blockChainCollectionName,
    );

    this.transactionsCollection = this.blockChainDb.collection(
      this.transactionsCollectionName,
    );

    const blockChainLastObject = await this.blockChainCollection
      .find({})
      .sort({ number: -1 })
      .limit(1)
      .toArray();

    const currentDate = new Date(); // Current date and time
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // End of the day
    // Convert start and end times to Unix timestamps (if your data is in Unix format)
    const startOfDayUnix = Math.floor(startOfDay.getTime() / 1000); // Convert to seconds
    const endOfDayUnix = Math.floor(endOfDay.getTime() / 1000); // Convert to seconds

    let countOfDayItems = Number(
      await this.transactionsCollection.countDocuments({
        /* timestamp: {
          $gte: startOfDayUnix,
          $lte: endOfDayUnix,
        }, */
      }),
    );

    this.totalTransactions = this.totalTransactions + countOfDayItems;

    console.log('this.totalTransactions:', this.totalTransactions);

    countOfDayItems =
      countOfDayItems +
      Number(
        await this.zkpCollection.countDocuments(/* {
          timestamp: {
            $gte: startOfDayUnix,
            $lte: endOfDayUnix,
          },
        } */),
      );
    countOfDayItems =
      countOfDayItems +
      Number(
        await this.serviceDeviceCollection.countDocuments(/* {
          TransactionTime: {
            $gte: startOfDayUnix,
            $lte: endOfDayUnix,
          },
        } */),
      );

    this.totalOperations = this.totalOperations + countOfDayItems;

    console.log('this.totalOperations:', this.totalOperations);

    this.blockChainCount = blockChainLastObject[0]?.number || 0;

    const transactionsChangeStream = this.transactionsCollection.watch();
    transactionsChangeStream.on('change', (change: any) => {
      const transformedData = transformTransactions(change.fullDocument);
      transformedData.forEach((element) => {
        this.totalOperations++;
        this.totalTransactions++;
        this.server.emit('dbChange', element, {
          zkpCount: this.zkpCount,
          serviceDeviceCount: this.serviceDeviceCount,
          blockChainCount: this.blockChainCount,
          totalOperations: this.totalOperations,
          totalTransactions: this.totalTransactions,
        });
      });
    });

    const blockChainChangeStream = this.blockChainCollection.watch();
    blockChainChangeStream.on('change', (change: any) => {
      this.blockChainCount++;

      this.server.emit('countUpdate', {
        zkpCount: this.zkpCount,
        serviceDeviceCount: this.serviceDeviceCount,
        blockChainCount: this.blockChainCount,
        totalOperations: this.totalOperations,
        totalTransactions: this.totalTransactions,
      });
    });

    this.zkpCount = await this.zkpCollection.countDocuments();
    this.serviceDeviceCount =
      await this.serviceDeviceCollection.countDocuments();

    const zkpChangeStream = this.zkpCollection.watch();
    zkpChangeStream.on('change', (change: any) => {
      this.zkpCount++;
      this.totalOperations++;

      console.log('magholllll gholll gholllll');

      //console.log('ZKP.fullDocument', change.fullDocument);
      this.server.emit('dbChange', change.fullDocument, {
        zkpCount: this.zkpCount,
        serviceDeviceCount: this.serviceDeviceCount,
        blockChainCount: this.blockChainCount,
        totalOperations: this.totalOperations,
        totalTransactions: this.totalTransactions,
      });
    });

    const serviceDeviceChangeStream = this.serviceDeviceCollection.watch();
    serviceDeviceChangeStream.on('change', (change: any) => {
      const { TransactionTime, ...rest } = change.fullDocument;
      const data = {
        ...rest,
        timestamp: TransactionTime,
      };
      this.serviceDeviceCount++;
      this.totalOperations++;
      this.server.emit('dbChange', data, {
        zkpCount: this.zkpCount,
        serviceDeviceCount: this.serviceDeviceCount,
        blockChainCount: this.blockChainCount,
        totalOperations: this.totalOperations,
        totalTransactions: this.totalTransactions,
      });
    });
  }

  @SubscribeMessage('requestLastObjects')
  async handleRequestLastObjects(
    client: Socket,
    /* @MessageBody() data: { collection: string }, */
  ) {
    try {
      let blockChainLastObjects = await this.transactionsCollection
        .find()
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray();

      //console.log("blockChainLastObjects 1:", blockChainLastObjects);

      blockChainLastObjects = blockChainLastObjects
        .map((item) => transformTransactions(item as Transaction))
        .flat();

      //console.log("blockChainLastObjects 2:", blockChainLastObjects);

      const zkpLastObjects = await this.zkpCollection
        .find({})
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray();

      const serviceDeviceLastObjects = await this.serviceDeviceCollection
        .find({})
        .sort({ TransactionTime: -1 })
        .limit(10)
        .toArray();

      const updatedServiceDeviceLastObjects = serviceDeviceLastObjects.map(
        (obj) => {
          const { TransactionTime, ...rest } = obj;
          return {
            ...rest,
            timestamp: TransactionTime,
          };
        },
      );

      client.emit(
        'lastObjects',
        [
          ...zkpLastObjects,
          ...updatedServiceDeviceLastObjects,
          ...blockChainLastObjects,
        ],
        {
          zkpCount: this.zkpCount,
          serviceDeviceCount: this.serviceDeviceCount,
          blockChainCount: this.blockChainCount,
          totalOperations: this.totalOperations,
          totalTransactions: this.totalTransactions,
        },
      );
    } catch (error) {
      console.error('Error fetching last objects:', error);
    }
  }
}
