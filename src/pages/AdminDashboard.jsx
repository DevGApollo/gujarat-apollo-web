import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('documents');

  // 📁 Form States (For Fresh Upload)
  const [title, setTitle] = useState('');
  const [financialYear, setFinancialYear] = useState('2025-26');
  const [category, setCategory] = useState('Earnings');
  const [timeline, setTimeline] = useState('');
  const [file, setFile] = useState(null);

  // 📝 Edit States (For Modal Form)
  const [isEditing, setIsEditing] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editFinancialYear, setEditFinancialYear] = useState('2025-26');
  const [editCategory, setEditCategory] = useState('Earnings');
  const [editTimeline, setEditTimeline] = useState('');

  // 📊 Live Data List State
  const [allDocs, setAllDocs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // 1️⃣ Fetch Function
  const fetchDocuments = async () => {
    try {
      const response = await fetch('https://gujarat-apollo-backend-v1.onrender.com'); 
      if (response.ok) {
        const data = await response.json();
        setAllDocs(data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // 2️⃣ Upload Handler (POST)
  const handleDocSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Bhai pahle PDF file toh select karo!");
      return;
    }
    setIsUploading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('financialYear', financialYear);
    formData.append('category', category);
    formData.append('timeline', timeline);
    formData.append('file', file); 

    try {
      const response = await fetch('https://gujarat-apollo-backend-v1.onrender.com', {
        method: 'POST',
        body: formData, 
      });
      if (response.ok) {
        alert("🎉 Document upload ho gaya!");
        setTitle('');
        setTimeline('');
        setFile(null);
        e.target.reset(); 
        fetchDocuments();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // 3️⃣ Open Edit Modal (Purana data pre-fill karne ke liye)
const openEditModal = (doc) => {
  setCurrentDocId(doc._id); // 👈 YEH LINE SABSE MAIN HAI, check karo ye likhi hai ya nahi!
  setEditTitle(doc.title);
  setEditFinancialYear(doc.financialYear);
  setEditCategory(doc.category);
  setEditTimeline(doc.timeline || '');
  setIsEditing(true);
};
  // 4️⃣ Update Handler (PUT)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://gujarat-apollo-backend-v1.onrender.com/api/documents/${currentDocId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          financialYear: editFinancialYear,
          category: editCategory,
          timeline: editTimeline
        })
      });

      if (response.ok) {
        alert("📝 Parameters safely updated inside the cluster!");
        setIsEditing(false);
        fetchDocuments(); // UI refresh karo
      } else {
        alert("Update failed!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 5️⃣ Delete Handler (DELETE)
  const handleDeleteDoc = async (id) => {
    if (window.confirm("Kya aap sach me is report ko delete karna chahte hain?")) {
      try {
        const response = await fetch(`https://gujarat-apollo-backend-v1.onrender.com/api/documents/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          alert("Deleted from repository!");
          setAllDocs(allDocs.filter(doc => doc._id !== id));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: '"Inter", sans-serif' }}>
      
      {/* LEFT SIDEBAR PANEL */}
      <div style={{ width: '260px', backgroundColor: '#0f172a', color: '#cbd5e1', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        <div style={{ padding: '0 24px 25px 24px', borderBottom: '1px solid #1e293b', marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: '700' }}>APOLLO <span style={{color: '#38bdf8', fontSize:'12px'}}>ADMIN</span></h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b' }}>Control Console v2.0</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, padding: '0 12px' }}>
          <button onClick={() => setActiveTab('documents')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', background: '#1e293b', color: '#38bdf8', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>📁 Manage Documents</button>
        </div>
      </div>

      {/* RIGHT CONTENT WORKSPACE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <div style={{ height: '70px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', shrink: 0 }}>
          <h4 style={{ margin: 0, fontSize: '16px', color: '#334155', fontWeight: '600' }}>Investor Relations Repository</h4>
          <span style={{ fontSize: '13px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '6px' }}>Server Status: <strong style={{color: '#10b981'}}>● LIVE</strong></span>
        </div>

        <div style={{ padding: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px', alignItems: 'start' }}>
              
              {/* INPUT FORM BLOCK */}
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 20px 0', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>Publish Document</h4>
                <form onSubmit={handleDocSubmit}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Document Title</label>
                    <input type="text" placeholder="e.g., Annual Financial Results" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Timeline</label>
                    <input type="text" placeholder="e.g., Q1 Ended June" value={timeline} onChange={(e) => setTimeline(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Year</label>
                      <select value={financialYear} onChange={(e) => setFinancialYear(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff' }}>
                        <option value="2025-26">2025-26</option>
                        <option value="2024-25">2024-25</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Category</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff' }}>
                        <option value="Earnings">Earnings</option>
                        <option value="Annual Reports">Annual Reports</option>
                        <option value="Shareholding">Shareholding</option>
                        <option value="Governance">Governance</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ padding: '15px', border: '2px dashed #cbd5e1', borderRadius: '6px', textAlign: 'center', marginBottom: '20px', backgroundColor: '#f8fafc' }}>
                    <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} required style={{ fontSize: '13px' }} />
                  </div>
                  <button type="submit" disabled={isUploading} style={{ width: '100%', backgroundColor: isUploading ? '#64748b' : '#0284c7', color: '#fff', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: isUploading ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
                    {isUploading ? 'Connecting to Cluster...' : 'Deploy Live Node 🚀'}
                  </button>
                </form>
              </div>

              {/* LIVE ACTIVE REPOSITORY TABLE */}
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 20px 0', color: '#0f172a' }}>Active Core Cluster Asset Repository ({allDocs.length})</h4>
                {allDocs.length === 0 ? (
                  <p style={{fontSize: '14px', color:'#94a3b8', textAlign:'center', marginTop: '30px'}}>Database cluster khali hai. Koi live asset nahi mila.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '12px' }}>
                        <th style={{ padding: '10px' }}>ASSET NAME</th>
                        <th style={{ padding: '10px' }}>CLUSTER TYPE</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '14px' }}>
                      {allDocs.map(doc => (
                        <tr key={doc._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 10px', fontWeight: '600', color: '#1e293b' }}>
                            {doc.title} 
                            <br/>
                            <span style={{fontSize:'11px', color:'#94a3b8', fontWeight:'normal'}}>{doc.financialYear} • {doc.timeline || 'Full Year'}</span>
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                              {doc.category}
                            </span>
                          </td>
                         <td style={{ padding: '12px 10px', textAlign: 'center', display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', height: '50px' }}>
  {/* 👇 NAYA DOWNLOAD BUTTON */}
  <a 
    href={doc.fileUrl?.startsWith('http') ? doc.fileUrl : `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/${doc.fileUrl}`} 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ backgroundColor: '#f0fdf4', color: '#16a34a', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', display: 'inline-block' }}
  >
    View 📂
  </a>

  <button onClick={() => openEditModal(doc)} style={{ backgroundColor: '#e0f2fe', color: '#0369a1', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Edit 📝</button>
  <button onClick={() => handleDeleteDoc(doc._id)} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Purge 🛑</button>
</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
          </div>
        </div>
      </div>

      {/* 🚀 OVERLAY POPUP EDIT MODAL */}
      {isEditing && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', width: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Modify Node Parameters</h3>
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Document Title</label>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Timeline</label>
                <input type="text" value={editTimeline} onChange={(e) => setEditTimeline(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '25px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Year</label>
                  <select value={editFinancialYear} onChange={(e) => setEditFinancialYear(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff' }}>
                    <option value="2025-26">2025-26</option>
                    <option value="2024-25">2024-25</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Category</label>
                  <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff' }}>
                    <option value="Earnings">Earnings</option>
                    <option value="Annual Reports">Annual Reports</option>
                    <option value="Shareholding">Shareholding</option>
                    <option value="Governance">Governance</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '10px 18px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#64748b' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 18px', border: 'none', backgroundColor: '#0284c7', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Save Changes ✨</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;