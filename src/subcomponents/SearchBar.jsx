import React from "react";

export default function SearchBar() {
  return (
    <div className="barrabusqueda">
      <input
        type="text"
        placeholder="Buscar experiencias..."
        className="search-input"
      />
      <button className="btn-secondary">Buscar</button>
    </div>
  );
}
