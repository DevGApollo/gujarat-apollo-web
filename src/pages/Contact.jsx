import React, { useState } from 'react';

const Contact = () => {
  // Form fields state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Success message state
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Abhi backend link nahi hai, isliye seedha validation trigger kar rhe hain
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      
      // Optional: Form fields ko reset karne ke liye
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      alert("Please fill all the required fields.");
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Montserrat:wght@600;700&display=swap" />
      
      <div style={{ 
        fontFamily: "'Plus Jakarta Sans', sans-serif", 
        padding: '60px 20px', 
        backgroundColor: '#f8fafc', 
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '600px', 
          background: '#ffffff', 
          borderRadius: '12px', 
          boxShadow: '0 10px 25px -5px rgba(15, 41, 99, 0.08)', 
          border: '1px solid #e2e8f0',
          padding: '40px',
          boxSizing: 'border-box'
        }}>
          
          {/* CONDITION: Agar submit HO GAYA hai to ye dikhao */}
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{ 
                fontSize: '50px', 
                color: '#10b981', 
                marginBottom: '20px',
                animation: 'scaleUp 0.3s ease' 
              }}>
                ✓
              </div>
              <h2 style={{ 
                fontFamily: "'Montserrat', sans-serif", 
                color: '#0f2963', 
                fontSize: '24px', 
                margin: '0 0 12px 0',
                fontWeight: '700'
              }}>
                Thank You!
              </h2>
              <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', margin: '0 0 25px 0' }}>
                Your message has been successfully received. Our corporate relations officer will review your inquiry and get back to you shortly.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                style={{ 
                  backgroundColor: '#0f2963', 
                  color: '#ffffff', 
                  border: 'none', 
                  padding: '10px 24px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#16367c'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#0f2963'}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            
            /* CONDITION: Agar submit NAHI hua hai to regular form dikhao */
            <div>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ 
                  fontFamily: "'Montserrat', sans-serif", 
                  color: '#0f2963', 
                  fontSize: '26px', 
                  margin: '0 0 8px 0',
                  fontWeight: '700'
                }}>
                  Get In Touch
                </h2>
                <p style={{ color: '#64748b', fontSize: '14px', margin: '0' }}>
                  Have any corporate or investor queries? Drop us a line below.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Subject
                  </label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Investor Relations / Grievance"
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Your Message <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Type your detailed message here..."
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                <button 
                  type="submit"
                  style={{ 
                    backgroundColor: '#0f2963', 
                    color: '#ffffff', 
                    border: 'none', 
                    padding: '14px', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    marginTop: '10px',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#16367c'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#0f2963'}
                >
                  Submit Inquiry
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Contact;