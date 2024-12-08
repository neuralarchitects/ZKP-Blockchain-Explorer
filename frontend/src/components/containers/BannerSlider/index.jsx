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

	return (
		<div className="slider-container">
			<Slider {...settings}>
				{['/img/banner-1.jpg', '/img/banner-2.jpg'].map(
					(url, index) => (
						<div key={index} className="slider-item-wrapper">
							<ImageLoader
								className="slider-banner-item"
								src={url}
								alt={'Device Logo'}
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
