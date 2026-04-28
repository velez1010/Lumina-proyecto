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

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppRoutes({ searchTerm, setSearchTerm }) {
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
