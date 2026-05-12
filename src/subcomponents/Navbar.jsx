import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({
  searchTerm = '',
  onSearchChange = () => {},
  onSearchSubmit = () => {},
  onLoginClick = () => {},
  onProfileClick = () => {}
}) {
  const { currentUser } = useAuth();
  const displayName = currentUser?.username || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Usuario';
  const displayInitial = displayName.trim()[0]?.toUpperCase() || 'U';

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/">
          <img src="/images/lumina.png" alt="Lumina logo" className="logo" />
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
            <button className="user-profile-trigger" onClick={onProfileClick} type="button" aria-label="Abrir perfil">
              <span className="user-profile-glow"></span>
              <span className="user-avatar-shell">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" className="profile-pic-small" />
                ) : (
                  <span className="profile-pic-placeholder">{displayInitial}</span>
                )}
              </span>
              <span className="user-profile-copy">
                <span>Perfil</span>
                <strong>{displayName}</strong>
              </span>
              <span className="user-profile-chevron">&gt;</span>
            </button>
          </div>
        ) : (
          <button className="btn-primary" onClick={onLoginClick}>Iniciar Sesion</button>
        )}
      </div>
    </nav>
  );
}
