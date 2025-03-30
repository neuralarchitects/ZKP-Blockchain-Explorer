import React from "react";
import "./style.scss";
import ResponsiveTable from "../Table";
import ImageLoader from "../Image";
import { formatDateTime } from "../../../utility/functions";

function transformServicesToArray(services) {
  return services.map((service) => [
    <div style={{display: "flex", gap:"16px", alignItems: "center"}}>
      <ImageLoader
        width={100}
        height={65}
        src={service.serviceImage}
        defaultImage="/img/default-service.jpg"
        className="service-image"
      />
      {service.serviceName || ""}
    </div>,
    service.nodeServiceId || "",
    service.description || "",
    formatDateTime(service.insertDate) || "",
    service.nodeId || "",
  ]);
}

export default function ServicesTable({ data }) {
  return (
    <ResponsiveTable
      titles={[
        "Service Name",
        "Service Id",
        "Description",
        "Published Timestamp",
        "Node Id",
      ]}
      pagination={true}
      data={[...transformServicesToArray(data)]}
    />
  );
}
