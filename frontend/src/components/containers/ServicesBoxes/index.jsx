import React from "react";
import "./style.scss";
import ServiceBox from "../../ui/ServiceBox";

export default function ServicesBoxes({ data }) {
	return (
		<main className="services-boxes-container">
			<div className="header">
				<p>Service</p>
				<p>Name</p>
				<p>Description</p>
				<p>Creation Date</p>
				<p>Node ID</p>
				<p>Service ID</p>
			</div>
			{data.map((service) => {
				return (
					<ServiceBox
						data={{
							code: service.code,
							description: service.description,
							insertDate: service.insertDate,
							nodeId: service.nodeId,
							nodeServiceId: service.nodeServiceId,
							serviceImage: service.serviceImage,
							serviceName: service.serviceName,
						}}
					/>
				);
			})}
		</main>
	);
}
