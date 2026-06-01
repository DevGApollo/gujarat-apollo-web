import React, { useState } from 'react';
import miningImg from '../assets/mine.jpg';
import roadImg from '../assets/rode.jpg';
import infraImg from '../assets/infra.jpg';

const HomeSections = () => {
  const [hoveredAbout, setHoveredAbout] = useState(false);
  const [hoveredSector, setHoveredSector] = useState(null);

  const sectors = [
    {
      title: "MINING & QUARRY",
      desc: "Heavy-duty aggregate processing units and jaw-crusher setups engineered for continuous high-throughput extraction.",
      img: miningImg,
    },
    {
      title: "ROAD CONSTRUCTION",
      desc: "Precision asphalt batch mix plants and paver technologies built for expanding high speed national highway infrastructure.",
      img: roadImg,
    },
    {
      title: "INFRASTRUCTURE PROJECTS",
      desc: "Custom ready-mix solutions, concrete production plants, and grading setups optimized for massive dam and marine construction.",
      img: infraImg,
    },
  ];

  return (
    <div style={{ width: '100%', fontFamily: '"Segoe UI", Roboto, Arial, sans-serif', backgroundColor: '#ffffff', padding: '10px 0' }}>
      
      {/* 🏛️ About Us Section (Left Text, Right Image) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 20px auto', padding: '0 20px', display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
        
        {/* Left Side: About Text */}
        <div style={{ flex: '1.2', minWidth: '320px' }}>
          <p style={{ color: '#ff6b00', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            Who We Are
          </p>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#012147', margin: '0 0 12px 0' }}>
            ABOUT GUJARAT APOLLO
          </h2>
          <div style={{ width: '50px', height: '3px', backgroundColor: '#ff6b00', marginBottom: '15px' }}></div>
          <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.6', margin: '0 0 12px 0' }}>
            With decades of engineering excellence, Gujarat Apollo Industries specializes in manufacturing world-class crushing, screening, and road construction equipment. We empower global infrastructure projects with rugged, high-efficiency machinery designed for the toughest terrains.
          </p>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: '0' }}>
            Our commitment to innovation and reliable service ensures maximum uptime and unparalleled productivity for our partners worldwide.
          </p>
        </div>

        {/* Right Side: Image without Import (Using your file name 'Company.jpg') */}
        <div 
          style={{ flex: '1', minWidth: '320px', height: '300px', overflow: 'hidden', borderRadius: '6px' }}
          onMouseEnter={() => setHoveredAbout(true)}
          onMouseLeave={() => setHoveredAbout(false)}
        >
          <img 
            src="/src/assets/Company.jpg" 
            alt="Gujarat Apollo Company Profile" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              borderRadius: '6px',
              transition: 'transform 0.4s ease',
              transform: hoveredAbout ? 'scale(1.05)' : 'scale(1)'
            }} 
            onError={(e) => {
              // Agar extention capital '.JPG' ya '.png' ho toh automatic handle karne ke liye fallback
              e.target.onerror = null;
              e.target.src = "/src/assets/Company.JPG";
            }}
          />
        </div>
      </div>

      {/* Tight Separator Line */}
      <hr style={{ maxWidth: '1200px', margin: '0 auto 25px auto', border: '0', borderTop: '1px solid #e2e8f0' }} />

      {/* 🪨 Sectors We Serve Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 20px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#012147', textTransform: 'uppercase', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>
          Sectors We Serve
        </h2>
        <div style={{ width: '40px', height: '3px', backgroundColor: '#ff6b00' }}></div>
      </div>

      {/* Grid Layout with Smooth Image Hover */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {sectors.map((sector, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'transparent' }}>
            
            <div 
              style={{ height: '210px', width: '100%', overflow: 'hidden', borderRadius: '6px', marginBottom: '15px' }}
              onMouseEnter={() => setHoveredSector(index)}
              onMouseLeave={() => setHoveredSector(null)}
            >
              <img 
                src={sector.img} 
                alt={sector.title} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease',
                  transform: hoveredSector === index ? 'scale(1.06)' : 'scale(1)'
                }} 
              />
            </div>

            <div style={{ padding: '0 5px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#012147', margin: '0 0 8px 0', letterSpacing: '-0.3px' }}>
                {sector.title}
              </h3>
              <p style={{ color: '#555555', fontSize: '14px', lineHeight: '1.6', margin: '0' }}>
                {sector.desc}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default HomeSections;