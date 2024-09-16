import React, { useEffect, useState } from "react";
import "./style.scss";
import TransactionBox from "../../ui/TransactionBox";
import TransactionText from "../../ui/TransactionText";
import { useSocketConnection } from "../../../services/socket.io";
import { Toaster } from "react-hot-toast";

export default function LatestTransactions() {
	const [latestTransactions, setLatestTransactions] = useState([]);

	useSocketConnection(setLatestTransactions);

	return (
		<section className="transactions-container">
			<Toaster />
			<h3 className="title">Latest Transactions</h3>
			<div className="scanning-title">
				<TransactionText />
			</div>

			{latestTransactions.reverse().map((item, index) => {
				return <TransactionBox data={item} />;
			})}
		</section>
	);
}
