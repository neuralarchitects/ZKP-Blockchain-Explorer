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

	return (
		<div className="slider-container">
			<Slider {...settings}>
				{['/img/banner-1.jpg', '/img/banner-2.jpg'].map(
					(url, index) => (
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
								src={url}
								alt={`Banner ${index + 1}`}
								width={'100%'}
								height={'auto'}
							/>
						</div>
					)
				)}
			</Slider>
		</div>
	);
}
