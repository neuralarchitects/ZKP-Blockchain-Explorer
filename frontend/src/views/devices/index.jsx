import React, { useEffect } from "react";
import "./style.scss";
import useFetchData from "../../services/api/useFetchData";

export default function Devices() {
	const { fetchData, loading, error } = useFetchData();

	const fetchAllDevices = async () => {
		try {
			const devices = await fetchData("device/get-all-shared-devices", {
				cacheDuration: 60000,
			});
			console.log("Devices:", devices);
		} catch (error) {
			console.error("Error fetching devices:", error);
		}
	};

	useEffect(() => {
		fetchAllDevices();
	}, []);

	return <main className="devices-container">
        <h1>All Shared Devices</h1>
    </main>;
}
