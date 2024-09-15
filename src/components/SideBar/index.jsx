import React from "react";
import Image from "../custom/Image";
import WebIcon from "../logo/web";
import "./style.css";

export default function SideBar() {
	return (
		<section className="side-bar">
			<Image
				className="logo"
				src={"./img/fides-logo.png"}
				alt={"FidesInnova Logo"}
			/>
			<div className="nav-item selected">
				<WebIcon />
				<p>Dashboard</p>
			</div>
		</section>
	);
}
