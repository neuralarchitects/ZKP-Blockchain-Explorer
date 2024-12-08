import React from 'react';
import './style.scss';
import AnimatedComponent from '../Animated/Component';
import { fadeInRight } from '../../../utility/framer-transitions';
import CountUpNumber from '../Animated/Number';
import Spinner from '../Spinner';

export default function StatusBox({
	Icon,
	title,
	value,
	loading,
	color,
	iconClass = '',
}) {
	return (
		<AnimatedComponent
			style={{ background: color ? color :'var(--color-secondary)' }}
			animation={fadeInRight(1)}
			className="status-box-container"
		>
			<Icon className={`icon ${iconClass}`} />
			<div className="content">
				<p className="title">{title}</p>
				<div className="value">
					{(loading && <Spinner type="double" />) || (
						<CountUpNumber targetNumber={Number(value)} />
					)}
				</div>
			</div>
		</AnimatedComponent>
	);
}
