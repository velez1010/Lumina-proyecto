import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LuminaPage({ searchTerm = '' }) {
  const { currentUser } = useAuth()
  const [experiencias, setExperiencias] = useState([])
  const [selectedExperience, setSelectedExperience] = useState(null)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('lumina_experiencias') || '[]')
      const normalized = Array.isArray(stored)
        ? stored.map((item) => ({
            ...item,
            likes: Array.isArray(item.likes) ? item.likes : [],
            dislikes: Array.isArray(item.dislikes) ? item.dislikes : [],
            comments: Array.isArray(item.comments) ? item.comments : [],
          }))
        : []
      setExperiencias(normalized)
    } catch {
      setExperiencias([])
    }
  }, [])

  const saveExperiencias = (list) => {
    setExperiencias(list)
    localStorage.setItem('lumina_experiencias', JSON.stringify(list))
  }

  const filteredExperiencias = experiencias.filter((item) => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.trim().toLowerCase()
    return (
      item.titulo.toLowerCase().includes(term) ||
      item.mensaje.toLowerCase().includes(term)
    )
  })

  const openExperience = (item) => {
    setSelectedExperience(item)
    setCommentText('')
  }

  const closeModal = () => {
    setSelectedExperience(null)
    setCommentText('')
  }

  const currentUserId = currentUser?.email || currentUser?.uid || null

  const handleVote = (item, voteType) => {
    if (!currentUserId) return

    const updated = experiencias.map((exp) => {
      if (exp.id !== item.id) return exp

      const likes = new Set(exp.likes || [])
      const dislikes = new Set(exp.dislikes || [])
      const hasLiked = likes.has(currentUserId)
      const hasDisliked = dislikes.has(currentUserId)

      if (voteType === 'like') {
        dislikes.delete(currentUserId)
        if (hasLiked) likes.delete(currentUserId)
        else likes.add(currentUserId)
      } else {
        likes.delete(currentUserId)
        if (hasDisliked) dislikes.delete(currentUserId)
        else dislikes.add(currentUserId)
      }

      return {
        ...exp,
        likes: Array.from(likes),
        dislikes: Array.from(dislikes),
      }
    })

    saveExperiencias(updated)
    setSelectedExperience(updated.find((exp) => exp.id === item.id) || null)
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!selectedExperience) return
    if (!commentText.trim()) return

    const comment = {
      id: Date.now(),
      author: currentUser?.email || 'Anónimo',
      texto: commentText.trim(),
      fecha: new Date().toISOString(),
    }

    const updated = experiencias.map((exp) => {
      if (exp.id !== selectedExperience.id) return exp
      return {
        ...exp,
        comments: [comment, ...(exp.comments || [])],
      }
    })

    saveExperiencias(updated)
    setCommentText('')
    setSelectedExperience(updated.find((exp) => exp.id === selectedExperience.id) || null)
  }

  return (
    <>
      <section className="lema section">
        <h2>El historial emocional de la humanidad</h2>
        <p className="lema-text">
          No guardamos fotos. Guardamos cómo se sentía vivir ese momento.
        </p>
      </section>

      <section className="experiencias-inicio section">
        <div className="experiencias-inicio-header">
          <div>
            <h2>Experiencias publicadas</h2>
            <p className="experiencias-subtitle-small">
              Navega experiencias reales, abre una para verla mejor y comparte tus impresiones.
            </p>
          </div>
          <span className="experiencias-badge">
            {currentUser ? `Conectado como ${currentUser.email}` : 'Puedes comentar como anónimo. Inicia sesión para votar'}
          </span>
        </div>

        {filteredExperiencias.length === 0 ? (
          <p className="experiencias-empty">
            No encontramos experiencias con esa búsqueda.
          </p>
        ) : (
          <div className="experiencias-lista">
            {filteredExperiencias.slice(0, 6).map((item) => {
              const active = selectedExperience?.id === item.id
              return (
                <article
                  key={item.id}
                  className={`experiencia-card ${active ? 'selected' : ''}`}
                  onClick={() => openExperience(item)}
                >
                  <div className="experiencia-card-header">
                    <h3>{item.titulo}</h3>
                    <span className="experiencia-card-date">
                      {new Date(item.fechaPublicacion).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{item.mensaje.slice(0, 140)}{item.mensaje.length > 140 ? '…' : ''}</p>
                  <div className="experiencia-card-footer">
                    <span>👍 {item.likes?.length || 0}</span>
                    <span>👎 {item.dislikes?.length || 0}</span>
                    <span>{item.comments?.length || 0} comentarios</span>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {selectedExperience && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-top">
              <div>
                <h3>{selectedExperience.titulo}</h3>
                <p className="modal-date">
                  Publicado el {new Date(selectedExperience.fechaPublicacion).toLocaleDateString()}
                </p>
              </div>
              <div className="modal-votes">
                <button
                  type="button"
                  className={`vote-btn like ${currentUserId && selectedExperience.likes?.includes(currentUserId) ? 'active' : ''}`}
                  onClick={() => handleVote(selectedExperience, 'like')}
                >
                  👍 {selectedExperience.likes?.length || 0}
                </button>
                <button
                  type="button"
                  className={`vote-btn dislike ${currentUserId && selectedExperience.dislikes?.includes(currentUserId) ? 'active' : ''}`}
                  onClick={() => handleVote(selectedExperience, 'dislike')}
                >
                  👎 {selectedExperience.dislikes?.length || 0}
                </button>
              </div>
            </div>

            <div className="modal-body">
              <p>{selectedExperience.mensaje}</p>
            </div>

            <section className="modal-comments-section">
              <h4>Comentarios</h4>
              {selectedExperience.comments?.length > 0 ? (
                <div className="modal-comments-list">
                  {selectedExperience.comments.map((comment) => (
                    <div key={comment.id} className="modal-comment">
                      <div className="modal-comment-header">
                        <strong>{comment.author}</strong>
                        <span>{new Date(comment.fecha).toLocaleString()}</span>
                      </div>
                      <p>{comment.texto}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="comments-empty">Sé el primero en comentar esta experiencia.</p>
              )}

              <form className="modal-comment-form" onSubmit={handleCommentSubmit}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escribe tu comentario..."
                  rows={4}
                />
                <button type="submit" className="btn-primary comment-submit">
                  Comentar
                </button>
              </form>
              {!currentUserId && (
                <p className="comments-login-note">
                  Estás comentando como anónimo. Inicia sesión para dar like o dislike.
                </p>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  )
}
      