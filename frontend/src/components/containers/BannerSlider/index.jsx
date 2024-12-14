import React from 'react';
import './style.scss';
import ImageLoader from '../../ui/Image';
import Slider from 'react-slick';

export default function BannerSlider() {
	const settings = {
		autoplay: true,
		autoplaySpeed: 4000,
		dots: false,
		infinite: true,
		speed: 1000,
		slidesToShow: 1,
		slidesToScroll: 1,
		swipe: false,
		draggable: false,
	};

	const handleBannerClick = (index) => {
		// Open a new tab for banner-2
		if (index === 1) {
			window.open('https://fidesinnova.io/', '_blank');
		}
	};

	const getResponsiveImage = (folder) => {
		const width = window.innerWidth;

		// Choose the image based on screen width
		if (width <= 500) {
			return `/img/banners/${folder}/${folder}-500.jpg`;
		} else if (width <= 900) {
			return `/img/banners/${folder}/${folder}-900.jpg`;
		} else if (width <= 1367) {
			return `/img/banners/${folder}/${folder}-1367.jpg`;
		} else {
			return `/img/banners/${folder}/${folder}-2200.jpg`;
		}
	};

	return (
		<div className="slider-container">
			<Slider {...settings}>
				{[5, 4].map((folder, index) => (
					<div
						key={index}
						className={`slider-item-wrapper ${
							index === 1 ? 'clickable' : ''
						}`} // Add a class conditionally for banner-2
						onClick={() => handleBannerClick(index)}
						style={{
							cursor: index === 1 ? 'pointer' : 'default',
						}} // Conditional inline style for cursor
					>
						<ImageLoader
							className="slider-banner-item"
							src={getResponsiveImage(folder)}
							alt={`Banner ${index + 1}`}
							width={'100%'}
							height={'300px'}
						/>
					</div>
				))}
			</Slider>
		</div>
	);
}
