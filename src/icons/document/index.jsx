import React from "react";

function DocumentIcon({ className }) {
	return (
		<svg
			className={`${className}`}
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			fill="none"
			viewBox="0 0 16 16"
		>
			<path
				fill="#5F6B7C"
				d="M4 14.667c-.367 0-.68-.13-.941-.392a1.286 1.286 0 01-.392-.942V2.667c0-.367.13-.68.392-.942.261-.26.575-.391.941-.392h5.333l4 4v8c0 .367-.13.681-.391.942a1.28 1.28 0 01-.942.392H4zM8.667 6H12L8.667 2.667V6z"
			></path>
			<rect
				width="8"
				height="1"
				x="4"
				y="8"
				fill="#8A97A6"
				rx="0.5"
			></rect>
			<rect
				width="5"
				height="1"
				x="4"
				y="10"
				fill="#8A97A6"
				rx="0.5"
			></rect>
			<rect
				width="7"
				height="1"
				x="4"
				y="12"
				fill="#8A97A6"
				rx="0.5"
			></rect>
		</svg>
	);
}

export default DocumentIcon;
