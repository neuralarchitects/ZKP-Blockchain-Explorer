import React, { useEffect, useState } from 'react';
import ResponsiveTable from '../Table';
import { useNavigate } from 'react-router-dom';
import EModal from '../Modal';
import './style.scss';
import ImageLoader from '../Image';
import useFetchData from '../../../services/api/useFetchData';
import LetterAnimation from '../Animated/HackerEffect';

function transformTransactionsData(data) {
	return data.map((item) => {
		// Convert timestamp to a readable date and time
		const date = new Date(item.timestamp * 1000);
		const formattedDate = date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
		const formattedTime = date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});

		const transactionHash = item.transactionHash || '';
		const nodeId = item.nodeId || '';
		const idField = item.deviceId || item.serviceId || '';
		const eventType = item.eventType || '';

		let isZKP = false;
		let isDevice = false;

		if (String(eventType) === 'ZKPStored') {
			isZKP = true;
		} else if (
			String(eventType) === 'DeviceCreated' ||
			String(eventType) === 'DeviceRemoved'
		) {
			isDevice = true;
		}

		return {
			transactionHash,
			formattedDate,
			formattedTime,
			nodeId,
			idField,
			eventType,
			isZKP,
			isDevice,
			actions: [
				isZKP && 'ZKP',
				isZKP && 'Verify Proof',
				!isZKP && !isDevice && 'Publish/Unpublish Service Contract',
				!isZKP && isDevice && 'Share/Unshare Device',
				isZKP && !isDevice && 'IoT Data',
			].filter(Boolean),
		};
	});
}

function findItemByTransactionHash(data, transactionHash) {
	return data.find((item) => item.transactionHash === transactionHash);
}

function findItemByTransactionHashFromArray(data, transactionHash) {
	return data.find((item) => item[0] === transactionHash);
}

export default function TransactionsTable({ transactions, ...props }) {
	const navigateTo = useNavigate();
	const [isZkpModalOpen, setIsZkpModalOpen] = useState(false);
	const [proofModal, setProofModal] = useState(false);
	const [isDataModalOpen, setIsDataModalOpen] = useState(false);
	const [modalData, setModalData] = useState(null);
	const [isZKP, setIsZKP] = useState(false);
	const [isDevice, setIsDevice] = useState(false);
	const [deviceImage, setDeviceImage] = useState('');
	const [hackerAnimation, setHackerAnimation] = useState(false);
	const [proofResult, setProofResult] = useState('Proof is not verified');
	const [proofLoading, setProofLoading] = useState(false);
	const { fetchData } = useFetchData();

	const transformedData = transformTransactionsData(transactions);

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

	async function verifyProofWithTimer(theProof) {
		const timerPromise = new Promise((resolve) =>
			setTimeout(resolve, 2000)
		);

		const fetchPromise = fetchData(`contract/verify-proof`, {
			method: 'POST',
			body: {
				proof: theProof,
			},
		}).catch((error) => {
			console.error('API call failed:', error);
			return null; // Return null or appropriate value if API call fails
		});

		// Wait for the timer to finish (3 seconds)
		await timerPromise;

		// Wait for the API call to finish (even if it fails)
		const apiResult = await fetchPromise;

		if (apiResult && apiResult.data === true) {
			return apiResult;
		} else {
			throw new Error('Proof verification failed');
		}
	}

	async function handleVerifyButton() {
		setProofModal(true);
		let theProof = '';
		try {
			theProof = JSON.parse(modalData?.zkp_payload);
		} catch (error) {
			theProof = modalData?.zkp_payload;
		}

		try {
			const result = await verifyProofWithTimer(theProof);
			setProofLoading(false);
			setHackerAnimation(true);
			if (result.data === true) {
				setProofResult('Proof is Verified');
			} else {
				setProofResult('Proof is Not Verified');
			}
		} catch (error) {
			setProofLoading(false);
			setHackerAnimation(true);
			setProofResult('Proof is Not Verified');
		}
	}

    useEffect(() => {
		return () => {
			setHackerAnimation(false);
		};
	}, [proofModal]);

	function handleCellClick(row, col, item) {
		if (col === 0) {
			navigateTo(`/transactions/${item}`);
		}
	}

	const handleActionClick = async (action, items) => {
		let tempData = {
			...findItemByTransactionHash(transactions, items[0]),
			...findItemByTransactionHash(transformedData, items[0]),
		};

		try {
			if (tempData.data_payload) {
				tempData.data_payload = JSON.parse(tempData.data_payload);
			}
		} catch (error) {
			console.error(error);
		}

		setModalData(tempData);
		console.log('action', action);
		console.log('items', items);
		console.log('ghol:', tempData);

		setIsZKP(tempData.isZKP);
		setIsDevice(tempData.isDevice);

		if (action === 'ZKP') {
			setIsZkpModalOpen(true);
		} else if (action === 'Verify Proof') {
            handleVerifyButton()
			setProofModal(true);
		} else {
			await getDeviceImagesFromNode(
				tempData?.nodeId,
				tempData?.deviceType
			);
			setIsDataModalOpen(true);
		}
	};

	return (
		<>
			<ResponsiveTable
				{...props}
				titles={[
					'Transaction hash',
					'Date',
					'Time',
					'Server Name',
					'Device/Service Id',
					'Event Type',
				]}
				onActionClick={handleActionClick}
				actions={true}
				truncateColumns={[0, 4]}
				onCellClick={handleCellClick}
				data={transformedData.map(
					({
						transactionHash,
						formattedDate,
						formattedTime,
						nodeId,
						idField,
						eventType,
						actions,
					}) => [
						transactionHash,
						formattedDate,
						formattedTime,
						nodeId,
						idField,
						eventType,
						actions, // Actions column for buttons
					]
				)}
			/>

			<EModal
				className="zkp-modal"
				isOpen={isZkpModalOpen}
				title="ZKP Payload"
				onClose={() => setIsZkpModalOpen(false)}
			>
				{(isZKP && (
					<p>
						{modalData?.zkp_payload &&
							JSON.parse(modalData?.zkp_payload)}
					</p>
				)) || (
					<h2 className="no-zkp">
						The received data does not contain any ZKP.
					</h2>
				)}
			</EModal>

			<EModal
				className="proof-modal"
				isOpen={proofModal}
				closable={hackerAnimation}
				title="Proof Verifier"
				onClose={() => setProofModal(false)}
			>
				<LetterAnimation
					isFinished={hackerAnimation}
					text={proofResult}
				/>
			</EModal>

			<EModal
				className={`data-modal ${!isZKP && 'big'}`}
				isOpen={isDataModalOpen}
				title={`${isZKP == false ? 'Specification' : 'Device Data'}`}
				onClose={() => setIsDataModalOpen(false)}
			>
				{isZKP && (
					<section className="main-data">
						<div className="holder">
							<ImageLoader
								src={deviceImage}
								className="img device"
							/>
							{modalData?.data_payload?.Door && (
								<p>
									Door:{' '}
									<span>{modalData?.data_payload?.Door}</span>
								</p>
							)}
							<p>
								Temperature:{' '}
								<span>
									{modalData?.data_payload?.Temperature}
								</span>
							</p>
							<p>
								Humidity:{' '}
								<span>{modalData?.data_payload?.Humidity}</span>
							</p>
							<p>
								Button:{' '}
								<span>{modalData?.data_payload?.Button}</span>
							</p>
							<p>
								Root:{' '}
								<span>
									{String(modalData?.data_payload?.Root)}
								</span>
							</p>
							<p>
								Hardware Version:{' '}
								<span>{modalData?.data_payload?.HV}</span>
							</p>
							<p>
								Firmware Version:{' '}
								<span>{modalData?.data_payload?.FV}</span>
							</p>
						</div>
					</section>
				)}

				{isZKP == false && isDevice == false && (
					<div className="main-data">
						<ImageLoader
							width={200}
                            height={100}
							src={
								(modalData?.imageURL && modalData?.imageURL) ||
								'/img/default-service.jpg'
							}
							className="img"
						/>

						<div className="holder service">
							<p>
								IoT Server Id: <span>{modalData?.nodeId}</span>
							</p>
							<p>
								Event Type: <span>{modalData?.eventType}</span>
							</p>
							<p>
								Service Name:{' '}
								<span>{modalData?.serviceName}</span>
							</p>
							<p>
								Service Id: <span>{modalData?.serviceId}</span>
							</p>
							<p>
								Service Type:{' '}
								<span>{modalData?.serviceType}</span>
							</p>
							<p>
								Description:{' '}
								<span className="text-wrap">
									{modalData?.description}
								</span>
							</p>
							<p>
								Execution Price:{' '}
								<span>{modalData?.executionPrice}</span>
							</p>
							<p>
								Installation Price:{' '}
								<span>{modalData?.installationPrice}</span>
							</p>
						</div>
					</div>
				)}

				{isZKP == false && isDevice == true && (
					<div className="main-data">
						<ImageLoader src={deviceImage} className="img device" />
						<div className="holder service">
							<p>
								IoT Server Id: <span>{modalData?.nodeId}</span>
							</p>
							<p>
								Event Type: <span>{modalData?.eventType}</span>
							</p>
							<p>
								Device Name:{' '}
								<span>{modalData?.serviceName}</span>
							</p>
							<p>
								Device Id: <span>{modalData?.deviceId}</span>
							</p>
							<p>
								Device Type:{' '}
								<span>{modalData?.deviceType}</span>
							</p>
							<p>
								Owner Id: <span>{modalData?.ownerId}</span>
							</p>
						</div>
					</div>
				)}
			</EModal>
		</>
	);
}
