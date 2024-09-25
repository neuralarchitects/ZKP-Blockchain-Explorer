import React from "react";
import "./style.scss";
import DeviceBox from "../../ui/DeviceBox";

export default function DevicesBoxes({ data }) {
	return (
		<main className="device-boxes-container">
			<div className="header">
				<p>Device</p>
				<p>Name</p>
				<p>Encrypted ID</p>
				<p>Creation Date</p>
				<p>Node ID</p>
				<div className="hard-firm-ware">
					<p>Firmware Version</p>
					<p>Hardware Version</p>
				</div>
			</div>
			{data.map((device) => {
				return (
					<DeviceBox
						data={{
							deviceName: device.deviceName,
							deviceType: device.deviceType,
							deviceEncryptedId: device.deviceEncryptedId,
							firmwareVersion: device.firmwareVersion,
							hardwareVersion: device.hardwareVersion,
							insertDate: device.insertDate,
							nodeId: device.nodeId,
						}}
					/>
				);
			})}
		</main>
	);
}
