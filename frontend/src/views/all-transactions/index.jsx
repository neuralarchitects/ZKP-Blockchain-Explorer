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

  const getResponsiveImage = (folder) => {
    const width = window.innerWidth;

    // Choose the image based on screen width
    if (width <= 500) {
      return `/img/banners/${folder}/500.png`;
    } else if (width <= 900) {
      return `/img/banners/${folder}/900.png`;
    } else if (width <= 1367) {
      return `/img/banners/${folder}/1367.png`;
    } else {
      return `/img/banners/${folder}/2200.png`;
    }
  };

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
