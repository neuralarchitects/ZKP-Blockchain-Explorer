import React, { useEffect, useState } from 'react';
import './style.scss';
import useFetchData from '../../services/api/useFetchData';
import DevicesBoxes from '../../components/containers/DevicesBoxes';
import Spinner from '../../components/ui/Spinner';
import DevicesTable from '../../components/ui/DevicesTable';
import ImageLoader from '../../components/ui/Image';

export default function Devices() {
	const { fetchData, loading, error } = useFetchData();
	const [sharedDevices, setSharedDevices] = useState([]);

	const fetchAllDevices = async () => {
		try {
			const devices = await fetchData('device/get-all-shared-devices'/* , {
				cacheDuration: 60000,
			} */);
			const updatedDevices = devices.data.map((device) => {
				return {
					...device,
					hardwareVersion: Math.floor(Math.random() * 2) + 1, // Random between 1 and 2
					firmwareVersion: Math.floor(Math.random() * 3) + 1, // Random between 1 and 3
				};
			});
			setSharedDevices(updatedDevices);
		} catch (error) {
			console.error('Error fetching devices:', error);
		}
	};

	useEffect(() => {
		fetchAllDevices();
	}, []);

	const getResponsiveImage = (folder) => {
		const width = window.innerWidth;

		// Choose the image based on screen width
		if (width <= 500) {
			return `/img/banners/${folder}/500.jpg`;
		} else if (width <= 900) {
			return `/img/banners/${folder}/900.jpg`;
		} else if (width <= 1367) {
			return `/img/banners/${folder}/1367.jpg`;
		} else {
			return `/img/banners/${folder}/2200.jpg`;
		}
	};

	return (
		<main className="devices-container">
			{/* <h1>All Shared Devices</h1> */}
			<ImageLoader
				className="banner"
				src={getResponsiveImage(1)}
				alt={`Shared Devices Banner`}
				width={'100%'}
				height={'auto'}
				style={{ borderRadius: '10px' }}
			/>
			{(loading && (
				<div className="loading-container">
					<Spinner type="rotate" />
				</div>
			)) || <DevicesTable data={sharedDevices} />}
		</main>
	);
}
