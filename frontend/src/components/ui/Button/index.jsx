import React from 'react';
import './style.scss';

export default function Button({
	className,
	children,
	loading,
	onClick,
	...props
}) {
	const handleClick = (e) => {
		if (loading == true) {
			e.preventDefault(); // Prevent the click if loading
			return false;
		}
		if (onClick) {
			onClick(e); // Call the onClick handler if not loading
		}
	};

	return (
		<div
			{...props}
			className={`${className} custom-button ${loading ? 'loading' : ''}`}
			onClick={handleClick}
		>
			{loading && <div className="loader"></div>}
			<p className={loading ? 'text-loading' : ''}>{children}</p>
		</div>
	);
}
