import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const emptyProduct = {
  name: '',
  brand: '',
  category: 'smartphones',
  price: '',
  originalPrice: '',
  badge: '',
  rating: 4.5,
  reviews: 0,
  images: [],
  description: ''
};

export default function ProductModal({ isOpen, onClose, editingProduct = null }) {
  const { state, dispatch } = useStore();
  const [form, setForm] = useState(emptyProduct);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name || '',
        brand: editingProduct.brand || '',
        category: editingProduct.category || 'smartphones',
        price: editingProduct.price || '',
        originalPrice: editingProduct.originalPrice || '',
        badge: editingProduct.badge || '',
        rating: editingProduct.rating || 4.5,
        reviews: editingProduct.reviews || 0,
        images: editingProduct.images || (editingProduct.image ? [editingProduct.image] : []),
        description: editingProduct.description || ''
      });
    } else {
      setForm(emptyProduct);
    }
    setNewImageUrl('');
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ 
          ...prev, 
          images: [...prev.images, reader.result] 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Robust parsing preserving existing colors & storageOptions
    const productData = {
      ...(editingProduct || {}),
      ...form,
      price: parseFloat(form.price) || 0,
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      rating: parseFloat(form.rating) || 0,
      reviews: parseInt(form.reviews) || 0,
      badge: form.badge || null,
      colors: editingProduct?.colors || (form.colors || []),
      storageOptions: editingProduct?.storageOptions || (form.storageOptions || [])
    };
    
    if (editingProduct && editingProduct.id) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: { ...productData, id: editingProduct.id } });
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: productData });
    }
    
    onClose();
  };

  const displayCategories = state.categories.filter(c => c.id !== 'all');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingProduct ? '✏️ Editar Producto' : '📦 Nuevo Producto'}</h3>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="admin-form">
              {/* Multi-Image Gallery */}
              <div className="form-group">
                <label>Imágenes del Producto</label>
                <div className="admin-image-manager">
                  <div className="admin-image-list">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="admin-image-item">
                        <img src={img} alt={`Img ${idx}`} />
                        <button type="button" className="remove-img-btn" onClick={() => removeImage(idx)}>✕</button>
                      </div>
                    ))}
                    <label className="admin-image-add">
                      <span className="add-icon">+</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
                
                <div className="form-row" style={{ marginTop: '1rem' }}>
                  <input
                    className="input-field"
                    placeholder="Pegar URL de imagen..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="btn btn-outline" onClick={addImageUrl}>Añadir URL</button>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre</label>
                  <input className="input-field" required value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="iPhone 15 Pro Max" />
                </div>
                <div className="form-group">
                  <label>Marca</label>
                  <input className="input-field" required value={form.brand} onChange={(e) => handleChange('brand', e.target.value)} placeholder="Apple" />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Categoría</label>
                  <select className="input-field" value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
                    {displayCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Badge</label>
                  <select className="input-field" value={form.badge} onChange={(e) => handleChange('badge', e.target.value)}>
                    <option value="">Sin badge</option>
                    <option value="bestseller">🔥 Más Vendido</option>
                    <option value="premium">⭐ Premium</option>
                    <option value="new">🆕 Nuevo</option>
                    <option value="pro">💎 Pro</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Precio ($)</label>
                  <input className="input-field" type="number" step="0.01" required value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Precio Original ($)</label>
                  <input className="input-field" type="number" step="0.01" value={form.originalPrice} onChange={(e) => handleChange('originalPrice', e.target.value)} placeholder="0.00 (opcional)" />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Rating (0-5)</label>
                  <input className="input-field" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => handleChange('rating', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Reviews</label>
                  <input className="input-field" type="number" value={form.reviews} onChange={(e) => handleChange('reviews', e.target.value)} placeholder="0" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Descripción</label>
                <textarea className="input-field" rows="4" value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Descripción detallada del producto..." style={{ resize: 'vertical' }}></textarea>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              {editingProduct ? '💾 Guardar Cambios' : '📦 Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
