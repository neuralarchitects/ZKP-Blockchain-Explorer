import React from 'react';
import './style.scss';
import ResponsiveTable from '../Table';
import ImageLoader from '../Image';
import { formatDateTime } from '../../../utility/functions';

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
		formatDateTime(device.insertDate) || '',
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
				'Device Id',
				'Installation Date',
				'Node Id',
				'Firmware/Hardware Version',
			]}
			pagination={true}
			data={[...transformDevicesToArray(data)]}
			itemsPerPage={10}
		/>
	);
}
