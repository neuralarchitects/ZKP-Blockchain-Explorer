import React from "react";

function CopyIcon({ className, onClick }) {
	return (
		<svg
			onClick={onClick && onClick}
			className={`${className}`}
			xmlns="http://www.w3.org/2000/svg"
			width="10"
			height="10"
			fill="none"
			viewBox="0 0 10 10"
		>
			<g
				fill="#5F6B7C"
				fillRule="evenodd"
				clipPath="url(#clip0_2_159)"
				clipRule="evenodd"
			>
				<path d="M1.017.193A.536.536 0 011.43 0H5a.536.536 0 01.527.631L5.51.725a1.071 1.071 0 01.919 1.06v.536h-1.25a2.143 2.143 0 00-2.143 2.143v3.393H1.07A1.071 1.071 0 010 6.786v-5A1.071 1.071 0 01.919.725L.9.632a.536.536 0 01.116-.44zm1.054.878l.083.453a.536.536 0 00.527.44h1.068a.536.536 0 00.527-.44l.083-.453H2.07z"></path>
				<path d="M5.179 3.214a1.25 1.25 0 00-1.25 1.25V8.75c0 .69.56 1.25 1.25 1.25H8.75A1.25 1.25 0 0010 8.75V4.464a1.25 1.25 0 00-1.25-1.25H5.179zm.446 2.5c0-.246.2-.446.446-.446h1.786a.446.446 0 110 .893H6.071a.446.446 0 01-.446-.447zm.446 1.34a.446.446 0 000 .892h1.786a.446.446 0 100-.892H6.071z"></path>
			</g>
			<defs>
				<clipPath id="clip0_2_159">
					<path fill="#fff" d="M0 0H10V10H0z"></path>
				</clipPath>
			</defs>
		</svg>
	);
}

export default CopyIcon;
