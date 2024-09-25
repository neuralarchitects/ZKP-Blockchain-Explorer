import React, { useEffect, useState } from "react";
import "./style.scss";
import useFetchData from "../../services/api/useFetchData";
import DeviceBox from "../../components/ui/DeviceBox";
import DevicesBoxes from "../../components/containers/DevicesBoxes";
import Spinner from "../../components/ui/Spinner";

export default function Devices() {
	const { fetchData, loading, error } = useFetchData();
	const [sharedDevices, setSharedDevices] = useState([]);

	const fetchAllDevices = async () => {
		try {
			const devices = await fetchData("device/get-all-shared-devices", {
				cacheDuration: 60000,
			});
			console.log("Devices:", devices);
			setSharedDevices(devices.data);
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
			)) || <DevicesBoxes data={sharedDevices} />}
		</main>
	);
}
