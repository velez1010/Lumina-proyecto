import React from 'react'
import LuminaPage from './LuminaPage';

export default function Welcome() {
  return (
    <>
      <section className="hero">
        <h1>Bienvenido a Lúmina</h1>
        <p className="hero-subtitle">
          Preserva tus recuerdos y revive tus experiencias.
        </p>
      </section>
      <LuminaPage />
    </>
  )
}
