import React, { useEffect, useState } from 'react';
import TransactionChart from '../../ui/Chart';
import useFetchData from '../../../services/api/useFetchData';

export default function TransactionChartComponent({ days }) {
	const { fetchData } = useFetchData();
	const [data, setData] = useState([]);

	async function getChartData() {
		// Helper to format date as YYYY-MM-DD
		const formatDate = (date) => {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		};

		const now = new Date();
		const tenDaysAgo = new Date();
		tenDaysAgo.setDate(now.getDate() - days);

		const startDate = formatDate(tenDaysAgo);
		const endDate = formatDate(now);

		try {
			const res = await fetchData(
				`contract/chart-data?startDate=${startDate}&endDate=${endDate}`
			);
			setData(res.data.dailyCounts);
		} catch (error) {
			console.error('Error fetching chart data:', error);
		}
	}

	useEffect(() => {
		getChartData();
	}, []);

	if (data.length == 0) {
		return null;
	}

	return <TransactionChart day={days} data={data} />;
}
