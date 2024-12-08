import React from 'react';
import './style.scss';
import ResponsiveTable from '../Table';
import ImageLoader from '../Image';

function transformDevicesToArray(devices) {
	return devices.map((device) => [
		<figure className="image-holder">
			<ImageLoader
				src={
					device.deviceType == 'E-CARD'
						? '/img/e_card.png'
						: '/img/multi_sensor.png'
				}
			/>
		</figure>,
		device.deviceName || '',
		device.deviceEncryptedId || '',
		new Date(device.insertDate).toLocaleDateString() || '',
		device.nodeId || '',
		<div className='fw-hw-holder'>
			<p>FW: {device.firmwareVersion || 0}</p>
			<p>HW: {device.hardwareVersion || 0}</p>
		</div>,
	]);
}

export default function DevicesTable({ data }) {
	return (
		<ResponsiveTable
			titles={[
				'Device',
				'Name',
				'Encrypted Id',
				'Creation Date',
				'Node Id',
				'Firmware/Hardware Version',
			]}
			pagination={true}
			data={[...transformDevicesToArray(data)]}
			itemsPerPage={10}
		/>
	);
}
