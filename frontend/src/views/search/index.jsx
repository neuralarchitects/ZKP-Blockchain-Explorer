import React, { useEffect, useState } from 'react';
import './style.scss';
import useFetchData from '../../services/api/useFetchData';
import { HiX } from 'react-icons/hi';
import Spinner from '../../components/ui/Spinner';
import LatestTransactions from '../../components/containers/Transactions';
import { useLocation } from 'react-router-dom';
import TransactionsTable from '../../components/ui/TransactionsTable';
import SearchBar from '../../components/containers/SearchBar';

export default function SearchPage() {
	const [apiData, setApiData] = useState([]);
	const { fetchData, loading } = useFetchData();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const searchTextString = params.get('text');

	useEffect(() => {
		async function fetchSearchData() {
			const res = await fetchData(
				`contract/search-data?search=${encodeURIComponent(
					searchTextString
				)}`
			);
			setApiData(res.data);
		}
		fetchSearchData();
	}, [searchTextString]);

	return (
		<main className="search-page-container">
			<div className="header">
				<h1>Search results for</h1>{' '}
				<SearchBar initialValue={String(searchTextString)} />
			</div>

			{((apiData.length == 0 && loading == false) || loading == true) && (
				<div className="message-container">
					{apiData.length == 0 && loading == false && (
						<>
							<HiX className="icon" />
							<p>No results found</p>
						</>
					)}
					{loading == true && <Spinner type="rotate" />}
				</div>
			)}
			<div className="transaction-list">
				{apiData.length > 0 && loading == false && (
					<TransactionsTable
						itemsPerPage={10}
						pagination={true}
						transactions={apiData}
					/>
				)}
			</div>
		</main>
	);
}
