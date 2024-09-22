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
			});
		}

		if (!socket.hasListeners("disconnect")) {
			socket.on("disconnect", () => {
				console.log("Disconnected from the server");
			});
		}

		if (!socket.hasListeners("lastObjects")) {
			socket.on("lastObjects", (objects, dbCount) => {
				//console.log("Received last objects:", objects);
				setLatestTransactions(() =>
					objects
						.sort((a, b) => b.timestamp - a.timestamp)
						.slice(0, 10)
				);
				setContractCounts({
					serviceDeviceCount: dbCount.serviceDeviceCount,
					zkpCount: dbCount.zkpCount,
				});
			});
		}

		if (!socket.hasListeners("dbChange")) {
			socket.on("dbChange", (newData, dbCount) => {
				//console.log("Database change detected:", newData);
				setLatestTransactions((prevTransactions) =>
					[...prevTransactions, newData]
						.sort((a, b) => b.timestamp - a.timestamp)
						.slice(0, 10)
				);
				setContractCounts({
					serviceDeviceCount: dbCount.serviceDeviceCount,
					zkpCount: dbCount.zkpCount,
				});
			});
		}

		// Cleanup the listeners when the component unmounts
		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("lastObjects");
			socket.off("dbChange");
		};
	}, []);

	return {
		serviceDeviceCount: contractCounts.serviceDeviceCount,
		zkpCount: contractCounts.zkpCount,
		latestTransactions: latestTransactions,
	};
}
