import React from "react";

export default function SearchBar({ searchTerm = '', onSearchChange = () => {}, onSearchSubmit = () => {} }) {
  return (
    <div className="barrabusqueda">
      <input
        type="text"
        placeholder="Buscar experiencias..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSearchSubmit();
          }
        }}
      />
      <button className="btn-secondary" type="button" onClick={onSearchSubmit}>
        Buscar
      </button>
    </div>
  );
}
