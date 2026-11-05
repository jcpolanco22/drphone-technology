import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/currency';

export default function ProductDetails({ product, isOpen, onClose }) {
  const { state, dispatch } = useStore();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  
  // Reset state when product changes or modal opens
  useEffect(() => {
    if (product) {
      setSelectedColorIndex(0);
      setSelectedImageIndex(0);
      setSelectedStorage(product.storageOptions ? product.storageOptions[0] : '');
      setQuantity(1);
      setAddedToast(false);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  // Determine active colors and gallery images
  const hasColors = product.colors && product.colors.length > 0;
  const activeColor = hasColors ? product.colors[selectedColorIndex] : null;

  // Active gallery images: from active color if available, else from product.images
  const activeImages = (activeColor && activeColor.images && activeColor.images.length > 0)
    ? activeColor.images
    : (product.images && product.images.length > 0 ? product.images : [product.image || '']);

  // Ensure minimum 3 images displayed: if fewer, fallback gracefully
  const displayImages = activeImages.length >= 3 
    ? activeImages 
    : [...activeImages, ...activeImages, ...activeImages].slice(0, 3);

  const currentMainImage = displayImages[selectedImageIndex] || displayImages[0];

  const handleColorChange = (index) => {
    setSelectedColorIndex(index);
    setSelectedImageIndex(0); // Reset to first view of new color
  };

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      selectedColor: activeColor ? activeColor.name : null,
      selectedColorHex: activeColor ? activeColor.hex : null,
      selectedStorage: selectedStorage || null,
      image: currentMainImage,
      quantity: quantity
    };

    dispatch({ type: 'ADD_TO_CART', payload: itemToAdd });
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 1200);
  };

  const handleWhatsAppDirect = () => {
    const colorTxt = activeColor ? `\n• *Color:* ${activeColor.name}` : '';
    const storageTxt = selectedStorage ? `\n• *Capacidad:* ${selectedStorage}` : '';
    const priceTxt = formatPrice(product.price * quantity);
    const msg = `¡Hola DrPhone Technology! 👋\nMe interesa comprar:\n\n📱 *${product.name}* (x${quantity})${colorTxt}${storageTxt}\n💰 *Precio Total:* ${priceTxt}\n\n¿Tienen disponibilidad para entrega en Santo Domingo / República Dominicana?`;
    
    const whatsappNum = state.settings.whatsapp || '18094226985';
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating || 5);
    const half = (rating || 5) % 1 >= 0.5 ? 1 : 0;
    const empty = Math.max(0, 5 - full - half);
    return (
      <span className="stars">
        {'★'.repeat(full)}
        {half ? '★' : ''}
        {'☆'.repeat(empty)}
      </span>
    );
  };

  const imageAngleLabels = ['Vista Trasera', 'Pantalla Frontal', 'Ángulo 3D / Perfil', 'Detalle'];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="product-details-modal enhanced-details-modal" onClick={e => e.stopPropagation()}>
        <button className="cart-close details-close" onClick={onClose} title="Cerrar">✕</button>
        
        <div className="details-container">
          {/* Gallery Section */}
          <div className="details-gallery">
            <div className="gallery-badge-row">
              <span className="gallery-photo-counter">
                📸 {selectedImageIndex + 1} de {displayImages.length} fotos
              </span>
              {activeColor && (
                <span className="gallery-color-tag">
                  <span className="color-indicator-dot" style={{ backgroundColor: activeColor.hex }}></span>
                  {activeColor.name}
                </span>
              )}
            </div>

            <div className="main-image-container">
              <img 
                src={currentMainImage} 
                alt={`${product.name} - ${activeColor?.name || ''}`} 
                className="main-image animated-main-image"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&fit=crop';
                }}
              />
            </div>

            {/* Minimum 3 thumbnails per item / per color */}
            <div className="thumbnails-container">
              {displayImages.map((img, idx) => (
                <button 
                  key={idx} 
                  type="button"
                  className={`thumbnail ${selectedImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(idx)}
                  title={imageAngleLabels[idx] || `Foto ${idx + 1}`}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} />
                  <span className="thumbnail-label">{imageAngleLabels[idx] || `Vista ${idx + 1}`}</span>
                </button>
              ))}
            </div>
            
            <p className="gallery-hint">
              💡 Cambia de color abajo para ver sus 3 fotos correspondientes.
            </p>
          </div>
          
          {/* Info Section */}
          <div className="details-info">
            <div className="details-brand-pill">{product.brand} • ORIGINAL CON GARANTÍA</div>
            <h2 className="details-title">{product.name}</h2>
            
            <div className="details-meta">
              <div className="product-card-rating">
                {renderStars(product.rating)}
                <span className="rating-count">({product.reviews || 120} opiniones verificadas)</span>
              </div>
              <span className="stock-tag">🟢 Disponible en República Dominicana</span>
            </div>
            
            {/* Price Box */}
            <div className="details-price-box">
              <div className="details-price-row">
                <span className="details-price">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="price-original details-price-original">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <span className="discount-pill">
                  Ahorras {formatPrice(product.originalPrice - product.price)}
                </span>
              )}
            </div>

            {/* COLOR SELECTOR (Updates the 3 images instantly!) */}
            {hasColors && (
              <div className="option-section">
                <div className="option-header">
                  <span className="option-label">Color Seleccionado:</span>
                  <strong className="option-value">{activeColor.name}</strong>
                </div>
                <div className="color-swatches-grid">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`color-swatch-btn ${selectedColorIndex === idx ? 'selected' : ''}`}
                      onClick={() => handleColorChange(idx)}
                      title={`Seleccionar color ${color.name}`}
                    >
                      <span className="color-circle" style={{ backgroundColor: color.hex }}></span>
                      <span className="color-swatch-name">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STORAGE CAPACITY SELECTOR */}
            {product.storageOptions && product.storageOptions.length > 0 && (
              <div className="option-section">
                <div className="option-header">
                  <span className="option-label">Capacidad de Almacenamiento:</span>
                  <strong className="option-value">{selectedStorage}</strong>
                </div>
                <div className="storage-options-grid">
                  {product.storageOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`storage-btn ${selectedStorage === opt ? 'selected' : ''}`}
                      onClick={() => setSelectedStorage(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Description */}
            <div className="details-description">
              <h4>Descripción Oficial</h4>
              <p>{product.description}</p>
            </div>
            
            {/* Actions */}
            <div className="details-actions">
              <div className="quantity-selector">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button 
                className="btn btn-primary btn-lg" 
                style={{ flex: 1 }} 
                onClick={handleAddToCart}
                disabled={addedToast}
              >
                {addedToast ? '✅ ¡Añadido al Carrito!' : `🛒 Añadir — ${formatPrice(product.price * quantity)}`}
              </button>
            </div>

            {/* Direct WhatsApp Ordering */}
            <button 
              type="button" 
              className="btn btn-whatsapp-direct"
              onClick={handleWhatsAppDirect}
            >
              <span>💬</span> Comprar Directo por WhatsApp
            </button>
            
            {/* Features & Dominican Republic Guarantees */}
            <div className="details-features">
              <div className="feature-item">
                <span className="feature-icon">🛡️</span>
                <div>
                  <strong>Garantía Real en RD</strong>
                  <p>30 días de reemplazo y 1 año de garantía oficial</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <div>
                  <strong>Entrega a Nivel Nacional</strong>
                  <p>Santo Domingo en el mismo día, provincias vía Caribe Tours / Metro</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💵</span>
                <div>
                  <strong>Pago Fácil y Seguro</strong>
                  <p>Transferencia Banco Popular, BHD, Banreservas o Contra Entrega</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
