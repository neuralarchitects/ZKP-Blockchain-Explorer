import React, { useEffect, useState } from 'react';
import './style.scss';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchData from '../../services/api/useFetchData';
import TransactionIcon from '../../icons/transaction';
import CopyIcon from '../../icons/copy';
import {
	copyText,
	formatBigInt,
	formatUnixTimestamp,
	timeStamptimeAgo,
} from '../../utility/functions';
import { Toaster } from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { HiCheckCircle, HiOutlineClock } from 'react-icons/hi';
import GradientCircle from '../../components/ui/GradientCircle';
import JsonDisplay from '../../components/ui/JsonDisplay';
import ImageLoader from '../../components/ui/Image';

export default function TransactionDetail() {
	const { fetchData, loading } = useFetchData();
	const [detailData, setDetailData] = useState({});
	const { id } = useParams();
	const decodedId = decodeURIComponent(id);
	const navigateTo = useNavigate();
	const [deviceImage, setDeviceImage] = useState('');

	function getDeviceUrlByType(devices, type) {
		const device = devices.find((device) => {
			const regex = new RegExp(`^${type.replace(/[-_]/g, '[-_]')}$`, 'i'); // Create a regex to match both - and _
			return regex.test(device.type); // Test the type against the regex
		});
		return device ? device.url : null; // Return the URL if found, otherwise null
	}

	async function getDeviceImagesFromNode(nodeId, deviceType) {
		let nodeApiUrl = '';
		if (nodeId == 'developer.fidesinnova.io') {
			nodeApiUrl = `https://${nodeId}/app/v1/devices`;
		} else {
			nodeApiUrl = `https://panel.${nodeId}/app/v1/devices`;
		}
		try {
			const res = await fetchData(nodeApiUrl, {
				method: 'GET',
			});
			setDeviceImage(getDeviceUrlByType(res.data, String(deviceType)));
		} catch (error) {
			console.error(error);
		}
	}

	async function getTransactionDetail() {
		const res = await fetchData(
			`contract/search-data?search=${encodeURIComponent(id)}`
		);

		if (res.data.length > 0) {
			let selectedItem =
				res.data.find(
					(item) => item.commitmentData || item.zkp_payload
				) || res.data[0];

			try {
				if (selectedItem.data_payload) {
					selectedItem.data_payload = JSON.parse(
						selectedItem.data_payload
					);
					if (selectedItem.deviceType) {
						getDeviceImagesFromNode(
							selectedItem.nodeId,
							selectedItem.deviceType
						);
					}
				}
			} catch (error) {}

			setDetailData(selectedItem);
		} else {
			setDetailData(false);
			navigateTo('/');
		}
	}

	useEffect(() => {
		getTransactionDetail();
	}, [decodedId]);

	return (
		<main className="transaction-detail-container">
			<h1 className="main-header">Transaction Details</h1>
			<Toaster />
			{loading == false && detailData != false && (
				<>
					{/* <div className="hash-holder">
						<TransactionIcon className={'icon'} />
						<p>{detailData.transactionHash}</p>
						<CopyIcon
							onClick={() =>
								copyText(
									detailData.transactionHash,
									'Transaction Hash'
								)
							}
							className={'icon copy'}
						/>
					</div> */}
					<div className="grid-container">
						<p className="title">Transaction hash</p>
						<div className="hash-holder">
							<p>{detailData.transactionHash}</p>
							<CopyIcon
								onClick={() =>
									copyText(
										detailData.transactionHash,
										'Transaction Hash'
									)
								}
								className={'icon copy'}
							/>
						</div>

						<p className="title">Status and method</p>

						<div className="badge-holder">
							<Badge
								Icon={HiCheckCircle}
								color={'#23543E'}
								text={'Success'}
							/>
						</div>

						<p className="title">Timestamp</p>
						<div className="timestamp-holder">
							<HiOutlineClock className="icon" />
							<p className="right-data">
								{timeStamptimeAgo(
									detailData?.timestamp ||
										detailData?.transactionTime
								)}{' '}
								<span>|</span>{' '}
								{formatUnixTimestamp(
									detailData?.timestamp ||
										detailData?.transactionTime
								)}{' '}
								<span>{`| Confirmed within <= 4 secs`}</span>
							</p>
						</div>

						<div className="line"></div>

						<p className="title">From</p>
						<div className="wallet-holder">
							<GradientCircle width={24} height={24} />
							<p
								onClick={() =>
									copyText(detailData.from, 'Wallet')
								}
							>
								{detailData.from}
							</p>
							<CopyIcon
								onClick={() =>
									copyText(detailData.from, 'Wallet')
								}
								className="icon"
							/>
						</div>

						<p className="title">To</p>
						<div className="wallet-holder">
							<GradientCircle width={24} height={24} />
							<p
								onClick={() =>
									copyText(detailData.to, 'Wallet')
								}
							>
								{detailData.to}
							</p>
							<CopyIcon
								onClick={() =>
									copyText(detailData.to, 'Wallet')
								}
								className="icon"
							/>
						</div>

						<div className="line"></div>

						<p className="title">Value</p>
						<p className="right-data">
							{detailData?.value || 0} FDS
						</p>

						<p className="title">Transaction fee</p>
						<p className="right-data">
							{formatBigInt(detailData.gasFee)} FDS
						</p>

						{detailData?.zkp_payload && (
							<>
								<div className="line"></div>
								<h1>ZKP Details</h1>
								<p></p>

								<p className="title">Device</p>
								<p className="right-data">
									<ImageLoader
										src={deviceImage}
										className="device-image"
									/>
								</p>

								{detailData?.data_payload &&
									Object.entries(detailData?.data_payload)
										.sort(
											([keyA], [keyB]) =>
												keyB.length - keyA.length
										)
										.map(([key, value]) => (
											<>
												<p className="title" key={key}>
													{key.replace(/_/g, ' ')}
												</p>
												<p className="right-data">
													{key === 'Root'
														? String(value)
														: value}
												</p>
											</>
										))}
								<p className="title">ZKP Payload</p>
								<p className="right-data commitment-data">
									<JsonDisplay
										jsonData={JSON.parse(
											detailData.zkp_payload
										)}
									/>
								</p>
							</>
						)}

						{detailData?.commitmentData && (
							<>
								<div className="line"></div>

								<h1>Commitment Details</h1>
								<p></p>

								<p className="title">Commitment ID</p>
								<p className="right-data">
									{detailData.commitmentID}
								</p>

								<p className="title">IoT Developer Name</p>
								<p className="right-data">
									{detailData.iot_manufacturer_name}
								</p>

								<p className="title">IoT Device Name</p>
								<p className="right-data">
									{detailData.iot_device_name}
								</p>

								<p className="title">Device Hardware Version</p>
								<p className="right-data">
									{detailData.device_hardware_version}
								</p>

								<p className="title">Device Firmware Version</p>
								<p className="right-data">
									{detailData.firmware_version}
								</p>
								<p className="title">Commitment Data</p>
								<p className="right-data commitment-data">
									<JsonDisplay
										jsonData={JSON.parse(
											detailData.commitmentData
										)}
									/>
								</p>
							</>
						)}
					</div>
				</>
			)}
			{loading == true && (
				<div className="loading-container">
					<Spinner type="rotate" />
				</div>
			)}
		</main>
	);
}
