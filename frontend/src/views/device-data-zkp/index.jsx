import React from "react";
import "./style.scss";
import AllTransactionsPage from "../all-transactions";
import ImageLoader from "../../components/ui/Image";

export default function DeviceDataZkp() {
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
  return (
    <main className="services-container">
      <ImageLoader
        className="banner"
        src={getResponsiveImage(3)}
        alt={`Device Data+ZKP Banner`}
        width={"100%"}
        height={"auto"}
        style={{ borderRadius: "10px" }}
      />
      <AllTransactionsPage filter="zkp" />
    </main>
  );
}
