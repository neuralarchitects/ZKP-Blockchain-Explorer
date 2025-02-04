import React, { useEffect, useState } from "react";
import "./style.scss";
import ImageLoader from "../../components/ui/Image";
import CommitmentTable from "../../components/ui/CommitmentTable";
import useFetchData from "../../services/api/useFetchData";
import Pagination from "../../components/ui/pagination";

const getResponsiveImage = (folder) => {
  const width = window.innerWidth;
  if (width <= 500) {
    return `/img/banners/${folder}/500.jpg`;
  } else if (width <= 900) {
    return `/img/banners/${folder}/900.jpg`;
  } else if (width <= 1367) {
    return `/img/banners/${folder}/1367.jpg`;
  } else {
    return `/img/banners/${folder}/2200.jpg`;
  }
};

export default function CommitmentData() {
  const { fetchData, loading } = useFetchData();
  const [nowOffset, setNowOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [nowData, setNowData] = useState([]);
  const eachPageDataCount = 10;

  async function getPageData() {
    const res = await fetchData(
      `contract/get-contract-data?limit=${eachPageDataCount}&offset=${nowOffset}&filter=commitment`
    );
    setNowData(res.data.data);
    setTotalCount(res.data.total);
  }

  useEffect(() => {
    getPageData();
  }, [nowOffset]);

  return (
    <main className="services-container">
      <ImageLoader
        className="banner"
        src={getResponsiveImage(6)}
        alt={`Published Services Banner`}
        width={"100%"}
        height={"auto"}
        style={{ borderRadius: "10px" }}
      />
      <CommitmentTable data={nowData} />
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
