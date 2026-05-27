import React from 'react';

const HomeSections = () => {
  const sectors = [
    {
      title: "MINING & QUARRY",
      desc: "Heavy-duty aggregate processing units and jaw-crusher setups engineered for continuous high-throughput extraction.",
      img: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "ROAD CONSTRUCTION",
      desc: "Precision asphalt batch mix plants and paver technologies built for expanding high-speed national highway infrastructure.",
      img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "INFRASTRUCTURE PROJECTS",
      desc: "Custom ready-mix solutions, concrete production plants, and grading setups optimized for massive dam and marine construction.",
      img: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop",
    }
  ];

  return (
    <div style={{ width: '100%', fontFamily: '"Segoe UI", Roboto, Arial, sans-serif', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      
      {/* ==================== SECTION 1: DYNAMIC WELCOME HERO SPLIT ==================== */}
      <section style={{ 
        display: 'flex', 
        width: '100%', 
        minHeight: '520px', 
        flexWrap: 'wrap-reverse', 
        backgroundColor: '#f8fafc',
        borderBottom: '4px solid #0c2356'
      }}>
        {/* Left Rich Text Content */}
        <div style={{ 
          flex: '1', 
          minWidth: '320px', 
          padding: '60px 6%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          backgroundColor: '#ffffff'
        }}>
          <span style={{ color: '#ffb800', fontWeight: '800', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>
            Corporate Profile
          </span>
          <h1 style={{ 
            color: '#0c2356', 
            fontSize: '36px', 
            fontWeight: '800', 
            lineHeight: '1.25',
            margin: '0 0 20px 0',
            letterSpacing: '-0.5px'
          }}>
            GUJARAT APOLLO INDUSTRIES LIMITED
          </h1>
          <div style={{ width: '60px', height: '4px', backgroundColor: '#0c2356', marginBottom: '25px' }} />
          
          <p style={{ color: '#4a5568', fontSize: '15.5px', lineHeight: '1.75', margin: '0 0 18px 0', textAlign: 'justify' }}>
            Welcome to India's well respected manufacturer of high quality crushing and screening equipment. 
            Gujarat Apollo Industries Ltd. hails from Mehsana district of Gujarat and is the flagship company of Apollo group of Industries.
          </p>
          <p style={{ color: '#4a5568', fontSize: '15.5px', lineHeight: '1.75', margin: '0 0 30px 0', textAlign: 'justify' }}>
            Established around 50 years ago, Apollo group has catered the Earthmoving industry in India and abroad with its world class after sales services. 
            Our track record is a true testimony to our slogan: <strong style={{ color: '#0c2356' }}>Your dependable partner.</strong>
          </p>
          
          <button style={{
            backgroundColor: '#e67e22',
            color: '#ffffff',
            border: 'none',
            padding: '14px 32px',
            fontSize: '14px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            width: 'fit-content',
            cursor: 'pointer',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(230, 126, 34, 0.25)',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d35400'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e67e22'}
          >
            Read More
          </button>
        </div>

        {/* Right Heavy Industry Image Block */}
        <div style={{ 
          flex: '1', 
          minWidth: '320px', 
          backgroundImage: `url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop')`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px',
          borderLeft: '1px solid #e2e8f0'
        }} />
      </section>

      {/* ==================== SECTION 2: HIGH-END INDUSTRIAL SECTORS GRID ==================== */}
      <section style={{ padding: '90px 6%', backgroundColor: '#f1f5f9' }}>
        <div style={{ textAlign: 'center', marginBottom: '55px' }}>
          <h2 style={{ 
            color: '#0c2356', 
            fontSize: '32px', 
            fontWeight: '800', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Sectors We Serve
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>
            Engineered systems designed to withstand the toughest industrial operational demands.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '30px', 
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {sectors.map((sector, idx) => (
            <div 
              key={idx} 
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                borderBottom: '4px solid transparent',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderBottom = '4px solid #ffb800';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(12, 35, 86, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderBottom = '4px solid transparent';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ 
                width: '100%', 
                height: '220px', 
                backgroundImage: `url(${sector.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />

              <div style={{ padding: '30px', flex: '1', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ 
                  color: '#0c2356', 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  margin: '0 0 12px 0',
                  letterSpacing: '0.5px'
                }}>
                  {sector.title}
                </h3>
                <p style={{ 
                  color: '#475569', 
                  fontSize: '14.5px', 
                  lineHeight: '1.6', 
                  margin: 0,
                  textAlign: 'justify'
                }}>
                  {sector.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomeSections;