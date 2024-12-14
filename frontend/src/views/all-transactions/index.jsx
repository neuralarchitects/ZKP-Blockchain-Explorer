import React, { useEffect, useState } from 'react';
import './style.scss';
import Pagination from '../../components/ui/pagination';
import useFetchData from '../../services/api/useFetchData';
import LatestTransactions from '../../components/containers/Transactions';
import TransactionsTable from '../../components/ui/TransactionsTable';
import ImageLoader from '../../components/ui/Image';

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

	const getResponsiveImage = (folder) => {
		const width = window.innerWidth;

		// Choose the image based on screen width
		if (width <= 500) {
			return `/img/banners/${folder}/${folder}-500.jpg`;
		} else if (width <= 900) {
			return `/img/banners/${folder}/${folder}-900.jpg`;
		} else if (width <= 1367) {
			return `/img/banners/${folder}/${folder}-1367.jpg`;
		} else {
			return `/img/banners/${folder}/${folder}-2200.jpg`;
		}
	};

	return (
		<main className="contract-data-container">
			<ImageLoader
				className="banner"
				src={getResponsiveImage(3)}
				alt={`Operations Banner`}
				width={'100%'}
				height={'auto'}
				style={{borderRadius: '10px'}}
			/>
			<TransactionsTable transactions={nowData} />
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
