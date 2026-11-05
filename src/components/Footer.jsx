import { useStore } from '../context/StoreContext';

export default function Footer() {
  const { state } = useStore();
  const { settings, categories } = state;
  
  const displayCategories = categories.filter(c => c.id !== 'all');
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="header-logo" style={{ marginBottom: '0.5rem' }}>
              <div className="header-logo-icon">📱</div>
              <div className="header-logo-text">
                <h1 style={{ fontSize: '1.25rem' }}>{settings.storeName}</h1>
                <span>{settings.storeTagline}</span>
              </div>
            </div>
            <p>
              Tu tienda de tecnología de confianza. Los mejores equipos al mejor precio con garantía y envío rápido.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Categorías</h4>
            <ul>
              {displayCategories.map(cat => (
                <li key={cat.id}>
                  <a href="#productos">{cat.icon} {cat.name}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Información</h4>
            <ul>
              <li><a href="#">Sobre Nosotros</a></li>
              <li><a href="#">Política de Envío</a></li>
              <li><a href="#">Política de Devolución</a></li>
              <li><a href="#">Garantía</a></li>
              <li><a href="#">Términos y Condiciones</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contacto</h4>
            <ul>
              <li><span>📞 {settings.phone}</span></li>
              <li><span>✉️ {settings.email}</span></li>
              <li><span>📍 {settings.address}</span></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {year} {settings.storeName} {settings.storeTagline}. Todos los derechos reservados.</p>
          <div className="footer-payments">
            <span>Métodos de pago:</span>
            <div className="payment-icon">VISA</div>
            <div className="payment-icon">MC</div>
            <div className="payment-icon">PP</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
