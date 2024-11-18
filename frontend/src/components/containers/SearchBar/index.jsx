import React, { useRef, useState } from "react";
import "./style.scss";
import SearchIcon from "../../../icons/search";
import AnimatedWidth from "../../ui/Animated/Width";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
	const inputRef = useRef(null);
	const navigateTo = useNavigate()

	async function handleSearch(string) {
		if (String(string).trim().length == 0) {
			return false;
		} else {
			navigateTo(`/search?text=${string}`)
		}
	}

	return (
		<AnimatedWidth duration={1} className="search-bar">
			<h1>FidesInnova ZKP Explorer</h1>
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
					placeholder="Search by IoT Server Id / Service Contract Name / Service Contract Id / Device Name / Device Id"
				/>
			</div>
		</AnimatedWidth>
	);
}
