import React, { useState, useEffect } from 'react';
import './style.scss';
import ImageLoader from '../../ui/Image';
import AnimatedComponent from '../../ui/Animated/Component';
import { fadeInLeft } from '../../../utility/framer-transitions';
import { usePageStore } from '../../../store/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiOutlineMenu } from 'react-icons/hi';
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from 'react-icons/md';

export default function SideBar() {
  const { pages } = usePageStore();
  const location = useLocation();
  const navigateTo = useNavigate();

  // Mobile overlay open/close
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Desktop collapsed/expanded
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  // Track if viewport is desktop or mobile
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1000);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1000);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle the mobile overlay
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Toggle desktop collapse
  const toggleDesktopCollapse = () => {
    setIsDesktopCollapsed((prev) => !prev);
  };

  // Prevent clicks from propagating to the backdrop
  const handleChildClick = (e) => {
    e.stopPropagation();
  };

  // Decide final sidebar classes (mobile + desktop)
  const sideBarClassList = [
    'side-bar',
    isSidebarOpen ? 'expand' : 'collapse', // mobile overlay classes
    isDesktop ? (isDesktopCollapsed ? 'desktop-collapsed' : 'desktop-expanded') : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* 1) MOBILE hamburger */}
      <HiOutlineMenu onClick={toggleSidebar} className="little-side-bar" />

      {/* 2) WRAPPER: holds both sidebar & the desktop toggle button */}
      <div className="sidebar-wrapper">
        {/* DESKTOP toggle button (arrow icons) — only render if in desktop mode */}
        {isDesktop && (
          <div className="desktop-collapse-btn" onClick={toggleDesktopCollapse}>
            {isDesktopCollapsed ? <MdOutlineArrowForwardIos /> : <MdOutlineArrowBackIosNew />}
          </div>
        )}

        {/* The backdrop container (for mobile blur) */}
        <div
          className={`side-bar-container ${isSidebarOpen ? 'blur' : ''}`}
          onClick={toggleSidebar}
        >
          <AnimatedComponent
            animation={fadeInLeft(0.5, 100)}
            className={sideBarClassList}
            onClick={handleChildClick}
          >
            {/* Mobile close button */}
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

            {pages?.map((page, index) => {
              if (!page.hidden) {
                return (
                  <React.Fragment key={index}>
                    <div
                      className={`nav-item ${page.route === location.pathname ? 'selected' : ''}`}
                      onClick={() => {
                        navigateTo(page.route);
                        toggleSidebar(); // closes on mobile
                      }}
                    >
                      <page.Icon className="icon" />
                      <p>{page.title}</p>
                    </div>

                    {page.key === 'dashboard' && <div className="cut-line"></div>}
                  </React.Fragment>
                );
              }
              return null;
            })}
          </AnimatedComponent>
        </div>
      </div>
    </>
  );
}
