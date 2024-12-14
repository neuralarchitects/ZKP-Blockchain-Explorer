import React, { useEffect, useState } from "react";
import "./style.scss";
import useFetchData from "../../services/api/useFetchData";
import Spinner from "../../components/ui/Spinner";
import ServicesBoxes from "../../components/containers/ServicesBoxes";
import ServicesTable from "../../components/ui/ServicesTable";
import ImageLoader from "../../components/ui/Image";

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

	const getResponsiveImage = (folder) => {
		const width = window.innerWidth;

		// Choose the image based on screen width
		if (width <= 500) {
			return `/img/banners/${folder}/${folder}-500.jpg`;
		} else if (width <= 900) {
			return `/img/banners/${folder}/${folder}-900.jpg`;
		} else if (width <= 1367) {
			return `/img/banners/${folder}/${folder}-1367.jpg`;
		} else {
			return `/img/banners/${folder}/${folder}-2200.jpg`;
		}
	};

	return (
		<main className="services-container">
			{/* <h1>All Published Services</h1> */}
			<ImageLoader
				className="banner"
				src={getResponsiveImage(2)}
				alt={`Published Services Banner`}
				width={'100%'}
				height={'auto'}
				style={{borderRadius: '10px'}}
			/>
			{(loading && (
				<div className="loading-container">
					<Spinner type="rotate" />
				</div>
			)) || <ServicesTable data={sharedServices} />}
		</main>
	);
}
