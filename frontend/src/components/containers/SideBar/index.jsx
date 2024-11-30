import React from "react";
import "./style.scss";
import ImageLoader from "../../ui/Image";
import AnimatedComponent from "../../ui/Animated/Component";
import { fadeInLeft } from "../../../utility/framer-transitions";
import { usePageStore } from "../../../store/store";
import { useLocation, useNavigate } from "react-router-dom";

export default function SideBar() {
	const { pages } = usePageStore();
	const location = useLocation();
	const navigateTo = useNavigate();

	return (
		<AnimatedComponent animation={fadeInLeft(0.5, 200)} className="side-bar">
			<ImageLoader
				className="logo"
				src={"/img/fides-logo.png"}
				alt={"FidesInnova Logo"}
				width={"50%"}
				height={200}
			/>
			{pages &&
				pages.length > 0 &&
				pages.map((page, index) => {
					if (!page.hidden) {
						return (
							<div
								key={index}
								className={`nav-item ${
									page.route == location.pathname
										? " selected"
										: ""
								}`}
								onClick={() => navigateTo(page.route)}
							>
								<page.Icon className="icon" />
								<p>{page.title}</p>
							</div>
						);
					}
				})}
		</AnimatedComponent>
	);
}
