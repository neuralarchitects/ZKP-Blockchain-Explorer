import React from "react";
import "./style.scss";
import ResponsiveTable from "../Table";
import ImageLoader from "../Image";
import { formatDateTime } from "../../../utility/functions";

function transformServicesToArray(services) {
  return services.map((service) => [
    <ImageLoader
      width={100}
      height={65}
      src={service.serviceImage}
      defaultImage="/img/default-service.jpg"
      className="service-image"
    />,
    service.serviceName || "",
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
        "Service",
        "Name",
        "Service Id",
        "Description",
        "Creation Date",
        "Node Id",
      ]}
      pagination={true}
      data={[...transformServicesToArray(data)]}
    />
  );
}
