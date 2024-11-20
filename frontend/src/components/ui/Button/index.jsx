import React from "react";
import "./style.scss";

export default function Button({ className, children, loading, ...props }) {
	return (
		<div
			{...props}
			className={`${className} custom-button ${loading ? "loading" : ""}`}
			disabled={loading}
		>
			{loading && <div className="loader"></div>}
			<p className={loading ? "text-loading" : ""}>{children}</p>
		</div>
	);
}
