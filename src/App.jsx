import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './subcomponents/Navbar';
import Welcome from './pages/Welcome';
import Profile from './pages/Profile';
import Footer from './subcomponents/Footer';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Experiencias from './pages/Experiencias';
import PanelAdmin from './pages/PanelAdmin';
import  Login  from './components/auth/Login';
import { AuthProvider } from './context/AuthContext';
import Register from './components/auth/Register';


import './App.css';
import SearchBar from './subcomponents/SearchBar';
import LuminaPage from './pages/LuminaPage';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
          showRegisterModal={showRegisterModal}
          setShowRegisterModal={setShowRegisterModal}
          showProfileModal={showProfileModal}
          setShowProfileModal={setShowProfileModal}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppRoutes({ searchTerm, setSearchTerm, showLoginModal, setShowLoginModal, showRegisterModal, setShowRegisterModal, showProfileModal, setShowProfileModal }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim()) {
      navigate('/');
    }
  }, [searchTerm, navigate]);

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      navigate('/');
    }
  };

  return (
    <>
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        onLoginClick={() => setShowLoginModal(true)}
        onProfileClick={() => setShowProfileModal(true)}
      />
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
      />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Welcome searchTerm={searchTerm} />} />
          <Route path="/lumina" element={<LuminaPage searchTerm={searchTerm} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/experiencias" element={<Experiencias />} />
          <Route path="/panel-admin" element={<PanelAdmin />} />
        </Routes>
      </main>
      <Footer />

      {showLoginModal && (
        <Login onClose={() => setShowLoginModal(false)} onSwitchToRegister={() => { setShowLoginModal(false); setShowRegisterModal(true); }} />
      )}
      {showRegisterModal && (
        <Register onClose={() => setShowRegisterModal(false)} onSwitchToLogin={() => { setShowRegisterModal(false); setShowLoginModal(true); }} />
      )}
      {showProfileModal && (
        <Profile onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
}

export default App;
