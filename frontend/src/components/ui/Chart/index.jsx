import React from 'react';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts';

const TransactionChart = ({ data, day }) => {
	return (
		<div
			className="transaction-chart-div"
			style={{ width: '100%', height: '100%' }}
		>
			<h3 style={{ textAlign: 'center' }}>
				Transactions in Last {day} Days
			</h3>

			<ResponsiveContainer width="100%" height={400}>
				<AreaChart
					data={data}
					margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="date"
						tick={{ angle: 0, fontSize: '10px' }}
					/>

					<YAxis
						label={{
							value: 'Transaction Count',
							angle: -90,
							position: 'insideLeft',
						}}
						tick={{ fontSize: '12px' }}
					/>
					<Tooltip />
					<Legend verticalAlign="top" height={36} />
					<Area
						type="monotone"
						dataKey="count"
						stroke="#4bc0c0"
						fill="rgba(75, 192, 192, 0.2)"
						activeDot={{ r: 5 }}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

export default TransactionChart;
