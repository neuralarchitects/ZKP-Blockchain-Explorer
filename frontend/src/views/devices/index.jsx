import React, { useEffect, useState } from "react";
import "./style.scss";
import useFetchData from "../../services/api/useFetchData";
import DevicesBoxes from "../../components/containers/DevicesBoxes";
import Spinner from "../../components/ui/Spinner";
import DevicesTable from "../../components/ui/DevicesTable";

export default function Devices() {
	const { fetchData, loading, error } = useFetchData();
	const [sharedDevices, setSharedDevices] = useState([]);

	const fetchAllDevices = async () => {
		try {
			const devices = await fetchData("device/get-all-shared-devices", {
				cacheDuration: 60000,
			});
			const updatedDevices = devices.data.map((device) => {
				return {
				  ...device,
				  hardwareVersion: Math.floor(Math.random() * 2) + 1,   // Random between 1 and 2
				  firmwareVersion: Math.floor(Math.random() * 3) + 1,   // Random between 1 and 3
				};
			  });
			setSharedDevices(updatedDevices);
		} catch (error) {
			console.error("Error fetching devices:", error);
		}
	};

	useEffect(() => {
		fetchAllDevices();
	}, []);


	return (
		<main className="devices-container">
			<h1>All Shared Devices</h1>
			{(loading && (
				<div className="loading-container">
					<Spinner type="rotate" />
				</div>
			)) || <DevicesTable data={sharedDevices} />}
		</main>
	);
}
