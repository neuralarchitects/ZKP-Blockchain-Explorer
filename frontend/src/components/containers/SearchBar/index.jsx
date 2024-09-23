import React from "react";
import "./style.scss";
import SearchIcon from "../../../icons/search";
import AnimatedWidth from "../../ui/Animated/Width";

export default function SearchBar() {
	return (
		<AnimatedWidth duration={1} className="search-bar">
			<h1>FidesInnova Explorer</h1>
			<div className="custom-input">
				<SearchIcon className="icon" />
				<input placeholder="Search by Node Id / Service Name / Service Id / Device Name / Device Id..." />
			</div>
		</AnimatedWidth>
	);
}
