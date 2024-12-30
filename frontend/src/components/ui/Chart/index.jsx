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
							value: `Transactions in Last ${day} Days`,
							angle: -90,
							dx: -20,
							style: { fontSize: '11px' },
						}}
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
