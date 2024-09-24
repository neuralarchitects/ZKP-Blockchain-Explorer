import React, { useEffect } from "react";
import "./style.scss";
import useFetchData from "../../services/api/useFetchData";

export default function Services() {
	const { fetchData, loading, error } = useFetchData();

	const fetchAllServices = async () => {
		try {
			const services = await fetchData(
				"service/get-all-published-services",
				{ cacheDuration: 60000 }
			);
			console.log("Services:", services);
		} catch (error) {
			console.error("Error fetching services:", error);
		}
	};

	useEffect(() => {
		fetchAllServices();
	}, []);

	return <div>{loading && "Loading"}</div>;
}
