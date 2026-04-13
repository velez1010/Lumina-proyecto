import { useState, useEffect } from 'react';
import '../styles/PanelAdmin.css';

export default function PanelAdmin() {
  const [trabajadores, setTrabajadores] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    cargo: '',
    departamento: '',
    rol: 'Operador',
    salario: '',
    fechaContratacion: '',
    estado: 'Activo',
    direccion: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTrabajadores, setFilteredTrabajadores] = useState(trabajadores);

  useEffect(() => {
    const filtered = trabajadores.filter(t =>
      t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.telefono.includes(searchTerm)
    );
    setFilteredTrabajadores(filtered);
  }, [searchTerm, trabajadores]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email) {
      alert('Por favor completa los campos requeridos (Nombre y Email)');
      return;
    }
    const nuevoTrabajador = {
      id: Date.now(),
      ...formData
    };
    setTrabajadores([...trabajadores, nuevoTrabajador]);
    handleLimpiar();
    alert('✅ ¡Trabajador agregado exitosamente!');
  };

  const handleActualizar = (e) => {
    e.preventDefault();
    if (editingId === null) {
      alert('⚠️ Selecciona un trabajador para actualizar');
      return;
    }
    setTrabajadores(trabajadores.map(t =>
      t.id === editingId ? { ...t, ...formData } : t
    ));
    handleLimpiar();
    alert('✅ ¡Trabajador actualizado exitosamente!');
  };

  const handleEliminar = (e) => {
    e.preventDefault();
    if (editingId === null) {
      alert('⚠️ Selecciona un trabajador para eliminar');
      return;
    }
    if (window.confirm('¿Estás seguro de que deseas eliminar este trabajador?')) {
      setTrabajadores(trabajadores.filter(t => t.id !== editingId));
      handleLimpiar();
      alert('✅ ¡Trabajador eliminado exitosamente!');
    }
  };

  const handleLimpiar = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      cargo: '',
      departamento: '',
      rol: 'Operador',
      salario: '',
      fechaContratacion: '',
      estado: 'Activo',
      direccion: '',
    });
    setEditingId(null);
  };

  const handleEditar = (trabajador) => {
    setFormData({
      nombre: trabajador.nombre,
      email: trabajador.email,
      telefono: trabajador.telefono,
      cargo: trabajador.cargo,
      departamento: trabajador.departamento,
      rol: trabajador.rol,
      salario: trabajador.salario,
      fechaContratacion: trabajador.fechaContratacion,
      estado: trabajador.estado,
      direccion: trabajador.direccion,
    });
    setEditingId(trabajador.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = {
    total: trabajadores.length,
    activos: trabajadores.filter(t => t.estado === 'Activo').length,
    inactivos: trabajadores.filter(t => t.estado === 'Inactivo').length,
  };

  return (
    <div className="panel-admin-container">
      <div className="panel-header">
        <h1>👨‍💼 Panel de Administración de Trabajadores</h1>
        <p>Gestión completa de empleados y personal</p>
      </div>

      <div className="panel-stats">
        <div className="stat-box stat-total">
          <h3>{stats.total}</h3>
          <p>Trabajadores totales</p>
        </div>
        <div className="stat-box stat-active">
          <h3>{stats.activos}</h3>
          <p>Trabajadores activos</p>
        </div>
        <div className="stat-box stat-inactive">
          <h3>{stats.inactivos}</h3>
          <p>Trabajadores inactivos</p>
        </div>
      </div>

      <div className="panel-content">
        <div className="panel-form-section">
          <div className="form-header">
            <h2>{editingId ? '✏️ Editar Trabajador' : '➕ Nuevo Trabajador'}</h2>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Nombre Completo *</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej: Juan Pérez García"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="ejemplo@lumina.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="+57-310-000-0000"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Cargo *</label>
                <input
                  type="text"
                  name="cargo"
                  placeholder="Ej: Gerente, Coordinador, Guía"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Departamento *</label>
                <select name="departamento" value={formData.departamento} onChange={handleInputChange} required>
                  <option value="">-- Selecciona departamento --</option>
                  <option>Administración</option>
                  <option>Operaciones</option>
                  <option>Recursos Humanos</option>
                  <option>Ventas</option>
                  <option>Marketing</option>
                  <option>Finanzas</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rol de Sistema</label>
                <select name="rol" value={formData.rol} onChange={handleInputChange}>
                  <option>Admin</option>
                  <option>Gestor</option>
                  <option>Operador</option>
                  <option>Viewer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Salario Mensual (COP)</label>
                <input
                  type="number"
                  name="salario"
                  placeholder="Ej: 2500000"
                  value={formData.salario}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha de Contratación</label>
                <input
                  type="date"
                  name="fechaContratacion"
                  value={formData.fechaContratacion}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select name="estado" value={formData.estado} onChange={handleInputChange}>
                  <option>Activo</option>
                  <option>Inactivo</option>
                  <option>Baja</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                placeholder="Calle, número, ciudad, código postal"
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-primary" onClick={handleGuardar}>Guardar</button>
              <button type="button" className="btn btn-warning" onClick={handleActualizar}>Actualizar</button>
              <button type="button" className="btn btn-danger" onClick={handleEliminar}>Eliminar</button>
              <button type="button" className="btn btn-secondary" onClick={handleLimpiar}>Limpiar</button>
            </div>
          </form>
        </div>

        <div className="panel-table-section">
          <div className="table-header">
            <h2>📋 Listado de Trabajadores</h2>
            <input
              type="text"
              placeholder="🔍 Buscar nombre, email, cargo, departamento..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Cargo</th>
                  <th>Departamento</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrabajadores.length > 0 ? (
                  filteredTrabajadores.map(trabajador => (
                    <tr key={trabajador.id}>
                      <td>#{trabajador.id}</td>
                      <td><strong>{trabajador.nombre}</strong></td>
                      <td>{trabajador.email}</td>
                      <td>{trabajador.cargo}</td>
                      <td>{trabajador.departamento}</td>
                      <td><span className="role-badge">{trabajador.rol}</span></td>
                      <td>
                        <span className={`status-badge ${trabajador.estado === 'Activo' ? 'active' : 'inactive'}`}>
                          {trabajador.estado}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-action btn-edit" 
                            onClick={() => handleEditar(trabajador)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn-action btn-delete" 
                            onClick={() => {
                              setEditingId(trabajador.id);
                              if (window.confirm('¿Deseas eliminar este trabajador?')) {
                                setTrabajadores(trabajadores.filter(t => t.id !== trabajador.id));
                                handleLimpiar();
                                alert('✅ ¡Trabajador eliminado exitosamente!');
                              }
                            }}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="empty-message">
                      No hay trabajadores que coincidan con la búsqueda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
