import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://gujarat-apollo-backend-v1.onrender.com/api/products'); 
        const data = await response.json();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error("MongoDB fetch error:", error);
      } finally { // ✅ Spelling fixed here (double 'l')
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, [products.length]);

  if (loading) {
    return (
      <div style={{ width: '100%', height: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b0f19', color: '#ffffff' }}>
        <h3 style={{ fontFamily: 'Inter, sans-serif' }}>Loading Dynamics...</h3>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ width: '100%', height: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b0f19', color: '#ffffff' }}>
        <h3>Please Check Backend or Database.</h3>
      </div>
    );
  }

  const current = products[currentIndex];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght=600;700;800&family=Poppins:wght=400;500&display=swap');
        
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

        /* 📱 Mobile Responsive CSS Overrides */
        @media (max-width: 768px) {
          .hero-content-wrapper {
            padding: 30px 20px !important;
          }
          .hero-gradient-overlay {
            background: linear-gradient(to top, rgba(11,15,25,0.98) 0%, rgba(11,15,25,0.85) 60%, rgba(11,15,25,0.5) 100%) !important;
          }
          .hero-dot-navigation {
            bottom: 20px !important;
            right: 50% !important;
            transform: translateX(50%) !important;
          }
          .hero-description-text {
            margin-bottom: 30px !important;
          }
        }
      `}</style>

      <div style={{ 
        width: '100%', 
        minHeight: '85vh', 
        fontFamily: '"Poppins", "Segoe UI", Roboto, sans-serif', 
        position: 'relative', 
        overflow: 'hidden', 
        backgroundColor: '#0b0f19',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}>
        
        {/* Background Image Setup */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
          <img 
            src={current.img} 
            alt={current.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              objectPosition: 'center', 
              transition: 'all 0.9s ease-in-out', 
              opacity: '0.8', 
              filter: 'brightness(0.8) contrast(1.1)' 
            }}
            onError={(e) => {
              e.target.src = `https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200`;
            }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="hero-gradient-overlay" style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'linear-gradient(to right, rgba(11, 15, 25, 0.96) 0%, rgba(11, 15, 25, 0.8) 45%, rgba(11, 15, 25, 0.3) 100%)', 
          zIndex: 2 
        }} />
        
        {/* Content Container */}
        <div className="hero-content-wrapper" style={{ 
          position: 'relative', 
          zIndex: 3, 
          width: '100%',
          maxWidth: '1280px', 
          margin: '0 auto',
          padding: '60px 6%', 
          boxSizing: 'border-box'
        }}>
          <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            
            {/* Tagline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '15px' }}>
              <span style={{ 
                color: '#e67e22', 
                fontSize: 'clamp(11px, 1.5vw, 13px)', 
                fontWeight: '700', 
                fontFamily: '"Montserrat", sans-serif',
                letterSpacing: '2px', 
                textTransform: 'uppercase' 
              }}>
                PREMIUM EQUIPMENT // 0{currentIndex + 1}
              </span>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#e67e22' }} />
            </div>

            {/* Product Title */}
            <h1 style={{ 
              fontSize: 'clamp(28px, 4.5vw, 56px)', 
              fontWeight: '800', 
              color: '#ffffff', 
              fontFamily: '"Montserrat", sans-serif', 
              margin: '0 0 12px 0', 
              lineHeight: '1.25',
              letterSpacing: '-0.5px'
            }}>
              {current.name}
            </h1>

            {/* Tagline */}
            <h2 style={{ 
              fontSize: 'clamp(15px, 2vw, 22px)', 
              fontWeight: '500', 
              color: '#cbd5e1', 
              margin: '0 0 20px 0',
              lineHeight: '1.4'
            }}>
              {current.tagline}
            </h2>

            <div style={{ width: '60px', height: '4px', backgroundColor: '#e67e22', marginBottom: '24px', borderRadius: '2px' }} />

            {/* Description */}
            <p className="hero-description-text" style={{ 
              color: '#cbd5e1', 
              fontSize: 'clamp(14px, 1.5vw, 16.5px)', 
              lineHeight: '1.7', 
              margin: '0 0 35px 0',
              fontWeight: '400',
              textAlign: 'left'
            }}>
              {current.desc}
            </p>

            {/* Button */}
            <button 
              className="apollo-btn-hover" 
              style={{ 
                backgroundColor: 'transparent',
                color: '#e67e22', 
                border: '2px solid #e67e22',
                padding: '14px 30px', 
                fontSize: '13.5px', 
                fontWeight: '700', 
                fontFamily: '"Montserrat", sans-serif',
                textTransform: 'uppercase', 
                borderRadius: '6px', 
                cursor: 'pointer',
                letterSpacing: '1px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              Explore Specifications
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

          </div>
        </div>

        {/* Dots Navigation */}
        <div className="hero-dot-navigation" style={{ 
          position: 'absolute', 
          bottom: '40px', 
          right: '6%', 
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
                width: index === currentIndex ? '28px' : '8px', 
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