import { useEffect, useState } from "react";
import io from "socket.io-client";

export function useSocketConnection() {
	const [latestTransactions, setLatestTransactions] = useState([]);
	const [contractCounts, setContractCounts] = useState({});

	useEffect(() => {
		const socket = io("https://fidesf2-explorer.fidesinnova.io:3000");

		// Set up socket listeners only once
		if (!socket.hasListeners("connect")) {
			socket.on("connect", () => {
				console.log("Connected to the server");
				socket.emit("requestLastObjects");
				socket.emit("requestCollectionCounts");
			});
		}

		if (!socket.hasListeners("disconnect")) {
			socket.on("disconnect", () => {
				console.log("Disconnected from the server");
			});
		}

		if (!socket.hasListeners("lastObjects")) {
			socket.on("lastObjects", (objects) => {
				//console.log("Received last objects:", objects);
				setLatestTransactions(() =>
					objects
						.sort((a, b) => b.timestamp - a.timestamp)
						.slice(0, 10)
				);
			});
		}

		if (!socket.hasListeners("collectionCounts")) {
			socket.on("collectionCounts", (objects) => {
				//console.log("Received collection counts:", objects);
				setContractCounts({
					serviceDeviceCount: objects.serviceDeviceCount,
					zkpCount: objects.zkpCount,
				});
			});
		}

		if (!socket.hasListeners("dbChange")) {
			socket.on("dbChange", (newData) => {
				//console.log("Database change detected:", newData);
				setLatestTransactions((prevTransactions) =>
					[...prevTransactions, newData]
						.sort((a, b) => b.timestamp - a.timestamp)
						.slice(0, 10)
				);
			});
		}

		// Cleanup the listeners when the component unmounts
		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("lastObjects");
			socket.off("collectionCounts");
			socket.off("dbChange");
		};
	}, []);

	return {
		serviceDeviceCount: contractCounts.serviceDeviceCount,
		zkpCount: contractCounts.zkpCount,
		latestTransactions: latestTransactions,
	};
}
