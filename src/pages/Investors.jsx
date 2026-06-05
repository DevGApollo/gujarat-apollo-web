import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Assets se aapki video loop link
import bannerVideo from '../assets/banner-video.mp4'; 

const Investors = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Earnings'); 
  const [selectedYear, setSelectedYear] = useState('All Years'); 
  const [currentPage, setCurrentPage] = useState(1);
  
  // Visaka style Accordion track karne ke liye state
  const [openSection, setOpenSection] = useState(0); // By default pehla khula rahega

  const itemsPerPage = 8; 

  const BRAND_YELLOWISH = '#d97706'; 
  const APPSHEET_APP_ID = "9790de03-824c-4084-b8cf-88975e79fd7d";
  const APPSHEET_ACCESS_KEY = "V2-eLu4X-mhLvZ-pX5tS-qQWH6-Fr9XE-EyOSu-0OdDj-aoLtd"; 

  // Wahi original 4 categories, bina kisi faltu extra ke
  const lodrSections = [
    { id: 'Earnings', title: "Disclosures Under Regulation 46 of SEBI (LODR), 2015 (Financials)" },
    { id: 'Annual Reports', title: "Annual Reports & Related Statutory Filings" },
    { id: 'Shareholding', title: "Shareholding Pattern & Share Capital Details" },
    { id: 'Governance', title: "Corporate Governance & Board Committees Code" }
  ];

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

  useEffect(() => { setCurrentPage(1); }, [activeTab, selectedYear]);

  const uniqueYears = Array.from(
    new Set(
      documents.map(doc => {
        const rawYear = (doc["Financial Year"] || doc["Year"] || "").toString().trim();
        if (rawYear && (rawYear.includes('-') || /^(19|20)\d{2}$/.test(rawYear))) return rawYear;
        const titleMatch = (doc["Document Title"] || "").match(/\b(20\d{2})\b/);
        return titleMatch ? titleMatch[1] : "";
      }).filter(year => year !== "")
    )
  ).sort((a, b) => b.localeCompare(a));

  const filteredDocuments = documents.filter((doc) => {
    const docCategory = (doc["Category"] || "").toString().trim().toLowerCase();
    const docTitle = (doc["Document Title"] || "").toString().trim().toLowerCase();
    const docYear = (doc["Financial Year"] || "").toString().trim();
    const targetTab = activeTab.toLowerCase();

    let isMatchingCategory = false;
    if (targetTab === 'earnings') {
      if (docCategory === 'earnings' || docTitle.includes('daily') || docTitle.includes('earn') || docTitle.includes('statement')) {
        if (!docTitle.includes('annual')) isMatchingCategory = true;
      }
    } else if (targetTab === 'annual reports') {
      if (docCategory === 'annual reports' || docTitle.includes('annual')) isMatchingCategory = true;
    } else if (targetTab === 'shareholding') {
      if (docCategory === 'shareholding' || docTitle.includes('share') || docTitle.includes('pattern')) isMatchingCategory = true;
    } else if (targetTab === 'governance') {
      if (docCategory === 'governance' || docTitle.includes('govern') || docTitle.includes('bm') || docTitle.includes('board')) isMatchingCategory = true;
    }

    const isMatchingYear = selectedYear === "All Years" || docYear === selectedYear || docTitle.includes(selectedYear.toLowerCase());
    return isMatchingCategory && isMatchingYear;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage) || 1;

  const handleOpenPdf = async (path, docTitle) => {
    if (!path) return alert("File path khali hai.");
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
            body, html { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #1e293b; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #cbd5e1; }
            .loader-wrapper { display: flex; flex-direction: column; align-items: center; gap: 20px; transition: opacity 0.3s ease; }
            .spinner { width: 50px; height: 50px; border: 4px solid rgba(255, 255, 255, 0.1); border-top: 4px solid ${BRAND_YELLOWISH}; border-radius: 50%; animation: spin 1s linear infinite; }
            .loading-text { font-size: 16px; font-weight: 400; letter-spacing: 0.5px; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div id="loader" class="loader-wrapper">
            <div class="spinner"></div>
            <div class="loading-text">Please wait, loading your document...</div>
          </div>
        </body>
      </html>
    `);

    try {
      const response = await fetch(finalUrl);
      if (!response.ok) throw new Error("Fetch failed");
      const fileBlob = await response.blob();
      const directBlobDataUrl = URL.createObjectURL(fileBlob);
      
      pdfViewerWindow.document.title = docTitle || "Corporate Report";
      
      const loaderDiv = pdfViewerWindow.document.getElementById("loader");
      if (loaderDiv) loaderDiv.style.display = "none";

      const pdfObject = pdfViewerWindow.document.createElement("object");
      pdfObject.style.width = "100vw"; pdfObject.style.height = "100vh"; pdfObject.style.border = "none";
      pdfObject.type = "application/pdf"; pdfObject.data = directBlobDataUrl;
      
      const pdfEmbed = pdfViewerWindow.document.createElement("embed");
      pdfEmbed.type = "application/pdf"; pdfEmbed.src = directBlobDataUrl;
      
      pdfObject.appendChild(pdfEmbed);
      pdfViewerWindow.document.body.appendChild(pdfObject);
    } catch (error) {
      pdfViewerWindow.location.href = finalUrl;
    }
  };

  const handleAccordionToggle = (index, tabId) => {
    setOpenSection(openSection === index ? null : index);
    setActiveTab(tabId);
  };

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes apolloFloatUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .premium-animate-container { font-family: 'Inter', sans-serif; animation: apolloFloatUp 0.5s ease forwards; width: 100%; }
        .wow-glow-card { background: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #e2e8f0; flex: 1; min-width: 320px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: all 0.3s ease; cursor: pointer; }
        .wow-glow-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06); border-color: #cbd5e1; }
        .tcs-grid-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 25px 10px 20px 0px; background: #ffffff; border-bottom: 1px solid #e2e8f0; transition: all 0.2s ease; cursor: pointer; }
        .tcs-grid-item:hover .tcs-grid-arrow { transform: translateX(6px); color: ${BRAND_YELLOWISH}; }
        .tcs-grid-item:hover h4 { color: ${BRAND_YELLOWISH}; }
        .tcs-grid-arrow { color: #0f2963; font-size: 20px; transition: transform 0.25s ease; margin-top: 2px; }
        .nav-btn-layout { padding: 10px 20px; border: 1px solid #cbd5e1; background: white; color: #334155; font-weight: 500; font-size: 14px; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
        .nav-btn-layout:hover:not(:disabled) { background: #0f172a; color: white; }
        
        /* Corporate Accordion Button - Clean Arrow format */
        .visaka-accordion-btn { width: 100%; display: flex; justify-content: space-between; align-items: center; background: #0f2963; color: white; padding: 18px 24px; font-weight: 500; font-size: 16px; text-align: left; border: none; cursor: pointer; transition: background 0.2s; border-radius: 4px; }
        .visaka-accordion-btn:hover { background: #15357a; }
      `}} />

      {/* ⚠️ NOTIFICATION / UNDER DEPLOYMENT BANNER */}
      <div style={{ backgroundColor: '#fffbeb', color: '#b45309', padding: '12px 20px', textAlign: 'center', fontSize: '14px', fontWeight: '500', borderBottom: '1px solid #fde68a', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span>⚠️</span>
        <span><strong>Notice:</strong> This website is currently under deployment phase. Some links or dashboard components may change during live setup synchronization.</span>
      </div>

      {/* 🎬 DYNAMIC BANNER BLOCK */}
      <div style={{ width: '100%', height: '400px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", backgroundColor: '#f1f5f9' }}>
        <video autoPlay loop muted playsInline style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', top: 0, left: 0, zIndex: 1 }}>
          <source src={bannerVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(to bottom, rgba(15, 32, 67, 0.15) 0%, rgba(10, 20, 40, 0.25) 100%)', zIndex: 2 }} />
        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', color: '#ffffff', padding: '24px 40px', maxWidth: '850px', backgroundColor: 'rgba(11, 22, 46, 0.45)', borderRadius: '12px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <h1 style={{ fontSize: '44px', margin: '0 0 12px 0', fontWeight: '600', letterSpacing: '-0.5px', color: '#ffffff' }}>Investor Relations</h1>
          <p style={{ fontSize: '16px', color: '#f1f5f9', margin: '0 auto', fontWeight: '400', lineHeight: '1.6', letterSpacing: '0.1px' }}>
            Access quarterly compliance metrics, corporate filings, fiscal earnings reports, and shareholder resource provisions.
          </p>
        </div>
      </div>

      {/* 🏛️ CORE CONTENT AREA */}
      <div className="premium-animate-container" style={{ width: '100%', margin: '0px auto 80px auto', position: 'relative', zIndex: 5, backgroundColor: '#ffffff', color: '#000000', paddingTop: '60px' }}>
        
        {/* CARDS */}
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

        {/* ANNOUNCEMENTS */}
        <div className="w-full bg-white border-y border-slate-200 my-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
            <div className="p-8 sm:p-12 bg-white border-b md:border-b-0 md:border-r border-slate-200 w-full flex flex-col justify-start">
              <h2 style={{ fontSize: '22px', fontWeight: '400', color: '#000000', margin: '0 0 25px 0', paddingBottom: '12px', borderBottom: '1px solid #111' }}>Corporate Announcements</h2>
              <div className="mt-4 space-y-6 flex-grow">
                <div className="border-b border-slate-100 pb-4">
                  <span style={{ fontSize: '13px', color: '#888888', display: 'block', marginBottom: '4px' }}>May 12, 2026</span>
                  <p style={{ fontSize: '16px', color: '#222222', margin: 0, fontWeight: '300', lineHeight: '1.5' }}>Notice of the Board Meeting to consider Financial Results.</p>
                </div>
                <div className="border-b border-slate-100 pb-4">
                  <span style={{ fontSize: '13px', color: '#888888', display: 'block', marginBottom: '4px' }}>April 20, 2026</span>
                  <p style={{ fontSize: '16px', color: '#222222', margin: 0, fontWeight: '300', lineHeight: '1.5' }}>Submission of Compliance Certificate under Regulation 74(5).</p>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-12 bg-white w-full flex flex-col justify-start">
              <h2 style={{ fontSize: '22px', fontWeight: '400', color: '#000000', margin: '0 0 25px 0', paddingBottom: '12px', borderBottom: '1px solid #111' }}>Statutory Events & Calendar</h2>
              <div className="mt-4 flex-grow">
                <div style={{ backgroundColor: '#f9f9f9', padding: '24px', borderLeft: `3px solid ${BRAND_YELLOWISH}` }}>
                  <span style={{ fontSize: '11px', color: BRAND_YELLOWISH, fontWeight: '500', display: 'block', marginBottom: '6px' }}>UPCOMING • June 18, 2026</span>
                  <p style={{ fontSize: '16px', color: '#222222', margin: 0, fontWeight: '300', lineHeight: '1.6' }}>40th Annual General Meeting (AGM) & Investor Interactive Forum</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📑 ORIGINAL SEBI LODR ACCORDION SECTION */}
        <div style={{ padding: '0 30px' }}>
          <h3 style={{ fontSize: '28px', color: '#000000', fontWeight: '400', marginBottom: '30px', letterSpacing: '-0.5px' }}>
            LODR Statutory Disclosures & Reports
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {lodrSections.map((section, idx) => (
              <div key={section.id} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                
                {/* Accordion Header Button with Elegant Arrow Indicator */}
                <button 
                  className="visaka-accordion-btn"
                  onClick={() => handleAccordionToggle(idx, section.id)}
                >
                  <span>{section.title}</span>
                  <span style={{ 
                    fontSize: '14px', 
                    transition: 'transform 0.25s ease', 
                    transform: openSection === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                    display: 'inline-block' 
                  }}>
                    ▼
                  </span>
                </button>

                {/* Accordion Content Body */}
                {openSection === idx && (
                  <div style={{ padding: '30px', backgroundColor: '#ffffff' }}>
                    
                    {/* Header with Dynamic Financial Year Dropdown */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '25px' }}>
                      <h4 style={{ margin: 0, fontSize: '18px', color: '#334155', fontWeight: '500' }}>
                        Showing Records for {section.id}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '14px', color: '#666666' }}>Filter by Year:</span>
                        <select 
                          value={selectedYear} 
                          onChange={(e) => setSelectedYear(e.target.value)}
                          style={{ border: 'none', borderBottom: '1px solid #000000', padding: '4px 15px 4px 0px', fontSize: '15px', color: '#000000', cursor: 'pointer', outline: 'none', background: 'transparent' }}
                        >
                          <option value="All Years">All Years</option>
                          {uniqueYears.map((year) => <option key={year} value={year}>{year}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* DYNAMIC GRID LOADING */}
                    {loading ? (
                      <p style={{ color: '#666666', padding: '10px 0', fontSize: '15px' }}>Loading records safely from database...</p>
                    ) : filteredDocuments.length === 0 ? (
                      <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                        <h4 style={{ color: '#666666', margin: '0', fontSize: '15px', fontWeight: '400' }}>No Records Found under this Disclosure category for the selected year.</h4>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(45%, 1fr))', columnGap: '60px', rowGap: '10px' }}>
                          {currentItems.map((doc, docIdx) => {
                            const title = doc["Document Title"] || doc["title"] || "Untitled Corporate Report";
                            const year = doc["Financial Year"] || doc["Year"] || "Historical Record";
                            const path = doc["File Path"] || doc["file_path"] || doc["PDF"] || "";

                            return (
                              <div key={docIdx} className="tcs-grid-item" onClick={() => handleOpenPdf(path, title)}>
                                <div style={{ paddingRight: '20px' }}>
                                  <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#000000', fontWeight: '400', lineHeight: '1.4', transition: 'color 0.2s ease' }}>
                                    📁 {title}
                                  </h4>
                                  <span style={{ fontSize: '13px', color: '#777777', fontWeight: '400', display: 'block', marginLeft: '22px' }}>Financial Year: FY {year}</span>
                                </div>
                                <div className="tcs-grid-arrow">➔</div>
                              </div>
                            );
                          })}
                        </div>

                        {/* PAGINATION INSIDE ACCORDION */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '20px', marginTop: '35px' }}>
                          <button className="nav-btn-layout" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</button>
                          <span style={{ fontSize: '14px', fontWeight: '400', color: '#555555' }}>{currentPage} / {totalPages}</span>
                          <button className="nav-btn-layout" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
                        </div>
                      </>
                    )}

                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default Investors;