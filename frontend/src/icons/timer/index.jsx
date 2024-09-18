import React from "react";

function TimerIcon({ className }) {
	return (
		<svg
			className={`${className}`}
			xmlns="http://www.w3.org/2000/svg"
			width="34"
			height="34"
			fill="none"
			viewBox="0 0 34 34"
		>
			<g clipPath="url(#clip0_1_77)">
				<path
					fill="#fff"
					d="M17 34a17 17 0 110-34 17 17 0 010 34zm0-3.4a13.6 13.6 0 100-27.201A13.6 13.6 0 0017 30.6zm-1.7-12.903V6.8h3.4v9.503l6.715 6.715-2.397 2.397-7.718-7.718z"
				></path>
			</g>
			<defs>
				<clipPath id="clip0_1_77">
					<path fill="#fff" d="M0 0H34V34H0z"></path>
				</clipPath>
			</defs>
		</svg>
	);
}

export default TimerIcon;
