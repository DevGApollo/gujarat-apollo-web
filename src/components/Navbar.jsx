import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// 🚀 Aapka real logo automatic yahan se import ho jayega
import logoImg from '../assets/logo.png'; 

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // 🌟 Wahi real beautiful yellowish gold color framework 
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
      {/* 🔥 CSS Stylesheet Injector to ensure ultra-smooth hardware rendering */}
      <style dangerouslySetInnerHTML={{__html: `
        .apollo-nav-link {
          color: #ffffff;
          text-decoration: none;
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0.4px;
          position: relative;
          padding-bottom: 6px;
          /* 💎 Ultra-smooth transition for text color */
          transition: color 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* Pure CSS underline animation framework */
        .apollo-nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 3px;
          background-color: ${BRAND_YELLOWISH};
          /* Starting scale is 0 unless active */
          transform: scaleX(0);
          transform-origin: right;
          /* 💎 Ultra-smooth ease-out transition for the underline */
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* Hover states */
        .apollo-nav-link:hover {
          color: ${BRAND_YELLOWISH} !important;
        }
        
        .apollo-nav-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        /* Active tracking layout properties */
        .apollo-nav-link.active-route {
          color: ${BRAND_YELLOWISH} !important;
          font-weight: 600;
        }
        
        .apollo-nav-link.active-route::after {
          transform: scaleX(1);
        }
      `}} />

      <header style={{
        width: '100%',
        backgroundColor: '#0f2963', // Official corporate deep blue
        height: '90px',            // Header layout configuration height
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        fontFamily: "'Inter', sans-serif",
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
      }}>
        
        {/* 📐 EXACT TWO-WAY CUTOUT LOGO BOX CONTAINER */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          backgroundColor: '#ffffff', // Pure clean white surface background
          paddingLeft: '50px',
          paddingRight: '65px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // 🔥 Magic Line: Symmetrical slant angle shape
          clipPath: 'polygon(0 0, 100% 0, 84% 100%, 0 100%)', 
          zIndex: 10
        }}>
          {/* 🏢 REAL TRANS-CUT APOLLO LOGO */}
          <img 
            src={logoImg} 
            alt="Gujarat Apollo Logo" 
            style={{
              height: '52px',        // Fixed optimal premium scale ratio
              width: 'auto',
              objectFit: 'contain'
            }} 
          />
        </div>

        {/* 🧩 RIGHT SIDE DYNAMIC HOVER NAVIGATION LINKS */}
        <nav style={{
          marginLeft: 'auto',       // Nav items pushed precisely to the right side viewport
          display: 'flex',
          gap: '40px',
          paddingRight: '60px',
          zIndex: 5
        }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`apollo-nav-link ${active ? 'active-route' : ''}`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

      </header>
    </>
  );
};

export default Navbar;