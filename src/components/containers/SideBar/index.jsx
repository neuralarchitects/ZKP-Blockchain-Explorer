import React from "react";
import "./style.scss";
import ImageLoader from "../../ui/Image";
import WebIcon from "../../../icons/web";
import AnimatedComponent from "../../ui/Animated/Component";
import { fadeInLeft } from "../../../utility/framer-transitions";

export default function SideBar() {
	return (
		<AnimatedComponent animation={fadeInLeft(1, 200)} className="side-bar">
			<ImageLoader
				className="logo"
				src={"./img/fides-logo.png"}
				alt={"FidesInnova Logo"}
			/>
			<div className="nav-item selected">
				<WebIcon />
				<p>Dashboard</p>
			</div>
		</AnimatedComponent>
	);
}
