import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

const MAX_PROFILE_PHOTO_SIZE = 20 * 1024 * 1024;
const PROFILE_PHOTO_ACCEPT = [
  'image/*',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.bmp',
  '.avif',
  '.jfif',
  '.pjpeg',
  '.pjp'
].join(',');
const IMAGE_FILE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'avif', 'jfif', 'pjpeg', 'pjp'];

const buildFormData = (user) => ({
  username: user?.username || '',
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  email: user?.email || '',
  phone: user?.phone || '',
  bio: user?.bio || ''
});

const isValidImageFile = (file) => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  return file.type.startsWith('image/') || IMAGE_FILE_EXTENSIONS.includes(extension);
};

const Profile = ({ onClose }) => {
  const { currentUser, saveUserProfile, logout } = useAuth();
  const photoInputId = useId();
  const photoInputRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(() => buildFormData(currentUser));
  const [photoFile, setPhotoFile] = useState(null);
  const [photoProgress, setPhotoProgress] = useState(0);
  const [saveFeedback, setSaveFeedback] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setFormData(buildFormData(currentUser));
  }, [currentUser]);

  const photoPreviewUrl = useMemo(() => {
    if (!photoFile) return '';
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  if (!currentUser) {
    return null;
  }

  const displayName = [
    currentUser?.firstName,
    currentUser?.lastName
  ].filter(Boolean).join(' ') || currentUser?.username || currentUser?.email?.split('@')[0] || 'Usuario';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

  const profileImage = photoPreviewUrl || currentUser?.photoURL || '';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaveFeedback({ type: '', message: '' });

    if (!isValidImageFile(file)) {
      setPhotoFile(null);
      e.target.value = '';
      setSaveFeedback({ type: 'error', message: 'Selecciona una foto valida: JPG, PNG, WEBP, GIF, BMP o AVIF.' });
      return;
    }

    if (file.size > MAX_PROFILE_PHOTO_SIZE) {
      setPhotoFile(null);
      e.target.value = '';
      setSaveFeedback({ type: 'error', message: 'La imagen debe pesar menos de 20 MB.' });
      return;
    }

    setPhotoProgress(0);
    setPhotoFile(file);
    setSaveFeedback({ type: 'success', message: 'Foto lista. Veras el cambio al guardar.' });
    setEditing(true);
  };

  const handleSave = async () => {
    if (saving) return;

    setSaving(true);
    setPhotoProgress(0);
    setSaveFeedback({
      type: 'info',
      message: photoFile ? 'Preparando foto de perfil...' : 'Guardando cambios...'
    });

    try {
      await saveUserProfile(
        {
          ...formData,
          username: formData.username.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          bio: formData.bio.trim()
        },
        photoFile,
        (progress) => {
          setPhotoProgress(progress);
          setSaveFeedback({ type: 'info', message: `Preparando foto de perfil... ${progress}%` });
        }
      );

      setPhotoFile(null);
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
      setEditing(false);
      setSaveFeedback({ type: 'success', message: 'Perfil actualizado correctamente.' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveFeedback({
        type: 'error',
        message: error.message || 'Error al guardar el perfil.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(buildFormData(currentUser));
    setPhotoFile(null);
    setPhotoProgress(0);
    setSaveFeedback({ type: '', message: '' });
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
    setEditing(false);
  };

  const handleClose = () => {
    if (!saving && !loggingOut && onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    if (saving || loggingOut) return;

    setLoggingOut(true);
    setSaveFeedback({ type: 'info', message: 'Cerrando sesion...' });

    try {
      await logout();
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error al cerrar sesion:', error);
      setSaveFeedback({ type: 'error', message: 'No se pudo cerrar sesion. Intentalo de nuevo.' });
      setLoggingOut(false);
    }
  };

  const profilePanel = (
    <section className="profile-admin-panel">
      <header className="profile-admin-header">
        <div>
          <span className="profile-admin-kicker">Panel de usuario</span>
          <h2>Perfil de Usuario</h2>
          <p>Administra tu informacion personal y la imagen que aparece en Lumina.</p>
        </div>
        <span className={`profile-admin-status ${editing || saving ? 'editing' : ''}`}>
          {saving ? 'Guardando' : editing ? 'Editando' : 'Activo'}
        </span>
      </header>

      <div className="profile-admin-grid">
        <aside className="profile-summary-card">
          <div className="profile-photo-section">
            <div className="profile-photo-frame">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={`Foto de ${displayName}`}
                  className="profile-photo-large"
                />
              ) : (
                <div className="profile-photo-placeholder">{initials}</div>
              )}
            </div>

            <label className="profile-photo-button" htmlFor={photoInputId}>
              Cambiar foto
            </label>
            <input
              id={photoInputId}
              ref={photoInputRef}
              type="file"
              accept={PROFILE_PHOTO_ACCEPT}
              onChange={handlePhotoChange}
              className="photo-input"
              disabled={saving}
            />
            {photoFile && (
              <span className="profile-photo-file">
                {photoProgress > 0 ? `${photoProgress}% - ` : ''}{photoFile.name}
              </span>
            )}
          </div>

          <div className="profile-summary-info">
            <h3>{displayName}</h3>
            <p>{currentUser.email}</p>
          </div>

          <div className="profile-summary-list">
            <div>
              <span>Usuario</span>
              <strong>{currentUser.username || 'Sin usuario'}</strong>
            </div>
            <div>
              <span>Telefono</span>
              <strong>{currentUser.phone || 'No especificado'}</strong>
            </div>
            <div>
              <span>Cuenta</span>
              <strong>Verificada</strong>
            </div>
          </div>

          <button
            className="profile-logout-btn"
            type="button"
            onClick={handleLogout}
            disabled={saving || loggingOut}
          >
            {loggingOut ? 'Cerrando sesion...' : 'Cerrar sesion'}
          </button>
        </aside>

        <div className="profile-form-card">
          <div className="profile-form-header">
            <div>
              <h3>Datos personales</h3>
              <p>{editing ? 'Actualiza los campos que quieras modificar.' : 'Vista general de tu informacion de cuenta.'}</p>
            </div>
            {!editing && (
              <button className="btn-primary profile-edit-btn" onClick={() => setEditing(true)}>
                Editar perfil
              </button>
            )}
          </div>

          <div className="profile-fields">
            <div className="profile-field">
              <label>Nombre de usuario</label>
              {editing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="auth-input"
                  disabled={saving}
                />
              ) : (
                <p>{currentUser.username || 'No especificado'}</p>
              )}
            </div>

            <div className="profile-field">
              <label>Nombre</label>
              {editing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="auth-input"
                  disabled={saving}
                />
              ) : (
                <p>{currentUser.firstName || 'No especificado'}</p>
              )}
            </div>

            <div className="profile-field">
              <label>Apellido</label>
              {editing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="auth-input"
                  disabled={saving}
                />
              ) : (
                <p>{currentUser.lastName || 'No especificado'}</p>
              )}
            </div>

            <div className="profile-field">
              <label>Email</label>
              <p>{currentUser.email}</p>
            </div>

            <div className="profile-field">
              <label>Telefono</label>
              {editing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="auth-input"
                  disabled={saving}
                />
              ) : (
                <p>{currentUser.phone || 'No especificado'}</p>
              )}
            </div>

            <div className="profile-field profile-field-wide">
              <label>Biografia</label>
              {editing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="auth-input bio-input"
                  rows="4"
                  disabled={saving}
                />
              ) : (
                <p>{currentUser.bio || 'No especificado'}</p>
              )}
            </div>
          </div>

          <div className="profile-actions">
            {editing ? (
              <>
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                  {saving && photoFile ? `Guardando ${photoProgress}%` : saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button className="btn-secondary" onClick={handleCancel} disabled={saving}>
                  Cancelar
                </button>
              </>
            ) : (
              <button className="btn-secondary profile-photo-hint" onClick={() => setEditing(true)}>
                Gestionar informacion
              </button>
            )}
          </div>

          {saveFeedback.message && (
            <p className={`profile-save-feedback ${saveFeedback.type}`}>
              {saveFeedback.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );

  if (!onClose) {
    return profilePanel;
  }

  return (
    <div className="modal-overlay-auth profile-modal-overlay" onClick={handleClose}>
      <div className="modal-auth profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-auth-close profile-modal-close" onClick={handleClose} disabled={saving || loggingOut}>&times;</button>
        {profilePanel}
      </div>
    </div>
  );
};

export default Profile;
