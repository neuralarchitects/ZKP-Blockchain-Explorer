import React, { useState } from "react";
import "./style.scss";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

const PaginatedList = ({ children, itemsPerPage = 10, className }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(children.length / itemsPerPage);

	const handleClick = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const renderPagination = () => {
		const pages = [];

		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(
					<button
						key={i}
						onClick={() => handleClick(i)}
						disabled={i === currentPage}
						className={`pagination ${
							i === currentPage ? "active" : ""
						}`}
					>
						{i}
					</button>
				);
			}
		} else {
			if (currentPage <= 3) {
				for (let i = 1; i <= Math.min(3, totalPages); i++) {
					pages.push(
						<button
							key={i}
							onClick={() => handleClick(i)}
							disabled={i === currentPage}
							className={`pagination ${
								i === currentPage ? "active" : ""
							}`}
						>
							{i}
						</button>
					);
				}
				if (totalPages > 4) {
					pages.push(
						<span key="ellipsis1" className="pagination">
							...
						</span>
					);
					pages.push(
						<button
							key={totalPages - 1}
							onClick={() => handleClick(totalPages - 1)}
							className="pagination"
						>
							{totalPages - 1}
						</button>
					);
					pages.push(
						<button
							key={totalPages}
							onClick={() => handleClick(totalPages)}
							className="pagination"
						>
							{totalPages}
						</button>
					);
				}
			} else if (currentPage >= totalPages - 2) {
				pages.push(
					<button
						key={1}
						onClick={() => handleClick(1)}
						className="pagination"
					>
						1
					</button>
				);
				pages.push(
					<button
						key={2}
						onClick={() => handleClick(2)}
						className="pagination"
					>
						2
					</button>
				);
				pages.push(
					<span key="ellipsis2" className="pagination-ellipsis">
						...
					</span>
				);
				for (let i = totalPages - 2; i <= totalPages; i++) {
					pages.push(
						<button
							key={i}
							onClick={() => handleClick(i)}
							disabled={i === currentPage}
							className={`pagination ${
								i === currentPage ? "active" : ""
							}`}
						>
							{i}
						</button>
					);
				}
			} else {
				pages.push(
					<button
						key={1}
						onClick={() => handleClick(1)}
						className="pagination"
					>
						1
					</button>
				);
				pages.push(
					<span key="ellipsis1" className="pagination-ellipsis">
						...
					</span>
				);

				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					pages.push(
						<button
							key={i}
							onClick={() => handleClick(i)}
							disabled={i === currentPage}
							className={`pagination ${
								i === currentPage ? "active" : ""
							}`}
						>
							{i}
						</button>
					);
				}

				pages.push(
					<span key="ellipsis2" className="pagination-ellipsis">
						...
					</span>
				);
				pages.push(
					<button
						key={totalPages - 1}
						onClick={() => handleClick(totalPages - 1)}
						className="pagination"
					>
						{totalPages - 1}
					</button>
				);
				pages.push(
					<button
						key={totalPages}
						onClick={() => handleClick(totalPages)}
						className="pagination"
					>
						{totalPages}
					</button>
				);
			}
		}

		return (
			<div className="pagination-container">
				<button
					onClick={handlePrevious}
					disabled={currentPage === 1}
					className="pagination"
				>
					<HiArrowLeft />
				</button>
				{pages}
				<button
					onClick={handleNext}
					disabled={currentPage === totalPages}
					className="pagination"
				>
					<HiArrowRight />
				</button>
			</div>
		);
	};

	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentItems = children.slice(startIndex, startIndex + itemsPerPage);

	return (
		<div className="paginated-list">
			<div className={className}>{currentItems}</div>
			{renderPagination()}
		</div>
	);
};

export default PaginatedList;
