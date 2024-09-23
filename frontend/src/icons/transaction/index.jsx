import React from "react";

function TransactionIcon({ className }) {
	return (
		<svg
			className={`${className}`}
			xmlns="http://www.w3.org/2000/svg"
			width="34"
			height="34"
			fill="none"
			viewBox="0 0 34 34"
		>
			<path
				stroke="#8A97A6"
				strokeWidth="2"
				d="M2.833 9.917h25.5m-5.666-7.084l7.083 7.084L22.667 17m8.5 7.083h-25.5M11.333 17L4.25 24.083l7.083 7.084"
			></path>
		</svg>
	);
}

export default TransactionIcon;
