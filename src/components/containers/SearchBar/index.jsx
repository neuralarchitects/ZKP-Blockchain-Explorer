import React from "react";
import "./style.scss";
import SearchIcon from "../../../icons/search";

export default function SearchBar() {
	return (
		<section className="search-bar">
			<div className="custom-input">
				<SearchIcon className="icon" />
				<input placeholder="Search by address / txn hash / block / token" />
			</div>
		</section>
	);
}
