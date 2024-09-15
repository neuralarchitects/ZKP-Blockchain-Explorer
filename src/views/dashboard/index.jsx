import React from "react";
import "./style.scss";
import SearchBar from "../../components/containers/SearchBar";
import StatusBoxes from "../../components/containers/StatusBoxes";
import LatestTransactions from "../../components/containers/Transactions";

export default function Dashboard() {
	return (
		<main className="dashboard">
			<SearchBar />
			<StatusBoxes />
			<LatestTransactions />
		</main>
	);
}
