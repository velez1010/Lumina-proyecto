import React from "react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Register = ({ onClose = () => {}, onSwitchToLogin = () => {} }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Debes ingresar un nombre de usuario.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await register(email, password, username);
      onClose();
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('El correo ya está registrado.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El correo no es válido.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else if (err.code === 'auth/username-already-in-use') {
        setError('El nombre de usuario ya está en uso. Elige otro.');
      } else {
        setError('Error al registrar la cuenta.');
      }
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay-auth" onClick={onClose}>
      <div className="modal-auth" onClick={(e) => e.stopPropagation()}>
        <button className="modal-auth-close" onClick={onClose}>×</button>
        <h2 className="auth-title">Crear Cuenta</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className="auth-button" type="submit">Unirse a Lumina</button>
          {error && <p className="auth-error">{error}</p>}
        </form>
        <button className="auth-link-button" onClick={onSwitchToLogin}>
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </div>
  );
};

export default Register;
