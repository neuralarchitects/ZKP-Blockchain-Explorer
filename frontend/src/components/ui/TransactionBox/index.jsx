import React, { useEffect, useState } from 'react';
import './style.scss';
import Badge from '../Badge';
import {
	HiArrowDown,
	HiCheckCircle,
	HiInformationCircle,
} from 'react-icons/hi';
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
	const [shadow, setShadow] = useState('none');
	const [border, setBorder] = useState('2px solid transparent');
	const [borderBottom, setBorderBottom] = useState('2px solid #2d2f34');

	const { fetchData, loading } = useFetchData();

	async function handleVerifyButton() {
		let theProof = '';
		try {
			theProof = JSON.parse(zkp_payload);
		} catch (error) {
			theProof = zkp_payload;
		}
		try {
			setProofLoading(true)
			const res = await fetchData(`contract/verify-proof`, {
				method: 'POST',
				body: {
					proof: theProof,
				},
			});
			setProofLoading(false)
			if (res.data == true) {
				toast.success(`Proof is verified`, {
					style: { background: '#1E1F21', color: 'white' },
				});
			} else {
				toast.error(`Proof is not verified`, {
					style: { background: '#1E1F21', color: 'white' },
				});
			}
		} catch (error) {
			setProofLoading(false)
			toast.error(`Error while verifying proof`, {
				style: { background: '#1E1F21', color: 'white' },
			});
		}
	}

	const handleMouseMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Calculate offsets and clamp values to prevent excessive shadow
		const offsetX = Math.max(-10, Math.min(10, (x - rect.width / 2) / 10));
		const offsetY = Math.max(-10, Math.min(10, (y - rect.height / 2) / 10));

		setShadow(
			`${offsetX}px ${offsetY}px 15px 7.5px rgba(62, 53, 196, 0.5)`
		);
		setBorderBottom('none');
		setBorder('2px solid #6d28d9');
	};

	const handleMouseLeave = () => {
		setShadow('none');
		setBorder('2px solid transparent');
		setBorderBottom('2px solid #2d2f34');
	};

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
			<motion.div
				className="transaction-box-container"
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				style={{
					transition: 'box-shadow 0.1s ease, transform 0.1s ease',
					border: border !== 'none' && border,
					borderBottom: borderBottom,
				}}
				animate={{
					boxShadow: shadow,
					transform:
						shadow === 'none'
							? 'translateZ(0)'
							: 'translateZ(10px)',
					transition: { duration: 0.2 },
				}}
			>
				<div className="left-data">
					<div className="badge">
						<Badge
							Icon={HiInformationCircle}
							color={isZKP ? '#0ea1ca' : '#2A4364'}
							text={`${isZKP ? 'ZKP Stored' : 'Contract Call'}`}
						/>
						{/* <Badge
						Icon={HiCheckCircle}
						color={"#23543E"}
						text={"Success"}
					/> */}
					</div>
					<div className="transaction-hash">
						<TransactionIcon className={'icon'} />
						<p
							onClick={() => {
								const encodedHash =
									encodeURIComponent(transactionHash);
								navigateTo(`/transactions/${encodedHash}`);
							}}
							className="hash"
						>
							{transactionHash}
							{/* {formatTransactionHash(transactionHash, 16)} */}
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
						onClick={() => setIsDataModalOpen(true)}
						className={'button'}
					>
						{isZKP ? 'IoT Data' : 'Service Contract'}
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
				</div>
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
				className={`data-modal ${!isZKP && 'big'}`}
				isOpen={isDataModalOpen}
				title={`${isZKP == false ? 'Specification' : 'Device Data'}`}
				onClose={() => setIsDataModalOpen(false)}
			>
				{isZKP && (
					<section className="main-data">
						<div className="holder">
							<ImageLoader
								src={
									deviceType == 'E_CARD'
										? '/img/e_card.png'
										: '/img/multi_sensor.png'
								}
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
							src={imageURL}
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
								Description: <span>{description}</span>
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
						<ImageLoader
							src={
								deviceType == 'E_CARD'
									? '/img/e_card.png'
									: '/img/multi_sensor.png'
							}
							className="img device"
						/>
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
