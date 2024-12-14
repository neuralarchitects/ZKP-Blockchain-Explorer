import React, { useEffect } from 'react';
import './style.scss';
import SearchBar from '../../components/containers/SearchBar';
import StatusBoxes from '../../components/containers/StatusBoxes';
import { useSocketConnection } from '../../services/socket.io';
import { HiHand } from 'react-icons/hi';
import BannerSlider from '../../components/containers/BannerSlider';
import TransactionsTable from '../../components/ui/TransactionsTable';
import { useNavigate } from 'react-router-dom';

function getFormattedDate() {
	const options = {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		weekday: 'long',
	};
	const now = new Date();
	const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(now);
	return formattedDate.replace(',', ''); // To match the requested format
}

export default function Dashboard() {
	const { latestTransactions, serviceDeviceCount, zkpCount, blockChainCount, dailyTransactions } =
		useSocketConnection();
	const navigateTo = useNavigate();

	useEffect(() => {
		console.log('latestTransactions:', latestTransactions);
	}, [latestTransactions]);

	return (
		<main className="dashboard">
			<section className="dashboard-header">
				<SearchBar />
				<p>{getFormattedDate()}</p>
			</section>
			<h1 className="welcome-text">
				{' '}
				<HiHand className="icon" /> Welcome, Fidesinnova Verifiable
				Computing Platform
			</h1>

			<BannerSlider />

			<StatusBoxes
				serviceDeviceCount={serviceDeviceCount}
				zkpCount={zkpCount}
				blockChainCount={blockChainCount}
				dailyTransactions={dailyTransactions}
			/>

			<TransactionsTable transactions={latestTransactions} />

			<p
				onClick={() => {
					navigateTo('/transactions');
				}}
				className="all-transactions"
			>
				View all operations
			</p>

			{/* 
			<ZkpDevices />
			 */}
		</main>
	);
}
