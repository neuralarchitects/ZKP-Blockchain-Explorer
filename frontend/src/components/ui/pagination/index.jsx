import React, { useEffect, useState } from "react";
import "./style.scss";

export default function Pagination({
  totalCount,
  eachPageCount,
  setNowOffset,
  setNowPage,
  initialPage = 1,
  disabled = false,
  className = "",
}) {
  const totalPages = Math.ceil(totalCount / eachPageCount);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
	setCurrentPage(initialPage)
  }, [initialPage])

  // Function to handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      if (setNowPage) {
        setNowPage(page);
      }
      if (setNowOffset) {
        setNowOffset((page - 1) * eachPageCount);
      }
      setCurrentPage(page);
    }
  };

  // Function to generate pagination numbers
  // Function to generate pagination numbers
  const getPagination = () => {
    const pages = [];

    // Always show the first and last pages
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show the adjacent pages to the current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(currentPage + 1, totalPages - 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
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
          <button key={index} className="pagination pagination-ellipsis">
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
