import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Login = ({ onClose = () => {}, onSwitchToRegister = () => {} }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password, username.trim());
      onClose();
    } catch (err) {
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/username-already-in-use'
      ) {
        setError('Credenciales invalidas.');
      } else {
        setError('Error al iniciar sesion.');
      }
      console.error(err);
    } finally {
      setLoading(false);
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
              disabled={loading}
            />
          </div>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type="password"
              placeholder="Contrasena"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar al Sistema'}
          </button>
          {error && <p className="auth-error">{error}</p>}
        </form>
        <button className="auth-link-button" onClick={onSwitchToRegister} disabled={loading}>
          ¿No tienes cuenta? Registrate aqui
        </button>
      </div>
    </div>
  );
};

export default Login;
