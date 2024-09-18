import React from "react";

function WalletIcon({ className }) {
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
				fill="#fff"
				d="M26.031 18.063a2.125 2.125 0 11-4.25 0 2.125 2.125 0 014.25 0zm5.313-4.782v10.625a4.25 4.25 0 01-4.25 4.25H7.969a4.25 4.25 0 01-4.25-4.25V8.091a4.25 4.25 0 014.25-4.372H25.5a1.594 1.594 0 110 3.187H7.969a1.062 1.062 0 00-1.063 1.097v.01a1.105 1.105 0 001.127 1.018h19.06a4.25 4.25 0 014.25 4.25zm-3.188 0a1.063 1.063 0 00-1.062-1.062H8.032c-.38 0-.758-.048-1.126-.144v11.831A1.063 1.063 0 007.97 24.97h19.125a1.063 1.063 0 001.062-1.063V13.281z"
			></path>
		</svg>
	);
}

export default WalletIcon;
