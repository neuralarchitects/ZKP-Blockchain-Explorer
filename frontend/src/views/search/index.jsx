import React, { useEffect, useState } from "react";
import "./style.scss";
import { usePageStore } from "../../store/store";
import useFetchData from "../../services/api/useFetchData";
import { HiOutlineX, HiOutlineXCircle, HiX, HiXCircle } from "react-icons/hi";
import Spinner from "../../components/ui/Spinner";
import LatestTransactions from "../../components/containers/Transactions";

export default function SearchPage() {
	const { searchString } = usePageStore();
	const [apiData, setApiData] = useState([]);
	const { fetchData, loading, error } = useFetchData();

	useEffect(() => {
		async function fetchSearchData() {
			const res = await fetchData("contract/search-data", {
				method: "POST",
				body: {
					search: searchString,
				},
			});
			setApiData(res.data);
		}
		fetchSearchData();
	}, [searchString]);

	return (
		<main className="search-page-container">
			<h1 className="header">
				Search results for <span>'{String(searchString)}'</span>
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
			{apiData.length > 0 && loading == false && (
				<LatestTransactions search={true} latestTransactions={apiData} />
			)}
		</main>
	);
}
