import React from "react";
import "./style.scss";

export default function Button({ className, children, ...props }) {
	return (
		<div {...props} className={`${className} custom-button`}>
			<p>{children}</p>
		</div>
	);
}
