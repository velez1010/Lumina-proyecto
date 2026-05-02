import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Navbar({ searchTerm = '', onSearchChange = () => {}, onSearchSubmit = () => {}, onLoginClick = () => {}, onRegisterClick = () => {} }) {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/">
        <img src="/images/lumina.png" alt="Lúmina logo" className="logo" />
        <div className="brand"></div>
        </Link>
      </div>

      <div className="barrabusqueda">
        <input
          type="text"
          placeholder="Buscar experiencias..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button className="btn-secondary" type="button" onClick={onSearchSubmit}>
          Buscar
        </button>
      </div>

        <div className="nav-actions">
        <Link to="/experiencias">
          <button className="btn-primary">Experiencias</button>
        </Link>
      </div>

      <div className="nav-actions">
        <Link to="/nosotros">
          <button className="btn-primary">Nosotros</button>
        </Link>
      </div>

      <div className="nav-actions">
        <Link to="/">
          <button className="btn-primary">Home</button>
        </Link>
      </div>

      <div className="nav-actions">
        <Link to="/contacto">
          <button className="btn-primary">Contacto</button>
        </Link>
      </div>

      <div className="nav-actions">
        <Link to="/panel-admin">
          <button className="btn-primary">Panel Admin</button>
        </Link>
      </div>

      <div className="nav-actions">
        {currentUser ? (
          <div className="user-menu">
            <button className="btn-primary user-btn">
              {currentUser.username || currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario'}
            </button>
            <button className="btn-secondary logout-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <button className="btn-primary" onClick={onLoginClick}>Iniciar Sesión</button>
        )}
      </div>
    </nav>
  );
}

