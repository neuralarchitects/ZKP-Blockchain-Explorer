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
import Button from "../Button";
import AnimatedComponent from "../Animated/Component";
import { iphoneAnimation } from "../../../utility/framer-transitions";
import EModal from "../Modal";
import ImageLoader from "../Image";
import { useNavigate } from "react-router-dom";
import {
	copyText,
	formatBigInt,
	timeStamptimeAgo,
} from "../../../utility/functions";

function formatWalletAddress(address) {
	try {
		return address.slice(0, 4) + ".." + address.slice(-4);
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

	useEffect(() => {
		if (data_payload) {
			setDataPayload(JSON.parse(data_payload));
		}
	}, [data_payload]);

	useEffect(() => {
		if (String(eventType) == "ZKPStored") {
			setIsZKP(true);
		} else {
			if (
				String(eventType) == "DeviceCreated" ||
				String(eventType) == "DeviceRemoved"
			) {
				setIsDevice(true);
			}
		}
	}, [eventType]);

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
				{(isZKP && <p>{zkp_payload && JSON.parse(zkp_payload)}</p>) || (
					<h2 className="no-zkp">
						The received data does not contain any ZKP.
					</h2>
				)}
			</EModal>

			<EModal
				className={`data-modal ${!isZKP && "big"}`}
				isOpen={isDataModalOpen}
				title={`${isDevice || isZKP ? "Device" : "Service"} Data`}
				onClose={() => setIsDataModalOpen(false)}
			>
				{isZKP && (
					<section className="main-data">
						<div className="holder">
							<ImageLoader
								src={
									deviceType == "E_CARD"
										? "/img/e_card.png"
										: "/img/multi_sensor.png"
								}
								className="img device"
							/>
							{dataPayload.Door && (
								<p>
									Door: <span>{dataPayload.Door}</span>
								</p>
							)}
							<p>
								Temperature:{" "}
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
								Node Id: <span>{nodeId}</span>
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
								Installation Price:{" "}
								<span>{installationPrice}</span>
							</p>
						</div>
					</div>
				)}

				{isZKP == false && isDevice == true && (
					<div className="main-data">
						<ImageLoader
							src={
								deviceType == "E_CARD"
									? "/img/e_card.png"
									: "/img/multi_sensor.png"
							}
							className="img device"
						/>
						<div className="holder service">
							<p>
								Node Id: <span>{nodeId}</span>
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
					<TransactionIcon className={"icon"} />
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
						onClick={() => copyText(fromWallet, "Wallet address")}
						className="wallet"
					>
						<HiArrowDown className="icon" />
						<GradientCircle width={24} height={24} />
						<p>{formatWalletAddress(fromWallet)}</p>
						<CopyIcon className="icon copy" />
					</div>
					<div
						onClick={() => copyText(intoWallet, "Wallet address")}
						className="wallet"
					>
						<DocumentIcon className="icon start" />
						<p>{formatWalletAddress(intoWallet)}</p>
						<CopyIcon className="icon copy" />
					</div>
				</div>
			</div>
			<div className="button-container">
				<Button
					onClick={() => setIsZkpModalOpen(true)}
					className={"button"}
				>
					ZKP
				</Button>

				<Button
					onClick={() => setIsDataModalOpen(true)}
					className={"button"}
				>
					Data
				</Button>

				<Button className={"button"}>Verify Proof</Button>
			</div>

			<div className="transaction-value">
				{isZKP && (
					<div className="holder">
						<p>
							Node Id: <span>{nodeId}</span>
						</p>
						<p>
							Device Type: <span>{deviceType}</span>
						</p>
						<p>
							Device Id: <span>{deviceId}</span>
						</p>
						<p>
							Hardware Version : <span>{hardwareVersion}</span>
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
							Node Id: <span>{nodeId}</span>
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
							Node Id: <span>{nodeId}</span>
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
		</AnimatedComponent>
	);
}
