import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/currency';
import ProductModal from './ProductModal';

export default function Dashboard() {
  const { state, dispatch } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState('');
  
  const totalProducts = state.products.length;
  const totalCategories = state.categories.filter(c => c.id !== 'all').length;
  const avgPrice = state.products.length 
    ? state.products.reduce((s, p) => s + p.price, 0) / state.products.length
    : 0;
  const totalInventoryValue = state.products.reduce((s, p) => s + p.price, 0);
  
  const stats = [
    { icon: '📦', label: 'Total Productos', value: totalProducts, bg: 'rgba(56, 189, 248, 0.15)' },
    { icon: '🏷️', label: 'Categorías', value: totalCategories, bg: 'rgba(129, 140, 248, 0.15)' },
    { icon: '💰', label: 'Precio Promedio', value: formatPrice(avgPrice), bg: 'rgba(16, 185, 129, 0.15)' },
    { icon: '📊', label: 'Valor Inventario', value: formatPrice(totalInventoryValue), bg: 'rgba(251, 191, 36, 0.15)' },
  ];
  
  const recentProducts = [...state.products].reverse().slice(0, 5);
  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };
  
  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
      showToast('🗑️ Producto eliminado correctly');
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };
  
  return (
    <>
      <div className="admin-page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Resumen general de tu tienda</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingProduct(null); setShowModal(true); }}>
          + Nuevo Producto
        </button>
      </div>
      
      <div className="dashboard-stats">
        {stats.map((stat, i) => (
          <div className="dashboard-stat-card" key={i}>
            <div className="dashboard-stat-icon" style={{ background: stat.bg }}>
              {stat.icon}
            </div>
            <div className="dashboard-stat-info">
              <h4>{stat.value}</h4>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Productos Recientes</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.map(product => (
              <tr key={product.id}>
                <td>
                  <div className="product-thumb">
                    <img src={(product.images && product.images[0]) || product.image || 'https://via.placeholder.com/50'} alt={product.name} />
                  </div>
                </td>
                <td><strong>{product.name}</strong></td>
                <td>{product.brand}</td>
                <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                <td style={{ color: 'var(--color-accent-primary)', fontWeight: 700 }}>
                  {formatPrice(product.price)}
                </td>
                <td>
                  <div className="actions">
                    <button className="edit-btn" onClick={() => handleEdit(product)} title="Editar">✏️</button>
                    <button className="delete-btn" onClick={() => handleDelete(product.id)} title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal 
        isOpen={showModal} 
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }} 
        editingProduct={editingProduct} 
      />

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
