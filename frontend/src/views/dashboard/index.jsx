import React, { useEffect, useState } from 'react';
import './style.scss';
import SearchBar from '../../components/containers/SearchBar';
import StatusBoxes from '../../components/containers/StatusBoxes';
import { useSocketConnection } from '../../services/socket.io';
import { HiHand } from 'react-icons/hi';
import BannerSlider from '../../components/containers/BannerSlider';
import TransactionsTable from '../../components/ui/TransactionsTable';
import { useNavigate } from 'react-router-dom';
import TransactionText from '../../components/ui/TransactionText';
import TransactionChartComponent from '../../components/containers/TransactionsChart';

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
	const {
		latestTransactions,
		serviceDeviceCount,
		zkpCount,
		blockChainCount,
		totalTransactions,
		totalOperations,
	} = useSocketConnection();
	const navigateTo = useNavigate();

	const [animateTransactionText, setAnimateTransactionText] = useState(false);

	useEffect(() => {
		if (latestTransactions && latestTransactions.length > 0) {
			setAnimateTransactionText(true);

			// Remove animation class after the animation ends
			const timeout = setTimeout(() => {
				setAnimateTransactionText(false);
			}, 1000); // Adjust to match the animation duration

			return () => clearTimeout(timeout);
		}
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
				serviceDeviceCount={totalOperations}
				zkpCount={zkpCount}
				blockChainCount={blockChainCount}
				dailyTransactions={totalTransactions}
			/>

			<TransactionChartComponent days={15} />

			<div className="transaction-table-holder">
				<div className="title-holder">
					<h1 className="title">Recent Transactions</h1>
					<TransactionText
						className={`transaction-text-holder ${
							animateTransactionText ? 'animate' : ''
						}`}
					/>
				</div>
				<TransactionsTable
					className="transact-table"
					transactions={latestTransactions}
				/>
				<p
					onClick={() => {
						navigateTo('/transactions');
					}}
					className="all-transactions"
				>
					More
				</p>
			</div>
		</main>
	);
}
