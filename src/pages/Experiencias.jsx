import React, { useState } from "react";

const Experiencias = () => {
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [feedback, setFeedback] = useState({ texto: "", tipo: "" });

  const validarMensaje = () => {
    if (!titulo.trim()) {
      setFeedback({
        texto: "Por favor, escribe el título de tu experiencia.",
        tipo: "error",
      });
      return false;
    }

    if (!mensaje.trim()) {
      setFeedback({
        texto: "Por favor, escribe tu experiencia antes de continuar.",
        tipo: "error",
      });
      return false;
    }

    return true;
  };

  const handleGuardarBorrador = () => {
    if (!validarMensaje()) {
      return;
    }

    setFeedback({ texto: "Borrador guardado correctamente.", tipo: "success" });
  };

  const handlePublicar = () => {
    if (!validarMensaje()) {
      return;
    }

    setFeedback({ texto: "Experiencia publicada correctamente.", tipo: "success" });

    setTitulo("");
    setMensaje("");
  };

  const agregarIdea1 = () => {
    setMensaje(`${mensaje}\n\n¿Qué pasó hoy que hizo este momento especial?`.trim());
  };

  const agregarIdea2 = () => {
    setMensaje(`${mensaje}\n\n¿Qué aprendiste de esta experiencia?`.trim());
  };

  const agregarIdea3 = () => {
    setMensaje(`${mensaje}\n\n¿Qué te gustaría recordar de este día en el futuro?`.trim());
  };

  return (
    <section className="section experiencias">
      <header className="experiencias-header">
        <p className="experiencias-chip">Comunidad</p>
        <h2>Experiencias</h2>
        <p className="experiencias-subtitle">
          Un espacio para contar lo que viviste, conectar con otras historias y
          guardar tu proceso con calma.
        </p>
      </header>

      <div className="experiencias-grid">
        <article className="experiencias-card">
          <h3>Comparte</h3>
          <p>Escribe tu momento de forma auténtica y con tus palabras.</p>
        </article>
        <article className="experiencias-card">
          <h3>Conecta</h3>
          <p>Explora ideas y emociones que te ayuden a contar mejor tu historia.</p>
        </article>
        <article className="experiencias-card">
          <h3>Visualiza</h3>
          <p>Organiza tus ideas antes de publicar o guardar borrador.</p>
        </article>
      </div>

      <div className="experiencias-form-wrap">
        <div className="experiencias-tools">
          <p className="experiencias-tools-title">Ideas rápidas para empezar</p>
          <div className="experiencias-ideas">
            <button
              type="button"
              className="experiencias-idea-btn"
              onClick={agregarIdea1}
            >
              ¿Qué pasó hoy que hizo este momento especial?
            </button>
            <button
              type="button"
              className="experiencias-idea-btn"
              onClick={agregarIdea2}
            >
              ¿Qué aprendiste de esta experiencia?
            </button>
            <button
              type="button"
              className="experiencias-idea-btn"
              onClick={agregarIdea3}
            >
              ¿Qué te gustaría recordar de este día en el futuro?
            </button>
          </div>
        </div>

        <label htmlFor="titulo-experiencia">Título de la experiencia</label>
        <input
          id="titulo-experiencia"
          name="titulo-experiencia"
          type="text"
          placeholder="Ejemplo: Mi primer día en la universidad"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          required
        />
        <label htmlFor="mensaje-experiencias">Tu experiencia</label>
        <textarea
          id="mensaje-experiencias"
          name="mensaje-experiencias"
          rows="6"
          placeholder="Escribe aquí tu experiencia..."
          value={mensaje}
          onChange={(event) => setMensaje(event.target.value)}
          required
        ></textarea>
        <div className="experiencias-actions">
          <button
            type="button"
            className="btn-primary experiencias-btn experiencias-btn-publicar"
            onClick={handlePublicar}
          >
            Publicar
          </button>
          <button
            type="button"
            className="btn-secondary experiencias-btn experiencias-btn-borrador"
            onClick={handleGuardarBorrador}
          >
            Guardar borrador
          </button>
        </div>
        {feedback.texto && (
          <p className={`experiencias-feedback ${feedback.tipo}`}>
            {feedback.texto}
          </p>
        )}
      </div>
    </section>
  );
};

export default Experiencias;
