import React from "react";
import "./style.scss";
import { formatDateTime } from "../../../utility/functions";

/* deviceEncryptedId: "QTA6NzY6NEU6NTc6Njc6RjA=";
	deviceName: "NewDevice172";
	deviceType: "E-CARD";
	firmwareVersion: 0;
	geometry: null;
	hardwareVersion: 0;
	insertDate: "2024-09-18T15:14:03.883Z";
	insertedBy: "66bff2a677921cf5a3b204af";
	lastLog: null;
	location: {
		coordinates: Array(2);
	}
	mac: "A0:76:4E:57:67:F0";
	nodeDeviceId: "66e5cb1a41210e536eb1336f";
	nodeId: "trustsense.tech";
	_id: "66eaee3ce41b1565a7b2f2a3"; */

export default function DeviceBox({ data }) {
	const {
		deviceName,
		deviceType,
		deviceEncryptedId,
		firmwareVersion,
		hardwareVersion,
		insertDate,
		nodeId,
	} = data;

	return (
		<div className="device-box-container">
			<figure className="image-holder">
				<img
					src={
						deviceType == "E-CARD"
							? "/img/e_card.png"
							: "/img/multi_sensor.png"
					}
					alt=""
				/>
			</figure>
			<p>{deviceName}</p>
			<p>{deviceEncryptedId}</p>
			<p>{formatDateTime(insertDate)}</p>
			<p>{nodeId}</p>
			<div className="multi-line">
				<p>FW: {firmwareVersion}</p>
				<p>HW: {hardwareVersion}</p>
			</div>
		</div>
	);
}
