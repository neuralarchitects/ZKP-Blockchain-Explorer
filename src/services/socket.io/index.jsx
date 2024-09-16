import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";

export function useSocketConnection(setData) {
	const [latestTransactions, setLatestTransactions] = useState([]);

	useEffect(() => {
		const socket = io("http://developer.fidesinnova.io:3000");

		socket.on("connect", () => {
			console.log("Connected to the server");
			socket.emit("requestLastObjects");
			toast.success("Services fetched from backend");
		});

		socket.on("disconnect", () => {
			console.log("Disconnected from the server");
		});

		socket.on("lastObjects", (objects) => {
			console.log("Received last objects:", objects);

			setLatestTransactions(() => {
				return objects
					.sort((a, b) => b.timestamp - a.timestamp)
					.slice(0, 10);
			});
		});

		socket.on("dbChange", (newData) => {
			console.log("Database change detected:", newData);
			toast.success("Database changed");

			setLatestTransactions((prevTransactions) => {
				return [...prevTransactions, newData]
					.sort((a, b) => b.timestamp - a.timestamp)
					.slice(0, 10);
			});
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("dbChange");
			socket.off("lastObjects");
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (setData) {
			setData(latestTransactions);
		}
	}, [latestTransactions, setData]);
}
