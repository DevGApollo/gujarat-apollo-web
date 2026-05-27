import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Saare Pages ke Imports
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Investors from './pages/Investors';
import Products from './pages/Products';
// 🔥 Tumhara Naya Rename Kiya Hua Admin Dashboard
import AdminDashboard from './pages/AdminDashboard';

// 🎯 Ek chota sa helper component jo check karega ki navbar/footer dikhana hai ya nahi
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  // Agar path '/admin' se shuru hota hai, toh navbar aur footer nahi dikhenge
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminPage && <Navbar />}
      
      <main style={{ flex: 1 }}>
        {children}
      </main>
      
      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/products" element={<Products />} />

          {/* 🎯 Premium Admin Dashboard Route (No Navbar/Footer) */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;