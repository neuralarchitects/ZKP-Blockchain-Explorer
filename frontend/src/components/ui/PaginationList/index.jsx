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
	  
		// Always show the first and last pages
		pages.push(
		  <button
			key={1}
			onClick={() => handleClick(1)}
			disabled={1 === currentPage}
			className={`pagination ${1 === currentPage ? "active" : ""}`}
		  >
			1
		  </button>
		);
	  
		if (currentPage > 3) {
		  pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
		}
	  
		// Show the adjacent pages
		for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
		  pages.push(
			<button
			  key={i}
			  onClick={() => handleClick(i)}
			  disabled={i === currentPage}
			  className={`pagination ${i === currentPage ? "active" : ""}`}
			>
			  {i}
			</button>
		  );
		}
	  
		if (currentPage < totalPages - 2) {
		  pages.push(<span key="ellipsis2" className="pagination pagination-ellipsis">...</span>);
		}
	  
		if (totalPages > 1) {
		  pages.push(
			<button
			  key={totalPages}
			  onClick={() => handleClick(totalPages)}
			  disabled={totalPages === currentPage}
			  className={`pagination ${totalPages === currentPage ? "active" : ""}`}
			>
			  {totalPages}
			</button>
		  );
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
