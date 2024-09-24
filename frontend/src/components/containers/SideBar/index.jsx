import React from "react";
import "./style.scss";
import ImageLoader from "../../ui/Image";
import AnimatedComponent from "../../ui/Animated/Component";
import { fadeInLeft } from "../../../utility/framer-transitions";
import { usePageStore } from "../../../store/store";

export default function SideBar() {
	const { setPage, pages, currentPage } = usePageStore();

	return (
		<AnimatedComponent animation={fadeInLeft(1, 200)} className="side-bar">
			<ImageLoader
				className="logo"
				src={"./img/fides-logo.png"}
				alt={"FidesInnova Logo"}
				width={"50%"}
				height={200}
			/>
			{pages &&
				pages.length > 0 &&
				pages.map((page, index) => {
					return (
						<div
							key={index}
							className={`nav-item ${
								page.key == currentPage ? " selected" : ""
							}`}
							onClick={() => setPage(page.key)}
						>
							<page.Icon className="icon" />
							<p>{page.title}</p>
						</div>
					);
				})}
		</AnimatedComponent>
	);
}
