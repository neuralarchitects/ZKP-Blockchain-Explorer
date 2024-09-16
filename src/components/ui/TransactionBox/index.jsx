import React, { useEffect, useRef } from "react";
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

function formatBigInt(bigIntValue) {
	if (bigIntValue === 0n) {
		return 0;
	}
	const divisor = 1000000000000000000n;
	const result = Number(bigIntValue) / Number(divisor);
	return Number(result.toFixed(5));
}

function formatWalletAddress(address) {
	return address.slice(0, 4) + ".." + address.slice(-4);
}

function formatTransactionHash(str, length) {
	if (str.length <= length) {
		return str;
	}

	const start = str.substring(0, Math.ceil(length / 2));
	const end = str.substring(str.length - Math.floor(length / 2));

	return `${start}...${end}`;
}

export default function TransactionBox({ data }) {
	const containerRef = useRef(null);
	const {
		from: fromWallet,
		to: intoWallet,
		transactionHash,
		timestamp,
		gasFee,
		eventType,
	} = data;

	function handleCopy(text) {
		navigator.clipboard.writeText(text);
		toast.success("Wallet address copied successfully", {
			style: { background: "#1E1F21", color: "white" },
		});
	}

	return (
		<div ref={containerRef} className="transaction-box-container">
			<div className="left-data">
				<div className="badge">
					<Badge
						Icon={HiInformationCircle}
						color={"#2A4364"}
						text={"Contact Call"}
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
			<p className="transaction-time">12mo ago</p>

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
				<Button className={"button"}>ZKP</Button>
				<Button className={"button"}>Data</Button>
				<Button className={"button"}>Verify Proof</Button>
			</div>
			<p className="unix-time">{timestamp}</p>
			<div className="transaction-value">
				<div className="holder">
					<p>
						Value: <span>0</span>
					</p>
					<p>
						Fee: <span>{formatBigInt(gasFee)}</span>
					</p>
				</div>
			</div>
		</div>
	);
}
