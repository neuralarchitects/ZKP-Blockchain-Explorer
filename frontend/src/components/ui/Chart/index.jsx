import React from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Filler,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Filler,
	Title,
	Tooltip,
	Legend
);

const TransactionChart = ({ data }) => {
	const chartData = {
		labels: data.map((item) => item.date),
		datasets: [
			{
				label: 'Transactions Count',
				data: data.map((item) => item.count),
				fill: true,
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderColor: 'rgba(75, 192, 192, 1)',
				tension: 0.4,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'Transactions in Last 10 Days',
			},
		},
		scales: {
			x: {
				title: {
					display: true,
					text: 'Date',
				},
			},
			y: {
				title: {
					display: true,
					text: 'Transaction Count',
				},
				beginAtZero: true,
			},
		},
	};

	return (
		<div style={{ height: '50vh', display: "flex", justifyContent: "center" }}>
			<Line data={chartData} options={options} />
		</div>
	);
};

export default TransactionChart;
