import React from "react";
import "./style.scss";
import TransactionBox from "../../ui/TransactionBox";
import TransactionText from "../../ui/TransactionText";
import { useSocketConnection } from "../../../services/socket.io";
import { Toaster } from "react-hot-toast";
import AnimatedComponent from "../../ui/Animated/Component";
import { iphoneAnimation } from "../../../utility/framer-transitions";
import TransactionBoxSkeleton from "../../ui/TransactionBox/Skeleton";

export default function LatestTransactions({latestTransactions}) {

	return (
		<AnimatedComponent
			animation={iphoneAnimation(1)}
			className="transactions-container"
		>
			<Toaster />
			<h3 className="title">Latest Transactions</h3>
			<div className="scanning-title">
				<TransactionText />
			</div>

			{(latestTransactions.length !== 0 &&
				[...latestTransactions]
					.sort((a, b) => b.timestamp - a.timestamp)
					.map((item) => {
						return (
							<TransactionBox
								key={item.transactionHash}
								data={item}
							/>
						);
					})) ||
				[0, 1, 2].map((item) => {
					return <TransactionBoxSkeleton key={item} />;
				})}
		</AnimatedComponent>
	);
}
