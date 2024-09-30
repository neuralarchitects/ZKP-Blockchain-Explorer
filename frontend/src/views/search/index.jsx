import React, { useEffect, useState } from "react";
import "./style.scss";
import { usePageStore } from "../../store/store";
import useFetchData from "../../services/api/useFetchData";
import { HiOutlineX, HiOutlineXCircle, HiX, HiXCircle } from "react-icons/hi";
import Spinner from "../../components/ui/Spinner";
import LatestTransactions from "../../components/containers/Transactions";
import { useLocation } from "react-router-dom";

export default function SearchPage() {
	const [apiData, setApiData] = useState([]);
	const { fetchData, loading } = useFetchData();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const searchTextString = params.get("text");

	useEffect(() => {
		async function fetchSearchData() {
			const res = await fetchData(
				`contract/search-data?search=${searchTextString}`
			);
			setApiData(res.data);
		}
		fetchSearchData();
	}, [searchTextString]);

	return (
		<main className="search-page-container">
			<h1 className="header">
				Search results for <span>'{String(searchTextString)}'</span>
			</h1>
			{((apiData.length == 0 && loading == false) || loading == true) && (
				<div className="message-container">
					{apiData.length == 0 && loading == false && (
						<>
							<HiX className="icon" />
							<p>No results found</p>
						</>
					)}
					{loading == true && <Spinner type="rotate" />}
				</div>
			)}
			<div className="transaction-list">
				{apiData.length > 0 && loading == false && (
					<LatestTransactions
						pagination={true}
						noHeader={true}
						latestTransactions={apiData}
					/>
				)}
			</div>
		</main>
	);
}
