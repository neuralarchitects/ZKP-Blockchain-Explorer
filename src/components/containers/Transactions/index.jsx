import React from "react";
import "./style.scss";
import TransactionBox from "../../ui/TransactionBox";
import TransactionText from "../../ui/TransactionText";

export default function LatestTransactions() {
	return (
		<section className="transactions-container">
			<h3 className="title">Latest Transactions</h3>
			<div className="scanning-title">
				<TransactionText />
			</div>
			<TransactionBox />
		</section>
	);
}
