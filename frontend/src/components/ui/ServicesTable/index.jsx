import React from 'react';
import './style.scss';
import ResponsiveTable from '../Table';
import ImageLoader from '../Image';

function transformServicesToArray(services) {
	return services.map((service) => [
		<ImageLoader
			width={100}
			height={65}
			src={service.serviceImage}
			className="service-image"
		/>,
		service.serviceName || '',
		service.description || '',
		new Date(service.insertDate).toLocaleDateString() || '',
		service.nodeId || '',
		service.nodeServiceId || '',
	]);
}

export default function ServicesTable({ data }) {
	return (
		<ResponsiveTable
			titles={[
				'Service',
				'Name',
				'Description',
				'Creation Date',
				'Node Id',
				'Service Id',
			]}
			pagination={true}
			data={[...transformServicesToArray(data)]}
			truncateColumns={[5]}
		/>
	);
}
