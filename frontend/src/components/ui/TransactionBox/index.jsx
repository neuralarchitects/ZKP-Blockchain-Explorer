import React, { useEffect, useState } from 'react';
import './style.scss';
import Badge from '../Badge';
import {
	HiIdentification,
	HiInformationCircle,
	HiServer,
} from 'react-icons/hi';
import { MdDevices } from 'react-icons/md';
import { BiCoin, BiNetworkChart } from 'react-icons/bi';
import { FaDollarSign } from 'react-icons/fa';
import TransactionIcon from '../../../icons/transaction';
import GradientCircle from '../GradientCircle';
import CopyIcon from '../../../icons/copy';
import DocumentIcon from '../../../icons/document';
import Button from '../Button';
import AnimatedComponent from '../Animated/Component';
import { iphoneAnimation } from '../../../utility/framer-transitions';
import EModal from '../Modal';
import ImageLoader from '../Image';
import { useNavigate } from 'react-router-dom';
import {
	copyText,
	formatBigInt,
	timeStamptimeAgo,
} from '../../../utility/functions';
import { motion } from 'framer-motion';
import useFetchData from '../../../services/api/useFetchData';
import toast from 'react-hot-toast';
import HackerEffect from '../Animated/HackerEffect';
import Spinner from '../Spinner';

function formatWalletAddress(address) {
	try {
		return address.slice(0, 4) + '..' + address.slice(-4);
	} catch (error) {
		return address;
	}
}

function formatTransactionHash(str, length) {
	const string = String(str);
	try {
		if (string.length <= length) {
			return str;
		}

		const start = str.substring(0, Math.ceil(length / 2));
		const end = str.substring(str.length - Math.floor(length / 2));

		return `${start}...${end}`;
	} catch (error) {
		return str;
	}
}

export default function TransactionBox({ data }) {
	const [proofLoading, setProofLoading] = useState(false);
	const [isZKP, setIsZKP] = useState(false);
	const [isDevice, setIsDevice] = useState(false);
	const [dataPayload, setDataPayload] = useState({});
	const [proofModal, setProofModal] = useState(false);
	const [proofResult, setProofResult] = useState('Proof is not verified');
	const [hackerAnimation, setHackerAnimation] = useState(false);
	const [isZkpModalOpen, setIsZkpModalOpen] = useState(false);
	const [isDataModalOpen, setIsDataModalOpen] = useState(false);
	const {
		from: fromWallet,
		to: intoWallet,
		transactionHash,
		timestamp,
		gasFee,
		eventType,
		data_payload,
		deviceId,
		deviceType,
		firmwareVersion,
		hardwareVersion,
		nodeId,
		zkp_payload,
		serviceId,
		serviceType,
		name: serviceName,
		ownerId,
		imageURL,
		description,
		executionPrice,
		installationPrice,
	} = data;
	const navigateTo = useNavigate();
	const [deviceImage, setDeviceImage] = useState('');
	const [shadow, setShadow] = useState('none');
	const [border, setBorder] = useState('2px solid transparent');
	const [borderBottom, setBorderBottom] = useState('2px solid #2d2f34');
	const { fetchData, loading } = useFetchData();

	useEffect(() => {
		return () => {
			setHackerAnimation(false);
		};
	}, [proofModal]);

	function getDeviceUrlByType(devices, type) {
		const device = devices.find((device) => {
			const regex = new RegExp(`^${type.replace(/[-_]/g, '[-_]')}$`, 'i'); // Create a regex to match both - and _
			return regex.test(device.type); // Test the type against the regex
		});
		return device ? device.url : null; // Return the URL if found, otherwise null
	}

	async function getDeviceImagesFromNode(deviceType) {
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
			theProof = JSON.parse(zkp_payload);
		} catch (error) {
			theProof = zkp_payload;
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
		if (data_payload) {
			setDataPayload(JSON.parse(data_payload));
		}
	}, [data_payload]);

	useEffect(() => {
		if (String(eventType) == 'ZKPStored') {
			setIsZKP(true);
		} else {
			if (
				String(eventType) == 'DeviceCreated' ||
				String(eventType) == 'DeviceRemoved'
			) {
				setIsDevice(true);
			}
		}
	}, [eventType]);

	return (
		<AnimatedComponent animation={iphoneAnimation(0.5)}>
			<motion.div className="transaction-box-container">
				<section className="box-container">
					<div className="box-header">
						<TransactionIcon className={'icon'} />
						<h1
							onClick={() => {
								const encodedHash =
									encodeURIComponent(transactionHash);
								navigateTo(`/tx/${encodedHash}`);
							}}
						>
							{transactionHash}
						</h1>
					</div>
					<div className="box-data">
						<HiInformationCircle className="icon" />
						<p>{isZKP ? 'ZKP Stored' : 'Smart Contract Call'}</p>
					</div>
					<div className="box-data">
						<HiServer className="icon" />
						<p>
							Server: <span>{nodeId}</span>
						</p>
					</div>
					{isZKP && (
						<>
							<div className="box-data">
								<MdDevices className={'icon'} />
								<p>
									Type: <span>{deviceType}</span>
								</p>
							</div>
							<div className="box-data">
								<HiIdentification className={'icon'} />
								<p>
									Id: <span>{deviceId}</span>
								</p>
							</div>
						</>
					)}

					{isZKP == false && isDevice == false && (
						<>
							<div className="box-data">
								<BiNetworkChart className={'icon'} />
								<p>
									Name: <span>{serviceName}</span>
								</p>
							</div>
							<div className="box-data">
								<HiIdentification className={'icon'} />
								<p>
									Id: <span>{serviceId}</span>
								</p>
							</div>
						</>
					)}
					<div className="box-data">
						<FaDollarSign className={'icon'} />
						<p>
							Fee: <span>{formatBigInt(gasFee) || 0} FDS</span>
						</p>
					</div>

					<div className="button-contianer">
						{isZKP && (
							<>
								<Button
									onClick={() => setIsZkpModalOpen(true)}
									className={'button'}
								>
									ZKP
								</Button>
								<Button
									onClick={handleVerifyButton}
									loading={proofLoading}
									className={'button'}
								>
									Verify Proof
								</Button>
							</>
						)}

						<Button
							onClick={() => {
								getDeviceImagesFromNode(deviceType);
								setIsDataModalOpen(true);
							}}
							className={'button'}
						>
							{isZKP == false &&
								isDevice == false &&
								'Publish/Unpublish Service Contract'}
							{isZKP == false &&
								isDevice == true &&
								'Share/Unshare Device'}
							{isZKP == true && isDevice == false && 'IoT Data'}
						</Button>
					</div>
				</section>

				{/* <div className="left-data">
					<div className="badge">
						<Badge
							Icon={HiInformationCircle}
							color={isZKP ? '#0ea1ca' : '#2A4364'}
							text={`${
								isZKP ? 'ZKP Stored' : 'Smart Contract Call'
							}`}
						/>
					</div>
					<div className="transaction-hash">
						<TransactionIcon className={'icon'} />
						<p
							onClick={() => {
								const encodedHash =
									encodeURIComponent(transactionHash);
								navigateTo(`/tx/${encodedHash}`);
							}}
							className="hash"
						>
							{transactionHash}
						</p>
						<p className="transaction-time">
							{timeStamptimeAgo(timestamp)}
						</p>
					</div>
				</div>

				<div className="transaction-wallets">
					<div className="holder">
						<div
							onClick={() =>
								copyText(fromWallet, 'Wallet address')
							}
							className="wallet"
						>
							<HiArrowDown className="icon" />
							<GradientCircle width={24} height={24} />
							<p>{formatWalletAddress(fromWallet)}</p>
							<CopyIcon className="icon copy" />
						</div>
						<div
							onClick={() =>
								copyText(intoWallet, 'Wallet address')
							}
							className="wallet"
						>
							<DocumentIcon className="icon start" />
							<p>{formatWalletAddress(intoWallet)}</p>
							<CopyIcon className="icon copy" />
						</div>
					</div>
				</div>
				<div className="button-container">
					{isZKP && (
						<Button
							onClick={() => setIsZkpModalOpen(true)}
							className={'button'}
						>
							ZKP
						</Button>
					)}

					<Button
						onClick={() => {
							getDeviceImagesFromNode(deviceType);
							setIsDataModalOpen(true);
						}}
						className={'button'}
					>
						{isZKP == false &&
							isDevice == false &&
							'Publish/Unpublish Service Contract'}
						{isZKP == false &&
							isDevice == true &&
							'Share/Unshare Device'}
						{isZKP == true && isDevice == false && 'IoT Data'}
					</Button>

					{isZKP && (
						<Button
							onClick={handleVerifyButton}
							loading={proofLoading}
							className={'button'}
						>
							Verify Proof
						</Button>
					)}
				</div>

				<div className="transaction-value">
					{isZKP && (
						<div className="holder">
							<p>
								IoT Server Id: <span>{nodeId}</span>
							</p>
							<p>
								Device Type: <span>{deviceType}</span>
							</p>
							<p>
								Device Id: <span>{deviceId}</span>
							</p>
							<p>
								Hardware Version :{' '}
								<span>{hardwareVersion}</span>
							</p>
							<p>
								Firmware Version: <span>{firmwareVersion}</span>
							</p>
							<p>
								Fee: <span>{formatBigInt(gasFee)} FDS</span>
							</p>
						</div>
					)}

					{isZKP == false && isDevice == false && (
						<div className="holder">
							<p>
								IoT Server Id: <span>{nodeId}</span>
							</p>
							<p>
								Service Name: <span>{serviceName}</span>
							</p>
							<p>
								Service Type: <span>{serviceType}</span>
							</p>
							<p>
								Service Id: <span>{serviceId}</span>
							</p>

							<p>
								Fee: <span>{formatBigInt(gasFee)}</span>
							</p>
						</div>
					)}
					{isZKP == false && isDevice == true && (
						<div className="holder">
							<p>
								IoT Server Id: <span>{nodeId}</span>
							</p>
							<p>
								Device Name: <span>{serviceName}</span>
							</p>
							<p>
								Device Type: <span>{deviceType}</span>
							</p>
							<p>
								Device Id: <span>{deviceId}</span>
							</p>

							<p>
								Fee: <span>{formatBigInt(gasFee)}</span>
							</p>
						</div>
					)}
				</div> */}
			</motion.div>

			<EModal
				className="zkp-modal"
				isOpen={isZkpModalOpen}
				title="ZKP Payload"
				onClose={() => setIsZkpModalOpen(false)}
			>
				{(isZKP && <p>{zkp_payload && JSON.parse(zkp_payload)}</p>) || (
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
				<HackerEffect isFinished={hackerAnimation} text={proofResult} />
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
							{dataPayload.Door && (
								<p>
									Door: <span>{dataPayload.Door}</span>
								</p>
							)}
							<p>
								Temperature:{' '}
								<span>{dataPayload.Temperature}</span>
							</p>
							<p>
								Humidity: <span>{dataPayload.Humidity}</span>
							</p>
							<p>
								Button: <span>{dataPayload.Button}</span>
							</p>
							<p>
								Root: <span>{String(dataPayload.Root)}</span>
							</p>
							<p>
								Hardware Version: <span>{dataPayload.HV}</span>
							</p>
							<p>
								Firmware Version: <span>{dataPayload.FV}</span>
							</p>
						</div>
					</section>
				)}

				{isZKP == false && isDevice == false && (
					<div className="main-data">
						<ImageLoader
							height={200}
							width={300}
							src={
								(imageURL && imageURL) ||
								'/img/default-service.jpg'
							}
							className="img"
						/>

						<div className="holder service">
							<p>
								IoT Server Id: <span>{nodeId}</span>
							</p>
							<p>
								Event Type: <span>{eventType}</span>
							</p>
							<p>
								Service Name: <span>{serviceName}</span>
							</p>
							<p>
								Service Id: <span>{serviceId}</span>
							</p>
							<p>
								Service Type: <span>{serviceType}</span>
							</p>
							<p>
								Description:{' '}
								<span className="text-wrap">{description}</span>
							</p>
							<p>
								Execution Price: <span>{executionPrice}</span>
							</p>
							<p>
								Installation Price:{' '}
								<span>{installationPrice}</span>
							</p>
						</div>
					</div>
				)}

				{isZKP == false && isDevice == true && (
					<div className="main-data">
						<ImageLoader src={deviceImage} className="img device" />
						<div className="holder service">
							<p>
								IoT Server Id: <span>{nodeId}</span>
							</p>
							<p>
								Event Type: <span>{eventType}</span>
							</p>
							<p>
								Device Name: <span>{serviceName}</span>
							</p>
							<p>
								Device Id: <span>{deviceId}</span>
							</p>
							<p>
								Device Type: <span>{deviceType}</span>
							</p>
							<p>
								Owner Id: <span>{ownerId}</span>
							</p>
						</div>
					</div>
				)}
			</EModal>
		</AnimatedComponent>
	);
}
