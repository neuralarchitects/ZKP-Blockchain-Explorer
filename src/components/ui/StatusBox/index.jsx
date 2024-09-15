import React from "react";
import "./style.scss";

export default function StatusBox({ Icon, title, value }) {
	return (
		<div className="status-box-container">
			<Icon className={"icon"} />
			<div className="content">
				<p className="title">{title}</p>
				<p className="value">{value}</p>
			</div>
		</div>
	);
}
