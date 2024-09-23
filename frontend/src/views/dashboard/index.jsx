import React from "react";
import "./style.scss";
import SearchBar from "../../components/containers/SearchBar";
import StatusBoxes from "../../components/containers/StatusBoxes";
import LatestTransactions from "../../components/containers/Transactions";
import { useSocketConnection } from "../../services/socket.io";

export default function Dashboard() {
	const { latestTransactions, serviceDeviceCount, zkpCount } = useSocketConnection();
	
	return (
		<main className="dashboard">
			<SearchBar />
			<StatusBoxes serviceDeviceCount={serviceDeviceCount} zkpCount={zkpCount} />
			<LatestTransactions latestTransactions={latestTransactions} />
		</main>
	);
}
