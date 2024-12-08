import React, { useState } from 'react';
import './style.scss';
import { Skeleton } from '@mui/material';

const ImageLoader = ({ src, alt, className = '', height, width, ...rest }) => {
	const [loading, setLoading] = useState(true);

	const handleImageLoaded = () => {
		setLoading(false);
	};

	return (
		<>
			{loading && (
				<Skeleton
					sx={{ bgcolor: 'grey.800' }}
					variant="rounded"
					animation={'pulse'}
					width={width ? width : '100px'}
					height={height ? height : '100px'}
					className={`${className}`}
					{...rest} // Pass all remaining props to the Skeleton
				/>
			)}

			<img
				src={src}
				alt={alt}
				onLoad={handleImageLoaded}
				className={`${!loading && className} image ${
					loading ? 'hidden' : ''
				}`}
				{...rest} // Pass all remaining props to the img
			/>
		</>
	);
};

export default ImageLoader;
