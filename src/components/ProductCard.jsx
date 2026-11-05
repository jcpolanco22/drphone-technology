import { useState } from 'react';
import { formatPrice } from '../utils/currency';

export default function ProductCard({ product, onAddToCart, onShowDetails }) {
  const [activeColorIdx, setActiveColorIdx] = useState(0);

  const hasColors = product.colors && product.colors.length > 0;
  const activeColor = hasColors ? product.colors[activeColorIdx] : null;

  // Determine current image to display on card
  const currentImage = (activeColor && activeColor.images && activeColor.images[0])
    ? activeColor.images[0]
    : (product.images && product.images[0]) || product.image || '';

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  
  const badgeLabels = {
    bestseller: { text: '🔥 Más Vendido', cls: 'badge-bestseller' },
    premium: { text: '⭐ Premium', cls: 'badge-premium' },
    new: { text: '🆕 Nuevo Modelo', cls: 'badge-new' },
    pro: { text: '💎 Edición Pro', cls: 'badge-pro' }
  };
  
  const badgeInfo = product.badge ? badgeLabels[product.badge] : null;
  
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
  
  return (
    <div className="product-card" id={`product-${product.id}`} onClick={() => onShowDetails(product)}>
      <div className="product-card-image">
        <div className="product-card-badges">
          {badgeInfo && (
            <span className={`badge ${badgeInfo.cls}`}>
              {badgeInfo.text}
            </span>
          )}
          {discount > 0 && (
            <span className="badge badge-discount">-{discount}% OFF</span>
          )}
        </div>
        
        <img
          src={currentImage}
          alt={product.name}
          loading="lazy"
          className="product-card-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&fit=crop';
          }}
        />

        {/* Floating Quick Feature Tag */}
        <div className="photo-count-pill">
          <span>📸 3+ Fotos</span>
          {hasColors && <span>• {product.colors.length} Colores</span>}
        </div>
      </div>

      <div className="product-card-body">
        <div className="product-card-brand">{product.brand}</div>
        <h3 className="product-card-name">{product.name}</h3>
        
        {/* Color Dots Quick Selector */}
        {hasColors && (
          <div className="card-color-dots" onClick={e => e.stopPropagation()}>
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                type="button"
                className={`card-color-dot ${activeColorIdx === idx ? 'active' : ''}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setActiveColorIdx(idx)}
                title={color.name}
              />
            ))}
            <span className="card-color-name">{activeColor?.name}</span>
          </div>
        )}

        <div className="product-card-rating">
          {renderStars(product.rating)}
          <span className="rating-count">({product.reviews || 95})</span>
        </div>

        <div className="product-card-footer">
          <div className="product-price">
            <span className="price-current">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          
          <button 
            type="button"
            className="add-to-cart-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart({
                ...product,
                selectedColor: activeColor?.name || null,
                image: currentImage
              });
            }} 
            title="Añadir al carrito"
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  );
}
