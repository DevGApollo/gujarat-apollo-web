import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png'; 

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  const BRAND_YELLOWISH = '#d97706'; 

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Investors', path: '/investors' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .apollo-nav-link {
          color: #ffffff;
          text-decoration: none;
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0.4px;
          position: relative;
          padding: 6px 0;
          transition: color 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .apollo-nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 3px;
          background-color: ${BRAND_YELLOWISH};
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .apollo-nav-link:hover {
          color: ${BRAND_YELLOWISH} !important;
        }
        .apollo-nav-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        .apollo-nav-link.active-route {
          color: ${BRAND_YELLOWISH} !important;
          font-weight: 600;
        }
        .apollo-nav-link.active-route::after {
          transform: scaleX(1);
        }

        /* 📱 Responsive rules for Navbar Mobile Setup */
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .logo-box {
            padding-left: 20px !important;
            padding-right: 35px !important;
            clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%) !important;
          }
        }
      `}} />

      <header style={{
        width: '100%',
        backgroundColor: '#0f2963',
        height: '90px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        fontFamily: "'Inter', sans-serif",
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        boxSizing: 'border-box'
      }}>
        
        {/* Logo Container */}
        <div className="logo-box" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          backgroundColor: '#ffffff',
          paddingLeft: '50px',
          paddingRight: '65px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          clipPath: 'polygon(0 0, 100% 0, 84% 100%, 0 100%)', 
          zIndex: 10
        }}>
          <img 
            src={logoImg} 
            alt="Gujarat Apollo Logo" 
            style={{
              height: '44px',
              width: 'auto',
              objectFit: 'contain'
            }} 
          />
        </div>

        {/* Desktop Navigation Link Menu */}
        <nav className="desktop-nav" style={{
          marginLeft: 'auto',
          display: 'flex',
          gap: '40px',
          paddingRight: '60px',
          zIndex: 5
        }}>
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`apollo-nav-link ${isActive(item.path) ? 'active-route' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Hamburger Toggle Button for Mobile Screens */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'space-around',
            width: '26px',
            height: '20px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            zIndex: 15,
            marginLeft: 'auto',
            marginRight: '25px'
          }}
        >
          <div style={{ width: '26px', height: '3px', backgroundColor: '#ffffff', borderRadius: '2px', transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'rotate(0)', transition: '0.3s' }} />
          <div style={{ width: '26px', height: '3px', backgroundColor: '#ffffff', borderRadius: '2px', opacity: isOpen ? 0 : 1, transition: '0.3s' }} />
          <div style={{ width: '26px', height: '3px', backgroundColor: '#ffffff', borderRadius: '2px', transform: isOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'rotate(0)', transition: '0.3s' }} />
        </button>

        {/* Mobile Dropdown Panel Drawer */}
        <div style={{
          position: 'absolute',
          top: '90px',
          left: 0,
          width: '100%',
          backgroundColor: '#0f2963',
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          padding: '25px 0',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          zIndex: 14,
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`apollo-nav-link ${isActive(item.path) ? 'active-route' : ''}`}
              style={{ fontSize: '18px' }}
            >
              {item.name}
            </Link>
          ))}
        </div>

      </header>
    </>
  );
};

export default Navbar;