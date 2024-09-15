import React from "react";
import "./style.scss";
import ImageLoader from "../../ui/Image";
import WebIcon from "../../../icons/web";

export default function SideBar() {
	return (
		<aside className="side-bar">
			<ImageLoader
				className="logo"
				src={"./img/fides-logo.png"}
				alt={"FidesInnova Logo"}
			/>
			<div className="nav-item selected">
				<WebIcon />
				<p>Dashboard</p>
			</div>
		</aside>
	);
}
