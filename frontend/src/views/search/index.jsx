import React, { useEffect, useState, useRef } from "react";
import "./style.scss";
import useFetchData from "../../services/api/useFetchData";
import { HiX } from "react-icons/hi";
import Spinner from "../../components/ui/Spinner";
import { useLocation, useNavigate } from "react-router-dom";
import TransactionsTable from "../../components/ui/TransactionsTable";
import SearchBar from "../../components/containers/SearchBar";
import Pagination from "../../components/ui/pagination";
import ZkpTable from "../../components/ui/ZKPTable";

export default function SearchPage() {
  const [apiData, setApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [totalResults, setTotalResults] = useState(0); // Track total results
  const { fetchData, loading } = useFetchData();
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const params = new URLSearchParams(location.search);
  const page = parseInt(params.get("page"), 10);
  const searchTextString = params.get("text");
  const searchFilterString = params.get("filter");
  const itemsPerPage = 10; // Number of items per page
  const [lastSearch, setLastSearch] = useState("");

  // Set the initial page from the URL
  useEffect(() => {
    if (page && !isNaN(page)) {
      setCurrentPage(page);
    }
  }, [location.search]);

  async function fetchSearchData(thePage) {
    const res = await fetchData(
      `contract/search-data?search=${encodeURIComponent(
        searchTextString
      )}&page=${
        page ? page : (thePage && thePage) || currentPage
      }&limit=${itemsPerPage}&filter=${searchFilterString}`
    );
    if (page) {
      setCurrentPage(page);
    }
    setApiData(res.data.data); // Update data
    setTotalPages(res.data.totalPages); // Update total pages
    setTotalResults(res.data.total); // Update total results
  }

  useEffect(() => {
    if (lastSearch !== searchTextString) {
      setCurrentPage(1);
      fetchSearchData(1);
      setLastSearch(searchTextString);
    }
  }, [searchTextString]);

  // Fetch data when searchTextString or currentPage changes
  useEffect(() => {
    fetchSearchData();
  }, [currentPage, searchFilterString]); // Re-fetch when search text or page changes

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page); // Update current page
    // Update the URL with the new page number
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page);
    navigate({ search: searchParams.toString() }, { replace: true }); // Use navigate to update the URL
  };

  return (
    <main className="search-page-container">
      <div className="header">
        <h1>Search results for</h1>{" "}
        <SearchBar initialValue={String(searchTextString)} />
      </div>

      {((apiData.length === 0 && !loading) || loading) && (
        <div className="message-container">
          {apiData.length === 0 && !loading && (
            <>
              <HiX className="icon" />
              <p>No results found</p>
            </>
          )}
          {loading && <Spinner type="rotate" />}
        </div>
      )}
      {searchFilterString === "zkp" && (
        <div className="zkp-table-padding">
          <TransactionsTable transactions={apiData} zkpTransaction={true} />
        </div>
      )}
      {searchFilterString === "commitment" && (
        <div className="zkp-table-padding">
          <TransactionsTable transactions={apiData} commitmentTransaction={true} />
        </div>
      )}
      {searchFilterString !== "zkp" && searchFilterString !== "commitment" && (
        <>
          <div className="transaction-list">
            {apiData.length > 0 && !loading && (
              <TransactionsTable transactions={apiData} />
            )}
          </div>
        </>
      )}
      <Pagination
        eachPageCount={itemsPerPage}
        initialPage={currentPage}
        totalCount={totalResults}
        setNowPage={handlePageChange} // Pass handlePageChange directly
        className="page-pagination"
      />
    </main>
  );
}
