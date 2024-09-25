import React from "react";
import "./style.scss";

const Spinner = ({ type = "rotate" }) => {
	if (type == "double")
		return (
			<div className="spinner">
				<div className="double-bounce1"></div>
				<div className="double-bounce2"></div>
			</div>
		);

	if (type == "rotate") return <span class="loader"></span>;
};

export default Spinner;
