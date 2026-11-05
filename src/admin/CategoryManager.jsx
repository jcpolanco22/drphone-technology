import { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function CategoryManager() {
  const { state, dispatch } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ id: '', name: '', icon: '' });
  
  const categories = state.categories.filter(c => c.id !== 'all');
  
  const handleOpenNew = () => {
    setEditing(null);
    setForm({ id: '', name: '', icon: '📦' });
    setShowModal(true);
  };
  
  const handleEdit = (cat) => {
    setEditing(cat);
    setForm({ id: cat.id, name: cat.name, icon: cat.icon });
    setShowModal(true);
  };
  
  const handleDelete = (id) => {
    if (confirm('¿Eliminar esta categoría?')) {
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const catData = {
      id: form.id || form.name.toLowerCase().replace(/\s+/g, '-'),
      name: form.name,
      icon: form.icon
    };
    
    if (editing) {
      dispatch({ type: 'UPDATE_CATEGORY', payload: catData });
    } else {
      dispatch({ type: 'ADD_CATEGORY', payload: catData });
    }
    setShowModal(false);
  };
  
  // Count products per category
  const productCount = (catId) => state.products.filter(p => p.category === catId).length;
  
  return (
    <>
      <div className="admin-page-header">
        <h2>Gestión de Categorías</h2>
        <p>Organiza los productos de tu tienda por categorías</p>
      </div>
      
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Categorías ({categories.length})</h3>
          <button className="btn btn-primary" onClick={handleOpenNew}>
            + Nueva Categoría
          </button>
        </div>
        
        <table className="admin-table">
          <thead>
            <tr>
              <th>Icono</th>
              <th>Nombre</th>
              <th>ID</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td style={{ fontSize: '1.5rem' }}>{cat.icon}</td>
                <td><strong>{cat.name}</strong></td>
                <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{cat.id}</td>
                <td>
                  <span className="badge badge-new">{productCount(cat.id)}</span>
                </td>
                <td>
                  <div className="actions">
                    <button className="edit-btn" onClick={() => handleEdit(cat)}>✏️</button>
                    <button className="delete-btn" onClick={() => handleDelete(cat.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3>{editing ? '✏️ Editar Categoría' : '🏷️ Nueva Categoría'}</h3>
              <button className="cart-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="admin-form">
                  <div className="form-group">
                    <label>Icono (emoji)</label>
                    <input
                      className="input-field"
                      value={form.icon}
                      onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="📱"
                      style={{ fontSize: '1.5rem', textAlign: 'center' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      className="input-field"
                      required
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Smartphones"
                    />
                  </div>
                  {!editing && (
                    <div className="form-group">
                      <label>ID (slug)</label>
                      <input
                        className="input-field"
                        value={form.id || form.name.toLowerCase().replace(/\s+/g, '-')}
                        onChange={(e) => setForm(prev => ({ ...prev, id: e.target.value }))}
                        placeholder="smartphones"
                        style={{ fontFamily: 'monospace' }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
