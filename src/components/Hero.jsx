import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Database fetch logic
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products'); 
        const data = await response.json();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error("MongoDB fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Optimized Smooth Slider timing
  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 5000); // 5 seconds for smooth feel
    return () => clearInterval(timer);
  }, [products.length]);

  if (loading) {
    return (
      <div style={{ width: '100%', height: '88vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b0f19', color: '#ffffff' }}>
        <h3 style={{ fontFamily: 'Inter, sans-serif' }}>Loading Dynamics...</h3>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ width: '100%', height: '88vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b0f19', color: '#ffffff' }}>
        <h3>Please Check Backend or Database.</h3>
      </div>
    );
  }

  const current = products[currentIndex];

  return (
    <>
      {/* Premium Font Import & Button Hover Effect */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Poppins:wght@400;500&display=swap');
        
        .apollo-btn-hover {
          transition: all 0.4s ease !important;
        }
        .apollo-btn-hover:hover {
          color: #ffffff !important;
          background-color: #e67e22 !important;
          border-color: #e67e22 !important;
          box-shadow: 0 4px 18px rgba(230, 126, 34, 0.4) !important;
          transform: translateY(-3px);
        }
      `}</style>

      <div style={{ 
        width: '100%', 
        minHeight: '88vh', 
        fontFamily: '"Poppins", "Segoe UI", Roboto, sans-serif', 
        position: 'relative', 
        overflow: 'hidden', 
        backgroundColor: '#0b0f19',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '65px' // To ensure content clears fixed navbar
      }}>
        {/* 1. PRODUCT OPTIMIZED BACKGROUND IMAGE - The Hero is now clear */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
          <img 
            src={current.img} 
            alt={current.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              objectPosition: 'center', 
              transition: 'all 0.9s ease-in-out', // Smoother transition
              opacity: '0.85', // Slightly high opacity for better visual clarity
              filter: 'brightness(0.9) contrast(1.1)' // Enhances equipment visibility
            }}
            onError={(e) => {
              e.target.src = `https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200`;
            }}
          />
        </div>

        {/* 2. REFINED OVERLAY - Content is readable but doesn't block the product */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'linear-gradient(to right, rgba(11, 15, 25, 0.96) 0%, rgba(11, 15, 25, 0.8) 45%, rgba(11, 15, 25, 0.3) 100%)', 
          zIndex: 2 
        }} />
        
        {/* 3. Main spacious content - Left aligned */}
        <div style={{ 
          position: 'relative', 
          zIndex: 3, 
          width: '100%',
          maxWidth: '1280px', 
          margin: '0 auto',
          padding: '40px 6%', 
          boxSizing: 'border-box'
        }}>
          <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            
            {/* Tagline / Subtitle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <span style={{ 
                color: '#e67e22', 
                fontSize: '13px', 
                fontWeight: '700', 
                fontFamily: '"Montserrat", sans-serif',
                letterSpacing: '3px', 
                textTransform: 'uppercase' 
              }}>
                PREMIUM EQUIPMENT // 0{currentIndex + 1}
              </span>
              <div style={{ width: '50px', height: '2px', backgroundColor: '#e67e22' }} />
            </div>

            {/* Industrial Grade Large Title with clear spacing */}
            <h1 style={{ 
              fontSize: 'clamp(36px, 5vw, 60px)', 
              fontWeight: '800', 
              color: '#ffffff', 
              fontFamily: '"Montserrat", sans-serif', 
              margin: '0 0 14px 0', 
              lineHeight: '1.2',
              letterSpacing: '-1px'
            }}>
              {current.name}
            </h1>

            {/* Technical Sub-Tagline */}
            <h2 style={{ 
              fontSize: 'clamp(17px, 2.2vw, 24px)', 
              fontWeight: '500', 
              color: '#cbd5e1', 
              margin: '0 0 28px 0',
              lineHeight: '1.4'
            }}>
              {current.tagline}
            </h2>

            {/* Accent Separator */}
            <div style={{ width: '70px', height: '4px', backgroundColor: '#e67e22', marginBottom: '32px', borderRadius: '2px' }} />

            {/* Detailed Description */}
            <p style={{ 
              color: '#cbd5e1', 
              fontSize: 'clamp(14.5px, 1.6vw, 17.5px)', 
              lineHeight: '1.8', 
              margin: '0 0 45px 0',
              fontWeight: '400',
              textAlign: 'left' // Full left align
            }}>
              {current.desc}
            </p>

            {/* Premium Industrial Button with Hover Glow Effect */}
            <button 
              className="apollo-btn-hover" 
              style={{ 
                backgroundColor: 'transparent',
                color: '#e67e22', // Apollo Orange
                border: '2px solid #e67e22',
                padding: '16px 36px', 
                fontSize: '14.5px', 
                fontWeight: '700', 
                fontFamily: '"Montserrat", sans-serif',
                textTransform: 'uppercase', 
                borderRadius: '6px', 
                cursor: 'pointer',
                letterSpacing: '1.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              Explore Specifications
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

          </div>
        </div>

        {/* Dot Navigation - Clear on bottom right */}
        <div style={{ 
          position: 'absolute', 
          bottom: '50px', 
          right: '8%', 
          zIndex: 4, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px' 
        }}>
          {products.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentIndex(index)} 
              style={{ 
                border: 'none', 
                width: index === currentIndex ? '32px' : '8px', 
                height: '8px', 
                borderRadius: '4px', 
                backgroundColor: index === currentIndex ? '#e67e22' : 'rgba(255, 255, 255, 0.4)', 
                cursor: 'pointer', 
                transition: 'all 0.5s ease' 
              }} 
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;