import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Donate from './pages/donate.tsx';
import Profile from './pages/Profile.tsx';
import UploadItem from './pages/UploadItem.tsx';
import Items from './pages/items.tsx';
import Messages from './pages/Messages.tsx';
import MapView from './pages/MapView.tsx';
import Login from './pages/login.tsx';
import Register from './pages/Register.tsx';
import ChatsList from './pages/ChatsList.tsx';

import './index.css';

const App: React.FC = () => (
  <Router>
    <div className="app">
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="logo">RE-LIFE</div>
        <nav className="nav-links">
         <Link to="/login">تسجيل الدخول</Link>
          <Link to="/about">عن الموقع</Link>
          <Link to="/items">التبرعات</Link>
          <Link to="/upload">إضافة تبرع</Link>
          <Link to="/profile">الملف الشخصي</Link>
          <Link to="/messages">الرسائل</Link>
          <Link to="/map">الخريطة</Link>
    
          <Link to="/">الرئيسية</Link>
        </nav>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/items" element={<Items />} />
          <Route path="/upload" element={
             <UploadItem />} />
          <Route path="/profile" element={  <Profile />
          } />
          <Route path="/messages" element={<Messages />} />
          <Route path="/chats" element={<ChatsList />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      

      {/* ===== FOOTER ===== */}
     <footer className="footer">
  <div className="footer-left">
    <div className="footer-logo">RE-LIFE</div>
  </div>
  <div className="footer-center">
    © 2025 ReLife — جميع الحقوق محفوظة
  </div>
  <div className="footer-right">
    <Link to="/donate" className="footer-btn">تبرع الآن</Link>
  </div>
</footer>
    </div>
  </Router>
);

export default App;
