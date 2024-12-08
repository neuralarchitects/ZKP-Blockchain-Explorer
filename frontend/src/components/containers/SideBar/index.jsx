import React, { useState } from 'react';
import './style.scss';
import ImageLoader from '../../ui/Image';
import AnimatedComponent from '../../ui/Animated/Component';
import { fadeInLeft } from '../../../utility/framer-transitions';
import { usePageStore } from '../../../store/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiOutlineMenu } from 'react-icons/hi';

export default function SideBar() {
	const { pages } = usePageStore();
	const location = useLocation();
	const navigateTo = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// Prevent the click event from bubbling up to the parent
	const handleChildClick = (e) => {
		e.stopPropagation();
	};

	return (
		<>
			<HiOutlineMenu
				onClick={toggleSidebar}
				className="little-side-bar"
			/>
			<div
				className={`side-bar-container ${isSidebarOpen ? 'blur' : ''}`}
				onClick={toggleSidebar} // Trigger toggleSidebar on container click
			>
				<AnimatedComponent
					animation={fadeInLeft(0.5, 100)}
					className={`side-bar ${
						isSidebarOpen ? 'expand' : 'collapse'
					}`}
					onClick={handleChildClick}
				>
					<HiArrowLeft onClick={toggleSidebar} className="close-bt" />
					<div className="logo-container">
						<div className="logo-holder">
							<ImageLoader
								className="logo"
								src={'/img/fides-logo.png'}
								alt={'FidesInnova Logo'}
								width={50}
								height={50}
								onClick={handleChildClick}
							/>
							<p>Fidesinnova</p>
						</div>
					</div>
					{pages &&
						pages.length > 0 &&
						pages.map((page, index) => {
							if (!page.hidden) {
								return (
									<>
										<div
											key={index}
											className={`nav-item ${
												page.route === location.pathname
													? ' selected'
													: ''
											}`}
											onClick={(e) => {
												navigateTo(page.route);
												toggleSidebar();
											}}
										>
											<page.Icon className="icon" />
											<p>{page.title}</p>
										</div>
										{page.key == 'dashboard' && <div className='cut-line'></div>}
									</>
								);
							}
						})}
				</AnimatedComponent>
			</div>
		</>
	);
}
