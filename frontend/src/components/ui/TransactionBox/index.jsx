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
		deviceName,
		imageURL,
		description,
		executionPrice,
		installationPrice,
	} = data;

	useEffect(() => {
		if (data_payload) {
			setDataPayload(JSON.parse(data_payload));
		}
	}, [data_payload]);

	useEffect(() => {
		if (String(eventType) == "ZKPStored") {
			setIsZKP(true);
		}
	}, [eventType]);

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
				<p>{zkp_payload && JSON.parse(zkp_payload)}</p>
			</EModal>

			<EModal
				className="data-modal"
				isOpen={isDataModalOpen}
				title="Device Data"
				onClose={() => setIsDataModalOpen(false)}
			>
				{(isZKP && (
					<div className="data-holder">
						{dataPayload.Door && (
							<p>
								Door: <span>{dataPayload.Door}</span>
							</p>
						)}
						<p>
							Temperature: <span>{dataPayload.Temperature}</span>
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
							HardwareVersion: <span>{dataPayload.HV}</span>
						</p>
						<p>
							FirmwareVersion: <span>{dataPayload.FV}</span>
						</p>
					</div>
				)) || (
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
				<div className="holder">
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
