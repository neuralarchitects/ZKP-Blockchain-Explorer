import React, { useState } from "react";
import "./style.scss";

export default function Pagination({
	totalCount,
	eachPageCount,
	setNowOffset,
	disabled = false,
	className = "",
}) {
	const totalPages = Math.ceil(totalCount / eachPageCount);
	const [currentPage, setCurrentPage] = useState(1);

	// Function to handle page change
	const handlePageChange = (page) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
			setNowOffset((page - 1) * eachPageCount);
		}
	};

	// Function to generate pagination numbers
	const getPagination = () => {
		const pages = [];

		if (totalPages <= 6) {
			// Display all pages when total pages are less than or equal to 6
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Display pagination with ellipses for higher page count
			pages.push(1, 2);
			if (currentPage > 3) {
				pages.push("...");
			}
			if (currentPage > 2 && currentPage < totalPages - 1) {
				pages.push(currentPage);
			}
			if (currentPage < totalPages - 2) {
				pages.push("...");
			}
			pages.push(totalPages - 1, totalPages);
		}

		return pages;
	};

	return (
		<section className={`pagination-container ${className}`}>
			{/* Previous arrow */}
			<button
				className={`pagination pagination-arrow ${
					currentPage === 1 ? "disabled" : ""
				}`}
				disabled={disabled || currentPage === 1}
				onClick={() => handlePageChange(currentPage - 1)}
			>
				&#60;
			</button>

			{/* Pagination numbers */}
			{getPagination().map((page, index) =>
				page === "..." ? (
					<button
						key={index}
						className="pagination pagination-ellipsis"
					>
						{page}
					</button>
				) : (
					<button
						key={index}
						className={`pagination pagination-number ${
							page === currentPage ? "active" : ""
						}`}
						disabled={disabled}
						onClick={() => handlePageChange(page)}
					>
						{page}
					</button>
				)
			)}

			{/* Next arrow */}
			<button
				className={`pagination pagination-arrow ${
					currentPage === totalPages ? "disabled" : ""
				}`}
				disabled={disabled || currentPage === totalPages}
				onClick={() => handlePageChange(currentPage + 1)}
			>
				&#62;
			</button>
		</section>
	);
}
