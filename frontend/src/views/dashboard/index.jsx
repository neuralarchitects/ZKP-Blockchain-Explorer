import React from "react";
import "./style.scss";
import SearchBar from "../../components/containers/SearchBar";
import StatusBoxes from "../../components/containers/StatusBoxes";
import LatestTransactions from "../../components/containers/Transactions";
import { useSocketConnection } from "../../services/socket.io";
import { usePageStore } from "../../store/store";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const { latestTransactions, serviceDeviceCount, zkpCount } =
		useSocketConnection();
	const navigateTo = useNavigate();

	return (
		<main className="dashboard">
			<SearchBar />
			<StatusBoxes
				serviceDeviceCount={serviceDeviceCount}
				zkpCount={zkpCount}
			/>
			<LatestTransactions latestTransactions={latestTransactions} />
			<p
				onClick={() => {
					navigateTo("/transactions");
				}}
				className="all-transactions"
			>
				View all operations
			</p>
		</main>
	);
}
