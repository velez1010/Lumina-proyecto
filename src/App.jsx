import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './subcomponents/Navbar';
import Welcome from './pages/Welcome';
import Profile from './pages/Profile';
import Footer from './subcomponents/Footer';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Experiencias from './pages/Experiencias';


import './App.css';
import SearchBar from './subcomponents/SearchBar';
import LuminaPage from './pages/LuminaPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <SearchBar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/lumina" element={<LuminaPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/experiencias" element={<Experiencias />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
