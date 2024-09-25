import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { MongoClient, Db, Collection } from "mongodb";

@WebSocketGateway({
	cors: {
		origin: "*",
	},
})
export class EventsGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private zkpCount: number = 0;
	private serviceDeviceCount: number = 0;
	private server: Server;
	private db: Db;
	private zkpCollection: Collection;
	private serviceDeviceCollection: Collection;

	// MongoDB connection details
	private readonly mongoUrl = process.env.MONGO_CONNECTION;
	private readonly dbName = "smartcontract_db";
	private readonly zkpCollectionName = "zkp_smartcontract";
	private readonly serviceDeviceCollectionName = "services_devices_smartcontract";

	// Called when the gateway is initialized
	afterInit(server: Server) {
		this.server = server;
		console.log("WebSocket server initialized");
		this.connectToMongoDB();
	}

	// Called when a client connects
	handleConnection(client: Socket) {
		console.log("Client connected:", client.id);
	}

	// Called when a client disconnects
	handleDisconnect(client: Socket) {
		console.log("Client disconnected:", client.id);
	}

	private async connectToMongoDB() {
		const client = new MongoClient(this.mongoUrl);
		await client.connect();
		console.log("Socket Connected to MongoDB");
		this.db = client.db(this.dbName);

		this.zkpCollection = this.db.collection(this.zkpCollectionName);

		this.serviceDeviceCollection = this.db.collection(
			this.serviceDeviceCollectionName
		);

		this.zkpCount = await this.zkpCollection.countDocuments();
    	this.serviceDeviceCount = await this.serviceDeviceCollection.countDocuments();

		const zkpChangeStream = this.zkpCollection.watch();
		zkpChangeStream.on("change", (change: any) => {
			this.zkpCount++;
			this.server.emit("dbChange", change.fullDocument, {
				zkpCount: this.zkpCount,
				serviceDeviceCount: this.serviceDeviceCount,
			});
		});

		const serviceDeviceChangeStream = this.serviceDeviceCollection.watch();
		serviceDeviceChangeStream.on("change", (change: any) => {
			const { TransactionTime, ...rest } = change.fullDocument;
			const data = {
				...rest,
				timestamp: TransactionTime,
			};
			this.serviceDeviceCount++;
			this.server.emit("dbChange", data, {
				zkpCount: this.zkpCount,
				serviceDeviceCount: this.serviceDeviceCount,
			});
		});
	}


	@SubscribeMessage("requestLastObjects")
	async handleRequestLastObjects(
		client: Socket
		/* @MessageBody() data: { collection: string }, */
	) {
		try {
			const zkpLastObjects = await this.zkpCollection.find({}).sort({ timestamp: -1 }).limit(10).toArray();

			const serviceDeviceLastObjects = await this.serviceDeviceCollection.find({}).sort({ timestamp: -1 }).limit(10).toArray();

			const updatedServiceDeviceLastObjects =
				serviceDeviceLastObjects.map((obj) => {
					const { TransactionTime, ...rest } = obj;
					return {
						...rest,
						timestamp: TransactionTime,
					};
				});

			client.emit("lastObjects", [
				...zkpLastObjects,
				...updatedServiceDeviceLastObjects,
			], {
				zkpCount: this.zkpCount,
				serviceDeviceCount: this.serviceDeviceCount,
			});
		} catch (error) {
			console.error("Error fetching last objects:", error);
		}
	}
}
