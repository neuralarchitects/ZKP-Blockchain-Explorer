import React from 'react';
import Spinner from '../Spinner';

function GenerateJsonData({ parsedData, loading, isZkp }) {
	if (loading) {
		return <Spinner type="double" />;
	}

	if (!parsedData) {
		return;
	}

	return (
		<div className={`commitment-holder ${(isZkp && 'zkp') || ''}`}>
			{parsedData.iot_developer_name && (
				<p>
					IoT Developer Name:{' '}
					<span>{parsedData.iot_developer_name}</span>
				</p>
			)}
			{parsedData.iot_device_name && (
				<p>
					IoT Device Name: <span>{parsedData.iot_device_name}</span>
				</p>
			)}
			{parsedData.device_hardware_version && (
				<p>
					Device Hardware Version:{' '}
					<span>{parsedData.device_hardware_version}</span>
				</p>
			)}
			{parsedData.firmware_version && (
				<p>
					Firmware Version: <span>{parsedData.firmware_version}</span>
				</p>
			)}
		</div>
	);
}

export default GenerateJsonData;
