import React, { useEffect, useState } from 'react';
import './style.scss';
import Pagination from '../../components/ui/pagination';
import useFetchData from '../../services/api/useFetchData';
import LatestTransactions from '../../components/containers/Transactions';
import TransactionsTable from '../../components/ui/TransactionsTable';

export default function AllTransactionsPage() {
	const { fetchData, loading } = useFetchData();
	const [nowOffset, setNowOffset] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [nowData, setNowData] = useState([]);
	const eachPageDataCount = 20;

	async function getPageData() {
		const res = await fetchData(
			`contract/get-contract-data?limit=${eachPageDataCount}&offset=${nowOffset}`
		);
		setNowData([]);
		setNowData(res.data.data);
		setTotalCount(res.data.count);
	}

	useEffect(() => {
		getPageData();
	}, [nowOffset]);

	return (
		<main className="contract-data-container">
			<h1>All Operations</h1>
			<TransactionsTable transactions={nowData} />
			{/* <LatestTransactions
				loading={loading}
				noHeader={true}
				latestTransactions={nowData}
				skeletonCount={5}
			/> */}
			<Pagination
				eachPageCount={eachPageDataCount}
				totalCount={totalCount}
				setNowOffset={setNowOffset}
				disabled={loading}
				className="page-pagination"
			/>
		</main>
	);
}
