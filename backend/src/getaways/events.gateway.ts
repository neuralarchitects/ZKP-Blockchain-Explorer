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
  hash: string;
  from: string;
  to: string;
  gas: number;
  blockHash: string;
  gasPrice: number;
  [key: string]: any; // Additional keys that we don't care about
}

interface Block {
  _id: ObjectId;
  timestamp: number;
  transactions: Transaction[];
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
export function transformTransactions(block: Block): TransformedTransaction[] {
  if (!block.transactions || block.transactions.length === 0) {
    return [];
  }

  return block.transactions.map((txn) => ({
    _id: block._id,
    unixtime_payload: block.timestamp.toString(),
    timestamp: block.timestamp,
    eventType: 'Transaction',
    nodeId: 'Fidesinnova',
    deviceId: txn.blockHash,
    transactionHash: txn.hash || '',
    to: txn.to || '',
    from: txn.from || '',
    gasFee: (txn.gas || 0) * (txn.gasPrice || 0),
  }));
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private dailyTransactions: number = 0;
  private blockChainCount: number = 0;
  private zkpCount: number = 0;
  private serviceDeviceCount: number = 0;
  private server: Server;
  private db: Db;
  private blockChainDb: Db;
  private blockChainCollection: Collection;
  private zkpCollection: Collection;
  private serviceDeviceCollection: Collection;

  constructor() {
    /* setInterval(() => {
      console.log('Daily Transactions Reseted !');
      this.dailyTransactions = 0;
    }, 24 * 60 * 60 * 1000); */
  }

  // MongoDB connection details
  private readonly mongoUrl = process.env.MONGO_CONNECTION;
  private readonly dbName = 'smartcontract_db';
  private readonly blockChainDbName = 'blockchain_data';
  private readonly blockChainCollectionName = 'blocks';
  private readonly zkpCollectionName = 'zkp_smartcontract';
  private readonly serviceDeviceCollectionName =
    'services_devices_smartcontract';

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
      await this.blockChainCollection.countDocuments({
        /* timestamp: {
          $gte: startOfDayUnix,
          $lte: endOfDayUnix,
        }, */
        $expr: { $gt: [{ $size: '$transactions' }, 0] },
      }),
    );

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

    console.log('Maghollll:', countOfDayItems);
    
    this.dailyTransactions = this.dailyTransactions + countOfDayItems;
    
    console.log('Maghollll 2222:', this.dailyTransactions);

    this.blockChainCount = blockChainLastObject[0]?.number || 0;

    const blockChainChangeStream = this.blockChainCollection.watch();
    blockChainChangeStream.on('change', (change: any) => {
      this.blockChainCount++;

      if (change.fullDocument?.transactions.length > 0) {
        const transformedData = transformTransactions(change.fullDocument);
        transformedData.forEach((element) => {
          this.dailyTransactions++;
          this.server.emit('dbChange', element, {
            zkpCount: this.zkpCount,
            serviceDeviceCount: this.serviceDeviceCount,
            blockChainCount: this.blockChainCount,
            dailyTransactions: this.dailyTransactions,
          });
        });
      } else {
        this.server.emit('countUpdate', {
          zkpCount: this.zkpCount,
          serviceDeviceCount: this.serviceDeviceCount,
          blockChainCount: this.blockChainCount,
          dailyTransactions: this.dailyTransactions,
        });
      }
    });

    this.zkpCount = await this.zkpCollection.countDocuments();
    this.serviceDeviceCount =
      await this.serviceDeviceCollection.countDocuments();

    const zkpChangeStream = this.zkpCollection.watch();
    zkpChangeStream.on('change', (change: any) => {
      this.zkpCount++;
      this.dailyTransactions++;
      //console.log('ZKP.fullDocument', change.fullDocument);
      this.server.emit('dbChange', change.fullDocument, {
        zkpCount: this.zkpCount,
        serviceDeviceCount: this.serviceDeviceCount,
        blockChainCount: this.blockChainCount,
        dailyTransactions: this.dailyTransactions,
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
      this.dailyTransactions++;
      this.server.emit('dbChange', data, {
        zkpCount: this.zkpCount,
        serviceDeviceCount: this.serviceDeviceCount,
        blockChainCount: this.blockChainCount,
        dailyTransactions: this.dailyTransactions,
      });
    });
  }

  @SubscribeMessage('requestLastObjects')
  async handleRequestLastObjects(
    client: Socket,
    /* @MessageBody() data: { collection: string }, */
  ) {
    try {
      let blockChainLastObjects = await this.blockChainCollection
        .find({ $expr: { $gt: [{ $size: '$transactions' }, 0] } })
        .sort({ number: -1 })
        .limit(10)
        .toArray();

      blockChainLastObjects = blockChainLastObjects
        .map((item) => transformTransactions(item as Block))
        .flat();

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
          dailyTransactions: this.dailyTransactions,
        },
      );
    } catch (error) {
      console.error('Error fetching last objects:', error);
    }
  }
}
