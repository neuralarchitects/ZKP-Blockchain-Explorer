import React from "react";

function BoxIcon({ className }) {
	return (
		<svg
			className={`${className}`}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			viewBox="0 0 24 24"
		>
			<g clipPath="url(#clip0_1_104)">
				<path
					fill="#8A97A6"
					d="M20.947 6.06l-8.667-4a.667.667 0 00-.56 0l-8.667 4a.667.667 0 00-.386.607V18a.667.667 0 00.386.607l8.667 4a.667.667 0 00.56 0l8.667-4a.667.667 0 00.386-.607V6.667a.666.666 0 00-.386-.607zM12 3.4l7.073 3.267L12 9.933 4.927 6.667 12 3.4zM4 7.707l7.333 3.386v9.867L4 17.573V7.707zm8.667 13.253v-9.867L20 7.707v9.866l-7.333 3.387z"
				></path>
			</g>
			<defs>
				<clipPath id="clip0_1_104">
					<path fill="#fff" d="M0 0H24V24H0z"></path>
				</clipPath>
			</defs>
		</svg>
	);
}

export default BoxIcon;
