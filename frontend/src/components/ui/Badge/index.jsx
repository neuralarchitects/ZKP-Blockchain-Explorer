import React from 'react';
import './style.scss';

export default function Badge({ Icon, text, color }) {
	return (
		<div style={{ background: color }} className="badge-container">
			<Icon className={'icon'} />
			<p>{text}</p>
		</div>
	);
}
