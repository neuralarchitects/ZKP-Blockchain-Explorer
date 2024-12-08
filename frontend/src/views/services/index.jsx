import React, { useEffect, useState } from "react";
import "./style.scss";
import useFetchData from "../../services/api/useFetchData";
import Spinner from "../../components/ui/Spinner";
import ServicesBoxes from "../../components/containers/ServicesBoxes";
import ServicesTable from "../../components/ui/ServicesTable";

export default function Services() {
	const { fetchData, loading, error } = useFetchData();
	const [sharedServices, setSharedServices] = useState([])

	const fetchAllServices = async () => {
		try {
			const services = await fetchData(
				"service/get-all-published-services",
				{ cacheDuration: 60000 }
			);
			setSharedServices(services.data)
			console.log("Services:", services);
		} catch (error) {
			console.error("Error fetching services:", error);
		}
	};

	useEffect(() => {
		fetchAllServices();
	}, []);

	return (
		<main className="services-container">
			<h1>All Published Services</h1>
			{(loading && (
				<div className="loading-container">
					<Spinner type="rotate" />
				</div>
			)) || <ServicesTable data={sharedServices} />}
		</main>
	);
}
