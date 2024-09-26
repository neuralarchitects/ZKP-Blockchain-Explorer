import React, { useRef, useState } from "react";
import "./style.scss";
import SearchIcon from "../../../icons/search";
import AnimatedWidth from "../../ui/Animated/Width";
import { usePageStore } from "../../../store/store";

export default function SearchBar() {
	const inputRef = useRef(null);
	const { setSearch, setPage } = usePageStore()

	async function handleSearch(string) {
		if (String(string).trim().length == 0) {
			return false;
		} else {
			setSearch(string)
			setPage("search")
		}
	}

	return (
		<AnimatedWidth duration={1} className="search-bar">
			<h1>FidesInnova Explorer</h1>
			<div className="custom-input">
				<SearchIcon
					onClick={() => {
						if (inputRef.current) {
							handleSearch(inputRef.current.value);
						}
					}}
					className="icon"
				/>
				<input
					ref={inputRef}
					type="search"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							handleSearch(e.target.value);
						}
					}}
					placeholder="Search by Node Id / Service Name / Service Id / Device Name / Device Id..."
				/>
			</div>
		</AnimatedWidth>
	);
}
