import React, { useEffect, useState } from "react";
import "./style.scss";
import Badge from "../Badge";
import {
	HiArrowDown,
	HiCheckCircle,
	HiInformationCircle,
} from "react-icons/hi";
import TransactionIcon from "../../../icons/transaction";
import GradientCircle from "../GradientCircle";
import CopyIcon from "../../../icons/copy";
import DocumentIcon from "../../../icons/document";
import toast from "react-hot-toast";
import Button from "../Button";
import AnimatedComponent from "../Animated/Component";
import { iphoneAnimation } from "../../../utility/framer-transitions";
import EModal from "../Modal";
import ImageLoader from "../Image";

function formatBigInt(bigIntValue) {
	if (bigIntValue === 0n) {
		return 0;
	}
	const divisor = 1000000000000000000n;
	const result = Number(bigIntValue) / Number(divisor);
	return Number(result.toFixed(5));
}

function formatWalletAddress(address) {
	try {
		return address.slice(0, 4) + ".." + address.slice(-4);
	} catch (error) {
		return address;
	}
}

function timeAgo(unixTimestamp) {
	const seconds = Math.floor((Date.now() - unixTimestamp * 1000) / 1000);

	const intervals = {
		year: 31536000,
		month: 2592000,
		day: 86400,
		hour: 3600,
		minute: 60,
		second: 1,
	};

	for (const [unit, value] of Object.entries(intervals)) {
		const interval = Math.floor(seconds / value);
		if (interval >= 1) {
			return `${interval}${unit.charAt(0)} ago`;
		}
	}

	return "just now";
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
	const [isZKP, setIsZKP] = useState(false);
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
		deviceName,
		imageURL,
		description,
		executionPrice,
		installationPrice,
	} = data;

	/* 

	data_payload: "90909090";
	deviceId: "565565";
	deviceType: "7676767";
	eventType: "ZKPStored";
	firmwareVersion: "89988989";
	hardwareVersion: "77878";
	nodeId: "56565656";
	timestamp: 1726489441;
	unixtime_payload: "hhjghhg";
	zkp_payload: "54565656";
	_id: "66e8abd547517fa69a7c460c";

	-------------------------------------------------------------

	creationDate: "Wed Aug 28 2024 17:02:37 GMT+0200 (Central European Summer Time)";
	description: "The device owner will receive a notification on their phone when they press the device button.";
	devices: '["[\\"MULTI_SENSOR_1\\"]"]';
	eventType: "ServiceCreated";
	executionPrice: "0";
	from: "0x7A49B1E20b646d9c8C4080930F96AcbF5489D870";
	gasFee: 6947580000000000;
	imageURL: "https://panel.zkiot.tech/app/uploads/file-1725712393631-371112880.jpg";
	installationPrice: "0";
	name: '"Ping" Notification';
	nodeId: "zkiot.tech";
	program: "if ((MULTI_SENSOR_1.BUTTON) == \"pressed\") {\n  customizedMessage.sendNotification({ title: 'From: ' + MULTI_SENSOR_1.NAME, message: 'SOS' });}\n";
	publishedDate: "Mon Sep 16 2024 14:52:57 GMT+0200 (Central European Summer Time)";
	serviceId: "66d5c47caffbb7a40a1a48bb";
	serviceType: "automation";
	timestamp: 1726491182;
	to: "0x2b746D228379F0E0a307723dF99486Dc17fdf9B1";
	transactionHash: "2x1QsNiKDUd2oHl8AOiNcrMjPV1jdgtUQ+px7uv9UOw=";
	_id: "66e82a2ea20a8d60c47c09e5";

	 */

	useEffect(() => {
		if (eventType == "ZKPStored") {
			setIsZKP(true);
		}
	}, []);

	function handleCopy(text) {
		navigator.clipboard.writeText(text);
		toast.success("Wallet address copied successfully", {
			style: { background: "#1E1F21", color: "white" },
		});
	}

	return (
		<AnimatedComponent
			animation={iphoneAnimation(0.5)}
			className="transaction-box-container"
		>
			<EModal
				className="zkp-modal"
				isOpen={isZkpModalOpen}
				title="ZKP Payload"
				onClose={() => setIsZkpModalOpen(false)}
			>
				<p>{JSON.stringify(zkp_payload)}</p>
			</EModal>

			<EModal
				className="data-modal"
				isOpen={isDataModalOpen}
				title="Device Data"
				onClose={() => setIsDataModalOpen(false)}
			>
				{(isZKP && <p>{data_payload}</p>) || (
					<div className="data-holder">
						<ImageLoader
							height={200}
							width={300}
							src={imageURL}
							className="img"
						/>
						<p>
							NodeId: <span>{nodeId}</span>
						</p>
						<p>
							EventType: <span>{eventType}</span>
						</p>
						<p>
							ServiceName: <span>{serviceName}</span>
						</p>
						<p>
							ServiceId: <span>{serviceId}</span>
						</p>
						<p>
							ServiceType: <span>{serviceType}</span>
						</p>
						<p>
							Description: <span>{description}</span>
						</p>
						<p>
							ExecutionPrice: <span>{executionPrice}</span>
						</p>
						<p>
							InstallationPrice: <span>{installationPrice}</span>
						</p>
					</div>
				)}
			</EModal>

			<div className="left-data">
				<div className="badge">
					<Badge
						Icon={HiInformationCircle}
						color={isZKP ? "#0ea1ca" : "#2A4364"}
						text={`${isZKP ? "ZKP Stored" : "Contract Call"}`}
					/>
					<Badge
						Icon={HiCheckCircle}
						color={"#23543E"}
						text={"Success"}
					/>
				</div>
				<div className="transaction-hash">
					<TransactionIcon />
					<p>{formatTransactionHash(transactionHash, 16)}</p>
				</div>
			</div>
			<p className="transaction-time">{timeAgo(timestamp)}</p>

			<div className="transaction-wallets">
				<div className="wallet">
					<HiArrowDown className="icon" />
					<GradientCircle width={24} height={24} />
					<p>{formatWalletAddress(fromWallet)}</p>
					<CopyIcon
						className="icon copy"
						onClick={() => handleCopy(fromWallet)}
					/>
				</div>
				<div className="wallet">
					<DocumentIcon className="icon start" />
					<p>{formatWalletAddress(intoWallet)}</p>
					<CopyIcon
						className="icon copy"
						onClick={() => handleCopy(intoWallet)}
					/>
				</div>
			</div>
			<div className="button-container">
				{isZKP && (
					<Button
						onClick={() => setIsZkpModalOpen(true)}
						className={"button"}
					>
						ZKP
					</Button>
				)}

				<Button
					onClick={() => setIsDataModalOpen(true)}
					className={"button"}
				>
					Data
				</Button>

				{isZKP && <Button className={"button"}>Verify Proof</Button>}
			</div>

			<div className="transaction-value">
				{(isZKP && (
					<div className="holder">
						<p>
							NodeId: <span>{nodeId}</span>
						</p>
						<p>
							DeviceName : <span>{deviceName}</span>
						</p>
						<p>
							DeviceType: <span>{deviceType}</span>
						</p>
						<p>
							DeviceId: <span>{deviceId}</span>
						</p>
						<p>
							HardwareVersion : <span>{hardwareVersion}</span>
						</p>
						<p>
							FirmwareVersion: <span>{firmwareVersion}</span>
						</p>
						<p>
							Fee: <span>{formatBigInt(gasFee)}</span>
						</p>
					</div>
				)) || (
					<div className="holder">
						<p>
							NodeId: <span>{nodeId}</span>
						</p>
						<p>
							ServiceName: <span>{serviceName}</span>
						</p>
						<p>
							serviceType: <span>{serviceType}</span>
						</p>
						<p>
							serviceId: <span>{serviceId}</span>
						</p>

						<p>
							Fee: <span>{formatBigInt(gasFee)}</span>
						</p>
					</div>
				)}
			</div>
		</AnimatedComponent>
	);
}
