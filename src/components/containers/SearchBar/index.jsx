import React from "react";
import "./style.scss";
import SearchIcon from "../../../icons/search";
import AnimatedWidth from "../../ui/Animated/Width";

export default function SearchBar() {
	return (
		<AnimatedWidth duration={1} className="search-bar">
			<div className="custom-input">
				<SearchIcon className="icon" />
				<input placeholder="Search by address / txn hash / block / token" />
			</div>
		</AnimatedWidth>
	);
}
