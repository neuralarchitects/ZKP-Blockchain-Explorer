import React, { useEffect, useState } from "react";
import "./style.scss";
import Pagination from "../../components/ui/pagination";
import useFetchData from "../../services/api/useFetchData";
import TransactionsTable from "../../components/ui/TransactionsTable";

export default function AllTransactionsPage({filter = "all"}) {
  const { fetchData, loading } = useFetchData();
  const [nowOffset, setNowOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [nowData, setNowData] = useState([]);
  const eachPageDataCount = 10;

  async function getPageData() {
    const res = await fetchData(
      `contract/get-contract-data?limit=${eachPageDataCount}&offset=${nowOffset}&filter=${filter}`
    );
    setNowData(res.data.data);
    setTotalCount(res.data.total);
  }

  useEffect(() => {
    getPageData();
  }, [nowOffset]);


  return (
    <main className="contract-data-container">
      <TransactionsTable transactions={nowData} />
      <Pagination
        eachPageCount={eachPageDataCount}
        totalCount={totalCount}
        setNowOffset={setNowOffset}
        disabled={loading}
        className="page-pagination"
      />
    </main>
  );
}
