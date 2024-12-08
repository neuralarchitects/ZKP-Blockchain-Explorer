import React, { useEffect, useState } from 'react';
import useFetchData from '../../../services/api/useFetchData';
import Slider from 'react-slick';
import './style.scss';
import ImageLoader from '../Image';
import Spinner from '../Spinner';

async function isImageAvailable(url) {
	try {
		const response = await fetch(url, { method: 'HEAD' });
		return response.ok;
	} catch (error) {
		return false;
	}
}

async function getUniqueAvailableDeviceUrls(devices) {
	const uniqueDevicesMap = new Map();

	for (const device of devices) {
		if (
			!uniqueDevicesMap.has(device.type) &&
			(await isImageAvailable(device.url))
		) {
			uniqueDevicesMap.set(device.type, device.url);
		}
	}

	return Array.from(uniqueDevicesMap.values());
}

export default function DevicesSlideShow() {
	const [isLoading, setIsLoading] = useState(true);
	const [images, setImages] = useState([]);
	const { fetchData } = useFetchData();

	useEffect(() => {
		async function getData() {
			let tempDevices = [];
			await fetch('/Download/nodes.json')
				.then((response) => response.json())
				.then((data) => (tempDevices = data));

			let tempResults = [];

			for (const item of tempDevices) {
				try {
					const res = await fetchData(
						`https://${item.API}/v1/devices`,
						{
							method: 'GET',
						}
					);
					tempResults.push(...res.data);
				} catch (error) {
					console.error(error);
				}
			}

			const urls = await getUniqueAvailableDeviceUrls(tempResults);
			setImages(urls);
			setIsLoading(false);
		}
		getData();
	}, []);

	const settings = {
		autoplay: true,
		autoplaySpeed: 3500,
		dots: false,
		infinite: true,
		speed: 1500,
		slidesToShow: 3,
		slidesToScroll: 1,
		swipe: false,
		draggable: false,
	};

	return (
		<>
			{isLoading && (
				<div className="loading-holder">
					<Spinner />
				</div>
			)}
			<Slider {...settings}>
				{!isLoading &&
					images.length > 0 &&
					images.map((url) => (
						<div className="device-image">
							<figure className="image-holder">
								<ImageLoader
									className="image"
									src={url}
									alt={'Device Logo'}
									width={100}
									height={100}
								/>
							</figure>
						</div>
					))}
			</Slider>
		</>
	);
}
