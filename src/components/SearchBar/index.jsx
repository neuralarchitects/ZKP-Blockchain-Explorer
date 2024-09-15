import React from "react";
import "./style.css";
import { HiSearch } from "react-icons/hi";

export default function SearchBar() {
	return (
		<section className="search-bar">
			<div className="custom-input">
				<HiSearch className="icon" />
				<input placeholder="Search by address / txn hash / block / token" />
			</div>
		</section>
	);
}
