import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
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
        />
        <button className="btn-secondary">Buscar</button>
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
        <button className="btn-primary">Iniciar Sesión</button>
      </div>
    </nav>
  );
}

