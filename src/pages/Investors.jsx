import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bannerVideo from '../assets/banner-video.mp4'; 

const Investors = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Accordion states
  const [openMainSection, setOpenMainSection] = useState(null); 
  const [openSubSection, setOpenSubSection] = useState(null);

  // Financial Sub-Page Dashboard States
  const [isFinancialPageActive, setIsFinancialPageActive] = useState(false);
  const [activeFinancialTab, setActiveFinancialTab] = useState('Quarterly Results');

  const BRAND_YELLOWISH = '#d97706'; 
  const APPSHEET_APP_ID = "9790de03-824c-4084-b8cf-88975e79fd7d";
  const APPSHEET_ACCESS_KEY = "V2-eLu4X-mhLvZ-pX5tS-qQWH6-Fr9XE-EyOSu-0OdDj-aoLtd"; 

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const appsheetResponse = await axios.post(
          `https://api.appsheet.com/api/v2/apps/${APPSHEET_APP_ID}/tables/appsheet_database/Action`,
          { Action: "Find", Properties: { Locale: "en-US" }, Rows: [] },
          { headers: { 'ApplicationAccessKey': APPSHEET_ACCESS_KEY, 'Content-Type': 'application/json' } }
        );

        let rawRows = appsheetResponse.data?.Rows || appsheetResponse.data || [];
        const sortedRows = rawRows.sort((a, b) => {
          const dateA = new Date(a["Date"] || a["date"] || a["Timestamp"] || 0);
          const dateB = new Date(b["Date"] || b["date"] || b["Timestamp"] || 0);
          if (dateA && dateB && !isNaN(dateA) && !isNaN(dateB)) return dateB - dateA;
          return (b["Financial Year"] || "").toString().localeCompare((a["Financial Year"] || "").toString());
        });
        setDocuments(sortedRows);
      } catch (error) {
        console.error("Database fetching failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const toggleMainSection = (sectionId) => {
    setOpenMainSection(openMainSection === sectionId ? null : sectionId);
    setOpenSubSection(null); 
  };

  const handleOpenPdf = async (path, docTitle) => {
    if (!path) return alert("Is document ki file path link database mein updated nahi hai.");
    let finalUrl = path.trim();

    if (finalUrl.includes("drive.google.com")) {
      const driveIdMatch = finalUrl.match(/\/d\/([a-zA-Z0-9-_]+)/) || finalUrl.match(/id=([a-zA-Z0-9-_]+)/);
      if (driveIdMatch?.[1]) finalUrl = `https://docs.google.com/uc?export=view&id=${driveIdMatch[1]}`;
    } else if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = `https://www.appsheet.com/template/gettablefileurl?appName=${encodeURIComponent("appsheet_database-991036076")}&tableName=${encodeURIComponent("appsheet_database")}&fileName=${encodeURIComponent(finalUrl)}`;
    }

    const pdfViewerWindow = window.open("", "_blank");
    if (!pdfViewerWindow) return alert("Please allow popups to view corporate documents.");

    pdfViewerWindow.document.write(`
      <html>
        <head>
          <title>Loading Document...</title>
          <style>
            body, html { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #1e293b; font-family: sans-serif; }
            .spinner { width: 50px; height: 50px; border: 4px solid rgba(255, 255, 255, 0.1); border-top: 4px solid ${BRAND_YELLOWISH}; border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body><div class="spinner"></div></body>
      </html>
    `);

    try {
      const response = await fetch(finalUrl);
      if (!response.ok) throw new Error("Fetch failed");
      const fileBlob = await response.blob();
      const directBlobDataUrl = URL.createObjectURL(fileBlob);
      
      pdfViewerWindow.document.title = docTitle || "Corporate Report";
      const pdfObject = pdfViewerWindow.document.createElement("object");
      pdfObject.style.width = "100vw"; pdfObject.style.height = "100vh"; pdfObject.style.border = "none";
      pdfObject.type = "application/pdf"; pdfObject.data = directBlobDataUrl;
      
      pdfViewerWindow.document.body.innerHTML = "";
      pdfViewerWindow.document.body.appendChild(pdfObject);
    } catch (error) {
      pdfViewerWindow.location.href = finalUrl;
    }
  };

  const getFilteredDocs = (tabName) => {
    return documents.filter((doc) => {
      const category = (doc["Category"] || "").toString().trim().toLowerCase();
      const title = (doc["Document Title"] || "").toString().trim().toLowerCase();

      switch(tabName) {
        case 'Business Details':
          return category === 'governance' && (title.includes('business') || title.includes('profile'));
        case 'Terms & Conditions':
          return category === 'governance' && (title.includes('appointment') || title.includes('director') || title.includes('familiarization'));
        case 'Composition of Board':
          return category === 'governance' && (title.includes('composition') || title.includes('committee') || title.includes('board'));
        case 'Code of Conduct':
          return category === 'governance' && (title.includes('conduct') || title.includes('code') || title.includes('senior'));
        case 'Policies':
          return category === 'governance' && (title.includes('policy') || title.includes('policies'));
        case 'Grievance Redressal':
          return category === 'governance' && (title.includes('grievance') || title.includes('contact') || title.includes('redressal'));
        case 'Shareholding Pattern':
          return category === 'shareholding' || title.includes('shareholding') || title.includes('pattern');
        case 'Analysts Meet':
          return category === 'earnings' && (title.includes('meet') || title.includes('analyst') || title.includes('investor meeting'));
        case 'Advertisements':
          return title.includes('advertisement') || title.includes('newspaper') || title.includes('publication');
        case 'Credit Rating':
          return title.includes('credit') || title.includes('rating');
        case 'Secretarial Compliance':
          return title.includes('secretarial') || title.includes('compliance report');
        case 'Information Regulation 30':
          return title.includes('regulation 30') || title.includes('reg 30');
        case 'Other Board Meeting':
          return title.includes('board meeting') || title.includes('bm notice');
        case 'Unpaid Dividend':
          return title.includes('dividend') || title.includes('unpaid');
        case 'IEPF':
          return title.includes('iepf') || title.includes('education');
        case 'Presentation':
          return title.includes('presentation') || title.includes('investor presentation');
        case 'Quarterly Results':
          return category === 'earnings' && (title.includes('quarter') || title.includes('q1') || title.includes('q2') || title.includes('q3') || title.includes('q4') || title.includes('result'));
        case 'Annual Reports':
          return category === 'annual reports' || title.includes('annual report');
        case 'Audited Financials':
          return title.includes('audited') || title.includes('subsidiary') || title.includes('standalone');
        default:
          return false;
      }
    });
  };

  const renderDocumentList = (tabId) => {
    const list = getFilteredDocs(tabId);
    if (loading) return <div style={{ padding: '12px 20px', fontSize: '13.5px', color: '#64748b', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading files from AppSheet...</div>;
    if (list.length === 0) return <div style={{ padding: '12px 20px', fontSize: '13.5px', color: '#94a3b8', textAlign: 'center', fontStyle: 'italic', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No active documents found for this criteria.</div>;

    return (
      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderTop: 'none', padding: '5px 0' }}>
        {list.map((doc, i) => {
          const path = doc["File Path"] || doc["file_path"] || doc["PDF"] || "";
          const title = doc["Document Title"] || doc["title"] || "Corporate Report";
          return (
            <div 
              key={i} 
              onClick={() => handleOpenPdf(path, title)}
              className="v-document-row"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 20px', borderBottom: i < list.length - 1 ? '1px solid #edf2f7' : 'none', cursor: 'pointer', transition: 'background-color 0.2s ease' }}
            >
              <span style={{ fontSize: '13.5px', color: '#334155', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: '500', textAlign: 'left' }}>📄 {title} {doc["Financial Year"] ? `(FY ${doc["Financial Year"]})` : ''}</span>
              <span style={{ fontSize: '12.5px', color: '#0066cc', fontWeight: '600', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>View ➔</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700;800&display=swap" />
      
      <style dangerouslySetInnerHTML={{__html: `
        .premium-animate-container, 
        .premium-animate-container button, 
        .premium-animate-container div, 
        .premium-animate-container p, 
        .premium-animate-container span { 
          font-family: 'Plus Jakarta Sans', sans-serif !important; 
        }
        
        .premium-main-heading, .premium-card-heading, .premium-section-heading {
          font-family: 'Montserrat', sans-serif !important;
        }

        .wow-glow-card { 
          background: #ffffff; 
          padding: 30px; 
          border-radius: 8px; 
          border: 1px solid #e2e8f0; 
          flex: 1; 
          min-width: 300px; 
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
        }
        .wow-glow-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px rgba(15, 41, 99, 0.05);
        }
        
        .visaka-centered-document-box { 
          width: 100%; 
          max-width: 1140px; 
          margin: 30px auto 0 auto; 
          box-sizing: border-box;
          padding: 0 15px;
        }
        
        .v-main-block-btn { 
          width: 100%; 
          display: flex; 
          align-items: center; 
          background: #0f2963; 
          color: #ffffff; 
          padding: 14px 20px; 
          font-size: 14px; 
          font-weight: 600; 
          text-align: left; 
          border: none; 
          cursor: pointer; 
          margin-top: 6px; 
          box-sizing: border-box; 
          transition: background 0.2s ease; 
        }
        .v-main-block-btn:hover { background: #16367c !important; }
        .v-caret-icon { font-size: 9px; margin-right: 12px; display: inline-block; transition: transform 0.15s ease; }
        
        .v-sub-bar-link { 
          width: 100%; 
          display: flex; 
          align-items: center; 
          background: #0066cc; 
          color: #ffffff; 
          padding: 11px 18px; 
          font-size: 13px; 
          font-weight: 500; 
          text-align: left; 
          border: none; 
          cursor: pointer; 
          margin-top: 3px; 
          box-sizing: border-box; 
          text-decoration: none; 
          transition: background 0.2s ease; 
        }
        .v-sub-bar-link:hover { background: #0054a8 !important; }
        .v-sub-bar-link.active { background: #004b96; border-left: 4px solid #ffc107; }
        .v-sub-icon { font-size: 12px; margin-right: 12px; display: inline-block; }

        .v-nested-accordion-trigger { 
          width: 100%; 
          display: flex; 
          align-items: center; 
          background: #0066cc; 
          color: #ffffff; 
          padding: 11px 18px; 
          font-size: 13px; 
          font-weight: 500; 
          text-align: left; 
          border: none; 
          cursor: pointer; 
          margin-top: 3px; 
          box-sizing: border-box; 
          transition: background 0.2s ease; 
        }
        .v-nested-accordion-trigger:hover { background: #0054a8 !important; }
        .v-nested-accordion-trigger.expanded-dark { background: #051330; font-weight: 600; }

        .v-leaf-file-bar { 
          width: 100%; 
          display: flex; 
          align-items: center; 
          background: #ffffff; 
          color: #475569; 
          padding: 11px 25px; 
          font-size: 13px; 
          font-weight: 500; 
          text-align: left; 
          border: 1px solid #e2e8f0; 
          border-top: none; 
          cursor: pointer; 
          box-sizing: border-box; 
          transition: all 0.2s ease; 
        }
        .v-leaf-file-bar:hover { background: #f8fafc !important; color: #0066cc !important; }
        .v-leaf-icon { font-size: 11px; margin-right: 12px; color: #94a3b8; }
        
        .v-document-row:hover { background-color: #edf2f7 !important; }
        
        .fin-dashboard { display: flex; gap: 24px; margin-top: 20px; min-height: 400px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
        .fin-sidebar { width: 260px; background: #f8fafc; border-right: 1px solid #e2e8f0; padding: 15px 0; }
        .fin-tab-btn { width: 100%; padding: 13px 20px; text-align: left; font-size: 13.5px; font-weight: 500; color: #334155; border: none; background: transparent; cursor: pointer; border-left: 3px solid transparent; transition: all 0.2s ease; }
        .fin-tab-btn:hover { background: #edf2f7; color: #0066cc; }
        .fin-tab-btn.active { background: #ffffff; color: #0066cc; font-weight: 600; border-left-color: #0066cc; }
        .fin-content { flex: 1; padding: 25px; background: #ffffff; }
      `}} />

      {/* 100% CLEAN VIDEO BANNER WITH NO OVERLAY TEXT AT ALL */}
      <div style={{ width: '100%', height: '360px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', backgroundColor: '#0f2963' }}>
        <video autoPlay loop muted playsInline style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', top: 0, left: 0, zIndex: 1 }}>
          <source src={bannerVideo} type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(to bottom, rgba(15, 32, 67, 0.1) 0%, rgba(10, 20, 40, 0.2) 100%)', zIndex: 2 }} />
      </div>

      {/* BODY CONTENT CONTAINER */}
      <div className="premium-animate-container" style={{ width: '100%', margin: '0 auto 60px auto', backgroundColor: '#ffffff', color: '#000000', paddingTop: '40px' }}>
        
        {/* INVESTOR RELATIONS HEADER PERFECTLY CENTERED HERE */}
        <div style={{ padding: '0 80px', marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 className="premium-main-heading" style={{ fontSize: '36px', margin: '0 0 8px 0', fontWeight: '800', color: '#0f2963', letterSpacing: '-0.5px' }}>
            Investor Relations
          </h1>
          <p style={{ fontSize: '15px', color: '#64748b', margin: '0', fontWeight: '400', lineHeight: '1.5', maxWidth: '600px' }}>
            Access compliance data metrics, financial insights, and regulatory frameworks.
          </p>
          <div style={{ width: '50px', height: '4px', backgroundColor: BRAND_YELLOWISH, marginTop: '14px', borderRadius: '10px' }}></div>
        </div>

        {!isFinancialPageActive && (
          <>
            {/* About Row Cards */}
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '50px', padding: '0 80px' }}>
              <div className="wow-glow-card">
                <span style={{ fontSize: '11px', fontWeight: '700', color: BRAND_YELLOWISH, textTransform: 'uppercase', display: 'block', marginBottom: '10px', letterSpacing: '1px' }}>Corporate Overview</span>
                <h2 className="premium-card-heading" style={{ fontSize: '22px', margin: '0 0 12px 0', fontWeight: '700', color: '#1e293b' }}>About Gujarat Apollo</h2>
                <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                  For over 40 years, Gujarat Apollo Industries has pioneered premier engineering layouts for high-performance crushing plants and road infrastructure technology.
                </p>
              </div>
              <div className="wow-glow-card">
                <span style={{ fontSize: '11px', fontWeight: '700', color: BRAND_YELLOWISH, textTransform: 'uppercase', display: 'block', marginBottom: '10px', letterSpacing: '1px' }}>Investor Proposition</span>
                <h2 className="premium-card-heading" style={{ fontSize: '22px', margin: '0 0 12px 0', fontWeight: '700', color: '#1e293b' }}>Why Invest in Us?</h2>
                <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                  Partnering with Gujarat Apollo means joining an industry proven asset backed by highly secure compliance architecture and historically clean corporate governance logs.
                </p>
              </div>
            </div>

            {/* Split Info Board Section */}
            <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '50px 80px', margin: '50px 0', backgroundColor: '#fafbfc' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                <div>
                  <h2 className="premium-section-heading" style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 20px 0', paddingBottom: '12px', borderBottom: '2px solid #0f2963', color: '#0f2963', display: 'inline-block' }}>Corporate Announcements</h2>
                  <div style={{ marginTop: '5px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700' }}>May 12, 2026</span>
                    <p style={{ fontSize: '15px', color: '#1e293b', margin: '6px 0 0 0', fontWeight: '500' }}>Notice of the Board Meeting to consider Financial Results.</p>
                  </div>
                </div>
                <div>
                  <h2 className="premium-section-heading" style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 20px 0', paddingBottom: '12px', borderBottom: '2px solid #0f2963', color: '#0f2963', display: 'inline-block' }}>Statutory Events & Calendar</h2>
                  <div style={{ marginTop: '5px' }}>
                    <span style={{ fontSize: '12px', color: BRAND_YELLOWISH, fontWeight: '700' }}>UPCOMING • June 18, 2026</span>
                    <p style={{ fontSize: '15px', color: '#1e293b', margin: '6px 0 0 0', fontWeight: '500' }}>40th Annual General Meeting (AGM) & Investor Forum</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* INTERACTIVE COMPLIANCE STACK */}
        <div>
          
          {isFinancialPageActive ? (
            <div style={{ padding: '0 80px' }}>
              <button 
                onClick={() => setIsFinancialPageActive(false)}
                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', borderRadius: '4px', marginBottom: '25px' }}
              >
                ⬅ Back to Main Document Tree
              </button>
              
              <h3 className="premium-card-heading" style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 6px 0', color: '#1e293b' }}>Financial Statements & Archives</h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 30px 0' }}>Select a division on the left to review parsed analytical files.</p>

              <div className="fin-dashboard">
                <div className="fin-sidebar">
                  {[
                    { id: 'Quarterly Results', label: '📊 Quarterly Financial Results' },
                    { id: 'Annual Reports', label: '📕 Annual Reports' },
                    { id: 'Audited Financials', label: '📋 Audited & Subsidiary Statements' }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      className={`fin-tab-btn ${activeFinancialTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveFinancialTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div className="fin-content">
                  <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 20px 0', color: '#0f2963', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                    Active View: {activeFinancialTab}
                  </h4>
                  {renderDocumentList(activeFinancialTab)}
                </div>
              </div>
            </div>
          ) : (
            
            <div>
              <div className="visaka-centered-document-box">
                
                <h3 className="premium-section-heading" style={{ fontSize: '22px', color: '#0f2963', fontWeight: '700', margin: '0 0 25px 0', textAlign: 'center' }}>
                  LODR Statutory Disclosures & Reports
                </h3>
                
                {/* ================= CONTAINER BLOCK 1: REGULATION 46 ================= */}
                <div>
                  <button className="v-main-block-btn" onClick={() => toggleMainSection('reg46')}>
                    <span className="v-caret-icon" style={{ transform: openMainSection === 'reg46' ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                    Disclosures Under Regulation 46 of SEBI (LODR), 2015
                  </button>

                  {openMainSection === 'reg46' && (
                    <div style={{ padding: 0 }}>
                      
                      {[
                        { id: 'Business Details', title: 'Business Details', icon: '🔗' },
                        { id: 'Terms & Conditions', title: 'Terms & Conditions of Appointment of Independent Directors & Familiarization Programmes', icon: '🔗' },
                        { id: 'Composition of Board', title: 'Composition of the Board and its Various Committees', icon: '🔗' },
                        { id: 'Code of Conduct', title: 'Code of Conduct of Board of Directors & Senior Management Personnel', icon: '📋' },
                        { id: 'Policies', title: 'Policies', icon: '🔗' },
                        { id: 'Grievance Redressal', title: 'Grievance Redressal Contact Details', icon: '🔗' },
                      ].map((sub) => (
                        <div key={sub.id}>
                          <button 
                            className={`v-sub-bar-link ${openSubSection === sub.id ? 'active' : ''}`} 
                            onClick={() => setOpenSubSection(openSubSection === sub.id ? null : sub.id)}
                          >
                            <span className="v-sub-icon">{sub.icon}</span> {sub.title}
                          </button>
                          {openSubSection === sub.id && renderDocumentList(sub.id)}
                        </div>
                      ))}

                      {/* FINANCIAL HUB SWITCH */}
                      <button 
                        className="v-sub-bar-link" 
                        onClick={() => {
                          setIsFinancialPageActive(true);
                          setActiveFinancialTab('Quarterly Results');
                        }}
                        style={{ background: '#004b96', borderLeft: '4px solid #ffc107', fontWeight: '600' }}
                      >
                        <span className="v-sub-icon">📊</span> Financial Information ➔ <span style={{fontSize:'10px', marginLeft:'10px', background:'#ffc107', color:'#000', padding:'2px 5px', borderRadius:'2px', fontWeight:'700'}}>View Structured Sections</span>
                      </button>

                      {[
                        { id: 'Shareholding Pattern', title: 'Shareholding Pattern', icon: '🔗' },
                        { id: 'Details of Agreements', title: 'Details of Agreements Entered into with the Media Companies and / or their Associates, etc - NIL', icon: '🔗' },
                        { id: 'Analysts Meet', title: 'Analysts / Investors Meet', icon: '🔗' },
                        { id: 'New Name Old Name', title: 'New Name and the Old Name of the Listed Entity for continuous period of one year, from the date of the last name change - NOT APPLICABLE', icon: '🔗' },
                        { id: 'Advertisements', title: 'Advertisements in Newspapers (47(1))', icon: '🔗' },
                        { id: 'Credit Rating', title: 'Credit Rating Information', icon: '🔗' },
                        { id: 'Secretarial Compliance', title: 'Secretarial Compliance Report', icon: '🔗' },
                        { id: 'Information Regulation 30', title: 'Information under Regulation 30', icon: '🔗' },
                        { id: 'Statements of Deviations', title: 'Statements of Deviation(s) or Variation(s) as specified in Regulation 32 - NIL', icon: '🔗' },
                        { id: 'Other Board Meeting', title: 'Other Board Meeting', icon: '🔗' }
                      ].map((sub) => (
                        <div key={sub.id}>
                          <button 
                            className={`v-sub-bar-link ${openSubSection === sub.id ? 'active' : ''}`} 
                            onClick={() => setOpenSubSection(openSubSection === sub.id ? null : sub.id)}
                          >
                            <span className="v-sub-icon">{sub.icon}</span> {sub.title}
                          </button>
                          {sub.id !== 'Details of Agreements' && sub.id !== 'New Name Old Name' && sub.id !== 'Statements of Deviations' && openSubSection === sub.id && renderDocumentList(sub.id)}
                        </div>
                      ))}

                      {/* 📂 NESTED ACCORDION: Other Updates */}
                      <button 
                        className={`v-nested-accordion-trigger ${openSubSection === 'updates' ? 'expanded-dark' : ''}`} 
                        onClick={() => setOpenSubSection(openSubSection === 'updates' ? null : 'updates')}
                      >
                        <span className="v-caret-icon" style={{ transform: openSubSection === 'updates' ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                        📂 Other Updates
                      </button>
                      {openSubSection === 'updates' && (
                        <div>
                          <div className="v-leaf-file-bar" onClick={() => handleOpenPdf("https://www.orimi.com/pdf-test.pdf", "Record Date Intimation")}><span className="v-leaf-icon">📁</span> Record Date Intimation</div>
                          <div className="v-leaf-file-bar" onClick={() => handleOpenPdf("https://www.orimi.com/pdf-test.pdf", "Record Date Paper Ad")}><span className="v-leaf-icon">📁</span> Record Date Paper Ad - Stock Split</div>
                        </div>
                      )}

                      {/* 📂 NESTED ACCORDION: CSR Details */}
                      <button 
                        className={`v-nested-accordion-trigger ${openSubSection === 'csr' ? 'expanded-dark' : ''}`} 
                        onClick={() => setOpenSubSection(openSubSection === 'csr' ? null : 'csr')}
                      >
                        <span className="v-caret-icon" style={{ transform: openSubSection === 'csr' ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                        📁 Corporate Social Responsibility Details
                      </button>
                      {openSubSection === 'csr' && (
                        <div>
                          <div className="v-leaf-file-bar" onClick={() => handleOpenPdf("https://www.orimi.com/pdf-test.pdf", "CSR 2024-25")}><span className="v-leaf-icon">📁</span> CSR Composition and Spent Details-FY 2024-25</div>
                          <div className="v-leaf-file-bar" onClick={() => handleOpenPdf("https://www.orimi.com/pdf-test.pdf", "CSR 2023-24")}><span className="v-leaf-icon">📁</span> CSR Composition and Spent Details-FY 2023-24</div>
                          <div className="v-leaf-file-bar" onClick={() => handleOpenPdf("https://www.orimi.com/pdf-test.pdf", "CSR 2022-23")}><span className="v-leaf-icon">📁</span> CSR Composition and Spent Details-FY 2022-23</div>
                        </div>
                      )}

                      {/* 📂 NESTED ACCORDION: Communication to Members */}
                      <button 
                        className={`v-nested-accordion-trigger ${openSubSection === 'comm_members' ? 'expanded-dark' : ''}`} 
                        onClick={() => setOpenSubSection(openSubSection === 'comm_members' ? null : 'comm_members')}
                      >
                        <span className="v-caret-icon" style={{ transform: openSubSection === 'comm_members' ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                        📁 Communication to Members
                      </button>
                      {openSubSection === 'comm_members' && (
                        <div>
                          <div className="v-leaf-file-bar" onClick={() => handleOpenPdf("https://www.orimi.com/pdf-test.pdf", "Saksham Newspaper")}><span className="v-leaf-icon">📁</span> Saksham Niveshak Newspaper Publication</div>
                          <div className="v-leaf-file-bar" onClick={() => handleOpenPdf("https://www.orimi.com/pdf-test.pdf", "Saksham Niveshak")}><span className="v-leaf-icon">📁</span> Saksham Niveshak</div>
                          <div className="v-leaf-file-bar" onClick={() => handleOpenPdf("https://www.orimi.com/pdf-test.pdf", "Memorandum Articles")}><span className="v-leaf-icon">📁</span> Memorandum and Article of Association</div>
                        </div>
                      )}

                    </div>
                  )}
                </div>

                {/* ================= CONTAINER BLOCK 2: OTHER DISCLOSURES ================= */}
                <div>
                  <button className="v-main-block-btn" onClick={() => toggleMainSection('other_disc')}>
                    <span className="v-caret-icon" style={{ transform: openMainSection === 'other_disc' ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                    Other Disclosures
                  </button>
                  {openMainSection === 'other_disc' && (
                    <div style={{ padding: 0 }}>
                      {[
                        { id: 'Unpaid Dividend', title: 'Unpaid Dividend Information' },
                        { id: 'IEPF', title: 'Investor Education & Protection Fund (IEPF)' },
                        { id: 'General Disclosures', title: 'General Disclosures' },
                        { id: 'Media', title: 'Media' },
                        { id: 'Statutory Forms', title: 'Statutory Forms' },
                        { id: 'Presentation', title: 'Investors Presentation' },
                        { id: 'Corporate Governance', title: 'Corporate Governance' },
                        { id: 'MOEF', title: 'MOEF Compliance Reports' },
                        { id: 'Related Party', title: 'Disclosures on Related Party Transactions' }
                      ].map((otherTab) => (
                        <div key={otherTab.id}>
                          <button 
                            className={`v-sub-bar-link ${openSubSection === otherTab.id ? 'active' : ''}`}
                            onClick={() => setOpenSubSection(otherTab.id !== 'General Disclosures' && 
                                                           otherTab.id !== 'Media' && 
                                                           otherTab.id !== 'Statutory Forms' && 
                                                           otherTab.id !== 'Corporate Governance' && 
                                                           otherTab.id !== 'MOEF' && 
                                                           otherTab.id !== 'Related Party' ? (openSubSection === otherTab.id ? null : otherTab.id) : null)}
                          >
                            <span className="v-caret-icon">▶</span> {otherTab.title}
                          </button>
                          {otherTab.id !== 'General Disclosures' && 
                           otherTab.id !== 'Media' && 
                           otherTab.id !== 'Statutory Forms' && 
                           otherTab.id !== 'Corporate Governance' && 
                           otherTab.id !== 'MOEF' && 
                           otherTab.id !== 'Related Party' && 
                           openSubSection === otherTab.id && renderDocumentList(otherTab.id)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ================= CONTAINER BLOCK 3: CONTACT DETAILS ================= */}
                <div>
                  <button className="v-main-block-btn" onClick={() => toggleMainSection('contact_det')}>
                    <span className="v-caret-icon" style={{ transform: openMainSection === 'contact_det' ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                    Contact Details
                  </button>
                  
                  {openMainSection === 'contact_det' && (
                    <div style={{ padding: '20px 25px', background: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', fontSize: '13.5px', color: '#444444', lineHeight: '1.7' }}>
                      <p style={{ margin: '0 0 6px 0' }}><strong>Compliance Officer:</strong> Secretarial Department</p>
                      <p style={{ margin: '0' }}><strong>Email Address:</strong> investor@gujaratapollo.com</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
          
        </div>
      </div>
    </>
  );
};

export default Investors;