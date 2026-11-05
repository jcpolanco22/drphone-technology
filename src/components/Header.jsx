import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Header({ onCartOpen }) {
  const { state } = useStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = state;
  
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <header className="header" id="header">
      <div className="container header-inner">
        <Link to="/" className="header-logo">
          <div className="header-logo-icon">📱</div>
          <div className="header-logo-text">
            <h1>{settings.storeName}</h1>
            <span>{settings.storeTagline}</span>
          </div>
        </Link>
        
        <nav className="header-nav" style={mobileMenuOpen ? {
          display: 'flex',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.98)',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          gap: '2rem',
          fontSize: '1.2rem'
        } : {}}>
          {mobileMenuOpen && (
            <button 
              onClick={() => setMobileMenuOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '1.5rem', color: 'var(--color-text-primary)' }}
            >✕</button>
          )}
          <a href="#hero" className={isActive('/') ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Inicio</a>
          <a href="#productos" onClick={() => setMobileMenuOpen(false)}>Productos</a>
          <a href="#categorias" onClick={() => setMobileMenuOpen(false)}>Categorías</a>
        </nav>
        
        <div className="header-actions">
          <button className="header-cart-btn" onClick={onCartOpen} id="cart-button" aria-label="Carrito">
            🛒
            {cartCount > 0 && <span className="header-cart-badge">{cartCount}</span>}
          </button>
          <Link to="/admin" className="header-admin-btn" title="Panel Admin" id="admin-button">
            ⚙️
          </Link>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Menu">
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
