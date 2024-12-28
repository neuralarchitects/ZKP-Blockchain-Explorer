import React, { useEffect, useState } from 'react';
import TransactionChart from '../../ui/Chart';
import useFetchData from '../../../services/api/useFetchData';

export default function TransactionChartComponent() {
	const { fetchData } = useFetchData();
	const [data, setData] = useState([]);

	async function getChartData() {
		const res = await fetchData(
			`contract/chart-data?startDate=2024-12-18&endDate=2024-12-28`
		);
		setData(res.data.dailyCounts);
	}

	useEffect(() => {
		getChartData();
	}, []);

	if (data.length == 0) {
		return null;
	}

	return <TransactionChart data={data} />;
}
