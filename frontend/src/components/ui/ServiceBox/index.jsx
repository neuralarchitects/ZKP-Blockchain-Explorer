import React from "react";
import "./style.scss";
import ImageLoader from "../Image";
import { formatDateTime } from "../../../utility/functions";

export default function ServiceBox({ data }) {
	const {
		code,
		description,
		insertDate,
		nodeId,
		nodeServiceId,
		serviceImage,
		serviceName,
	} = data;

	return (
		<div className="service-box-container">
			<ImageLoader
				width={100}
				height={65}
				src={serviceImage}
				className="image-holder"
			/>

			<p>{serviceName}</p>
			<p>{description}</p>
			<p>{formatDateTime(insertDate)}</p>
			<p>{nodeId}</p>
			<p>{nodeServiceId}</p>
		</div>
	);
}
