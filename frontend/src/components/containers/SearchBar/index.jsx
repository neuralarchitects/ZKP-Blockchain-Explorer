import React, { useRef, useState } from 'react';
import './style.scss';
import SearchIcon from '../../../icons/search';
import AnimatedWidth from '../../ui/Animated/Width';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ initialValue = '' }) {
	const [inputValue, setInputValue] = useState(initialValue);
	const inputRef = useRef(null);
	const navigateTo = useNavigate();

	async function handleSearch(string) {
		if (String(string).trim().length === 0) {
			return false;
		} else {
			navigateTo(`/search?text=${encodeURIComponent(string)}`);
		}
	}

	return (
		<AnimatedWidth duration={1} className="custom-input">
			<SearchIcon
				onClick={() => handleSearch(inputValue)}
				className="icon"
			/>
			<input
				ref={inputRef}
				type="search"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						handleSearch(inputValue);
					}
				}}
				placeholder="Search by IoT Server Id / Service Contract Name / Service Contract Id / Device Name / Device Id"
			/>
		</AnimatedWidth>
	);
}
