import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 


const Login = ({ onClose = () => {}, onSwitchToRegister = () => {} }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, username);
      onClose();
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential' || err.code === 'auth/username-already-in-use') {
        setError('Credenciales inválidas.');
      } else {
        setError('Error al iniciar sesión.');
      }
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay-auth" onClick={onClose}>
      <div className="modal-auth" onClick={(e) => e.stopPropagation()}>
        <button className="modal-auth-close" onClick={onClose}>×</button>
        <h2 className="auth-title">Acceder</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <button className="auth-button" type="submit">Entrar al Sistema</button>
          {error && <p className="auth-error">{error}</p>}
        </form>
        <button className="auth-link-button" onClick={onSwitchToRegister}>
          ¿No tienes cuenta? Regístrate aquí
        </button>
      </div>
    </div>
  );
};

export default Login;
