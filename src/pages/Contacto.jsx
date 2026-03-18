import React, { useState } from "react";

export default function Contacto() {
  const [nombreArchivo, setNombreArchivo] = useState("Ningún archivo seleccionado");

  const manejarCambioArchivo = (event) => {
    const archivo = event.target.files?.[0];
    if (archivo) {
      setNombreArchivo(archivo.name);
    } else {
      setNombreArchivo("Ningún archivo seleccionado");
    }
  };

  return (
    <section className="contacto-wrapper">
      <form className="contacto-form" onSubmit={(event) => event.preventDefault()}>
        <h2 className="contacto-title">Contacto</h2>
        <p className="contacto-subtitle">Cuéntanos en que podemos ayudarte y haremos lo mejor por ti.</p>

        <label htmlFor="name">Nombre</label>
        <input type="text" id="name" name="name" placeholder="Tu nombre" required />

        <label htmlFor="email">Correo electrónico</label>
        <input type="email" id="email" name="email" placeholder="tuemail@ejemplo.com" required />

        <label htmlFor="message">Mensaje</label>
        <textarea id="message" name="message" rows="5" placeholder="Escribe aquí tu mensaje..." required></textarea>

        <label htmlFor="imagen">Imagen del problema</label>
        <div className="contacto-file-upload">
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            className="contacto-file-input"
            onChange={manejarCambioArchivo}
          />
          <label htmlFor="imagen" className="contacto-file-button">Elegir imagen</label>
          <span className="contacto-file-name">{nombreArchivo}</span>
        </div>

        <button type="submit" className="btn-primary">Enviar mensaje</button>
      </form>
    </section>
  );
}
