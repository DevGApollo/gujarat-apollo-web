import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Assets se aapki video loop link
import bannerVideo from '../assets/banner-video.mp4'; 

const Investors = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🟢 FIXED: Ab by default dono states 'null' hain taaki pehle se kuch bhi open na dikhe
  const [openMainSection, setOpenMainSection] = useState(null); 
  const [openSubSection, setOpenSubSection] = useState(null);

  const BRAND_YELLOWISH = '#d97706'; 
  const APPSHEET_APP_ID = "9790de03-824c-4084-b8cf-88975e79fd7d";
  const APPSHEET_ACCESS_KEY = "V2-eLu4X-mhLvZ-pX5tS-qQWH6-Fr9XE-EyOSu-0OdDj-aoLtd"; 

  // AppSheet database integration
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

  // Safe PDF execution channel
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
            body, html { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #1e293b; font-family: sans-serif; color: #cbd5e1; }
            .spinner { width: 50px; height: 50px; border: 4px solid rgba(255, 255, 255, 0.1); border-top: 4px solid ${BRAND_YELLOWISH}; border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="spinner"></div>
        </body>
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

  // Mapped category logic filters
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
        case 'Financial Information':
          return category === 'earnings' || category === 'annual reports' || title.includes('financial') || title.includes('result');
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
        default:
          return false;
      }
    });
  };

  const renderDocumentList = (tabId) => {
    const list = getFilteredDocs(tabId);
    if (loading) return <div style={{ padding: '12px 20px', fontSize: '13px', color: '#666' }}>Loading files from AppSheet...</div>;
    if (list.length === 0) return <div style={{ padding: '12px 20px', fontSize: '13px', color: '#888', fontStyle: 'italic' }}>No active documents found for this criteria.</div>;

    return (
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderTop: 'none', padding: '10px 0' }}>
        {list.map((doc, i) => {
          const path = doc["File Path"] || doc["file_path"] || doc["PDF"] || "";
          const title = doc["Document Title"] || doc["title"] || "Corporate Report";
          return (
            <div 
              key={i} 
              onClick={() => handleOpenPdf(path, title)}
              style={{ display: 'flex', justifyBetween: 'space-between', padding: '10px 20px', borderBottom: i < list.length - 1 ? '1px solid #edf2f7' : 'none', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#edf2f7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{ fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>📄 {title} {doc["Financial Year"] ? `(FY ${doc["Financial Year"]})` : ''}</span>
              <span style={{ fontSize: '12px', color: '#0066cc', fontWeight: '500' }}>Download / View ➔</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Open+Sans:wght@400;600;700&display=swap" />
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes apolloFloatUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .premium-animate-container { font-family: 'Inter', sans-serif; animation: apolloFloatUp 0.5s ease forwards; width: 100%; }
        .wow-glow-card { background: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #e2e8f0; flex: 1; min-width: 320px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: all 0.3s ease; cursor: pointer; }
        .wow-glow-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06); border-color: #cbd5e1; }
        
        .visaka-block-container { font-family: 'Open Sans', sans-serif; width: 100%; margin-top: 20px; }
        
        /* LEVEL 1 Bar Style Framework */
        .v-main-block-btn { width: 100%; display: flex; align-items: center; background: #0f2963; color: #ffffff; padding: 14px 20px; font-size: 14px; font-weight: 600; text-align: left; border: none; cursor: pointer; border-radius: 3px; margin-top: 6px; box-sizing: border-box; }
        .v-main-block-btn:hover { background: #16367c; }
        .v-caret-icon { font-size: 10px; margin-right: 12px; display: inline-block; transition: transform 0.15s ease; }
        
        /* LEVEL 2 Sub Bar Framework */
        .v-sub-bar-link { width: 100%; display: flex; align-items: center; background: #0066cc; color: #ffffff; padding: 11px 18px; font-size: 13px; font-weight: 500; text-align: left; border: none; cursor: pointer; border-radius: 2px; margin-top: 4px; box-sizing: border-box; text-decoration: none; }
        .v-sub-bar-link:hover { background: #0054a8; }
        .v-sub-bar-link.active { background: #004b96; border-left: 4px solid #ffc107; }
        .v-sub-icon { font-size: 13px; margin-right: 12px; opacity: 0.95; display: inline-block; }

        /* LEVEL 3 Leaf Deep List Elements */
        .v-leaf-file-bar { width: 100%; display: flex; align-items: center; background: #0056b3; color: #ffffff; padding: 11px 20px; font-size: 12.5px; font-weight: 500; text-align: left; border: none; cursor: pointer; border-radius: 2px; margin-top: 3px; padding-left: 48px; text-decoration: none; box-sizing: border-box; }
        .v-leaf-file-bar:hover { background: #004694; }
      `}} />

      {/* ⚠️ NOTIFICATION BANNER */}
      <div style={{ backgroundColor: '#fffbeb', color: '#b45309', padding: '12px 20px', textAlign: 'center', fontSize: '14px', fontWeight: '500', borderBottom: '1px solid #fde68a' }}>
        <span>⚠️ <strong>Notice:</strong> This website is currently under deployment phase. Live database sync active.</span>
      </div>

      {/* 🎬 DYNAMIC BANNER BLOCK */}
      <div style={{ width: '100%', height: '400px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
        <video autoPlay loop muted playsInline style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', top: 0, left: 0, zIndex: 1 }}>
          <source src={bannerVideo} type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(to bottom, rgba(15, 32, 67, 0.15) 0%, rgba(10, 20, 40, 0.25) 100%)', zIndex: 2 }} />
        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', color: '#ffffff', padding: '24px 40px', maxWidth: '850px', backgroundColor: 'rgba(11, 22, 46, 0.45)', borderRadius: '12px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <h1 style={{ fontSize: '44px', margin: '0 0 12px 0', fontWeight: '600', color: '#ffffff' }}>Investor Relations</h1>
          <p style={{ fontSize: '16px', color: '#f1f5f9', margin: '0 auto', fontWeight: '400', lineHeight: '1.6' }}>Access compliance data metrics, financial insights, and regulatory frameworks.</p>
        </div>
      </div>

      {/* 🏛️ CORE CONTENT AREA */}
      <div className="premium-animate-container" style={{ width: '100%', margin: '0px auto 80px auto', position: 'relative', zIndex: 5, backgroundColor: '#ffffff', color: '#000000', paddingTop: '60px' }}>
        
        {/* CARDS CONFIGURATION */}
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '60px', padding: '0 30px' }}>
          <div className="wow-glow-card">
            <span style={{ fontSize: '11px', fontWeight: '500', color: BRAND_YELLOWISH, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '10px' }}>Corporate Overview</span>
            <h2 style={{ fontSize: '24px', color: '#000000', fontWeight: '400', margin: '0 0 14px 0' }}>About Gujarat Apollo</h2>
            <p style={{ fontSize: '15px', color: '#555555', lineHeight: '1.7', margin: 0, textAlign: 'justify', fontWeight: '300' }}>
              For over 40 years, Gujarat Apollo Industries has pioneered premier engineering layouts for high-performance crushing plants and road infrastructure technology. Operating with robust fiscal discipline, we serve a global footprint with core priorities locked on engineering durability.
            </p>
          </div>

          <div className="wow-glow-card">
            <span style={{ fontSize: '11px', fontWeight: '500', color: BRAND_YELLOWISH, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '10px' }}>Investor Proposition</span>
            <h2 style={{ fontSize: '24px', color: '#000000', fontWeight: '400', margin: '0 0 14px 0' }}>Why Invest in Us?</h2>
            <p style={{ fontSize: '15px', color: '#555555', lineHeight: '1.7', margin: 0, textAlign: 'justify', fontWeight: '300' }}>
              Partnering with Gujarat Apollo means joining an industry proven asset backed by highly secure compliance architecture, zero debt leverage dependency, and historically clean corporate governance logs. Our structural market agility guarantees valuation performance.
            </p>
          </div>
        </div>

        {/* ANNOUNCEMENTS SECTION */}
        <div className="w-full bg-white border-y border-slate-200 my-16" style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '40px 0', margin: '60px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', padding: '0 30px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '400', color: '#000000', margin: '0 0 25px 0', paddingBottom: '12px', borderBottom: '1px solid #111' }}>Corporate Announcements</h2>
              <div style={{ marginTop: '16px' }}>
                <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', color: '#888888', display: 'block', marginBottom: '4px' }}>May 12, 2026</span>
                  <p style={{ fontSize: '16px', color: '#222222', margin: 0, fontWeight: '300', lineHeight: '1.5' }}>Notice of the Board Meeting to consider Financial Results.</p>
                </div>
                <div>
                  <span style={{ fontSize: '13px', color: '#888888', display: 'block', marginBottom: '4px' }}>April 20, 2026</span>
                  <p style={{ fontSize: '16px', color: '#222222', margin: 0, fontWeight: '300', lineHeight: '1.5' }}>Submission of Compliance Certificate under Regulation 74(5).</p>
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '400', color: '#000000', margin: '0 0 25px 0', paddingBottom: '12px', borderBottom: '1px solid #111' }}>Statutory Events & Calendar</h2>
              <div style={{ marginTop: '16px' }}>
                <div style={{ backgroundColor: '#f9f9f9', padding: '24px', borderLeft: `3px solid ${BRAND_YELLOWISH}` }}>
                  <span style={{ fontSize: '11px', color: BRAND_YELLOWISH, fontWeight: '500', display: 'block', marginBottom: '6px' }}>UPCOMING • June 18, 2026</span>
                  <p style={{ fontSize: '16px', color: '#222222', margin: 0, fontWeight: '300', lineHeight: '1.6' }}>40th Annual General Meeting (AGM) & Investor Interactive Forum</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📑 DUAL-LAYER COMPLIANCE ENGINE */}
        <div style={{ padding: '0 30px' }}>
          <h3 style={{ fontSize: '28px', color: '#000000', fontWeight: '400', marginBottom: '20px', letterSpacing: '-0.5px' }}>
            LODR Statutory Disclosures & Reports
          </h3>
          
          <div className="visaka-block-container">
            
            {/* ================= BLOCK 1: REGULATION 46 ================= */}
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
                    { id: 'Financial Information', title: 'Financial Information', icon: '🔗' },
                    { id: 'Shareholding Pattern', title: 'Shareholding Pattern', icon: '🔗' },
                    { id: 'Analysts Meet', title: 'Analysts / Investors Meet', icon: '🔗' },
                    { id: 'Advertisements', title: 'Advertisements in Newspapers (47(1))', icon: '🔗' },
                    { id: 'Credit Rating', title: 'Credit Rating Information', icon: '🔗' },
                    { id: 'Secretarial Compliance', title: 'Secretarial Compliance Report', icon: '🔗' },
                    { id: 'Information Regulation 30', title: 'Information under Regulation 30', icon: '🔗' },
                    { id: 'Other Board Meeting', title: 'Other Board Meeting', icon: '🔗' }
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

                  <button className="v-sub-bar-link"><span className="v-sub-icon">🔗</span> Details of Agreements Entered into with the Media Companies - NIL</button>
                  <button className="v-sub-bar-link"><span className="v-sub-icon">🔗</span> New Name and the Old Name of the Listed Entity - NOT APPLICABLE</button>
                  <button className="v-sub-bar-link"><span className="v-sub-icon">🔗</span> Statements of Deviation(s) or Variation(s) (Reg 32) - NIL</button>
                  
                  {/* MULTI-LEVEL ACCORDION: Other Updates */}
                  <button className="v-sub-bar-link" onClick={() => setOpenSubSection(openSubSection === 'updates' ? null : 'updates')}>
                    <span className="v-caret-icon" style={{ transform: openSubSection === 'updates' ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                    Other Updates
                  </button>
                  {openSubSection === 'updates' && (
                    <div>
                      <div className="v-leaf-file-bar" onClick={() => handleOpenPdf("https://www.orimi.com/pdf-test.pdf", "Record Date Intimation")}>📄 Record Date Intimation</div>
                      <div className="v-leaf-file-bar" onClick={() => handleOpenPdf("https://www.orimi.com/pdf-test.pdf", "Record Date Paper Ad")}>📄 Record Date Paper Ad - Stock Split</div>
                    </div>
                  )}

                  {/* MULTI-LEVEL ACCORDION: CSR Details */}
                  <button className="v-sub-bar-link" onClick={() => setOpenSubSection(openSubSection === 'csr' ? null : 'csr')}>
                    <span className="v-caret-icon" style={{ transform: openSubSection === 'csr' ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                    Corporate Social Responsibility Details
                  </button>
                  {openSubSection === 'csr' && (
                    <div>
                      <div className="v-leaf-file-bar" onClick={() => handleOpenPdf("https://www.orimi.com/pdf-test.pdf", "CSR 2024-25")}>📄 CSR Composition and Spent Details-FY 2024-25</div>
                      <div className="v-leaf-file-bar" onClick={() => handleOpenPdf("https://www.orimi.com/pdf-test.pdf", "CSR 2023-24")}>📄 CSR Composition and Spent Details-FY 2023-24</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ================= BLOCK 2: OTHER DISCLOSURES ================= */}
            <div>
              <button className="v-main-block-btn" onClick={() => toggleMainSection('other_disc')}>
                <span className="v-caret-icon" style={{ transform: openMainSection === 'other_disc' ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                Other Disclosures
              </button>

              {openMainSection === 'other_disc' && (
                <div style={{ padding: 0 }}>
                  {['Unpaid Dividend', 'IEPF', 'Presentation'].map((otherTab) => (
                    <div key={otherTab}>
                      <button 
                        className={`v-sub-bar-link ${openSubSection === otherTab ? 'active' : ''}`}
                        onClick={() => setOpenSubSection(openSubSection === otherTab ? null : otherTab)}
                      >
                        <span className="v-caret-icon">▶</span> {otherTab} Information / Presentation
                      </button>
                      {openSubSection === otherTab && renderDocumentList(otherTab)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ================= BLOCK 3: CONTACT DETAILS ================= */}
            <div>
              <button className="v-main-block-btn" onClick={() => toggleMainSection('contact_det')}>
                <span className="v-caret-icon" style={{ transform: openMainSection === 'contact_det' ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                Contact Details
              </button>
              
              {openMainSection === 'contact_det' && (
                <div style={{ padding: '20px 25px', background: '#ffffff', border: '1px solid #dddddd', borderTop: 'none', fontSize: '13.5px', color: '#444444', lineHeight: '1.7' }}>
                  <p style={{ margin: '0 0 6px 0' }}><strong>Compliance Officer:</strong> Secretarial Department</p>
                  <p style={{ margin: '0' }}><strong>Email Address:</strong> investor@gujaratapollo.com</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default Investors;