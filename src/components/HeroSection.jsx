import { useStore } from '../context/StoreContext';

export default function HeroSection() {
  const { state } = useStore();
  const { settings } = state;
  
  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=Hola DrPhone! Me interesa conocer los precios y disponibilidad de los últimos iPhone.`;
  
  return (
    <section className="hero compact-hero" id="hero">
      <div className="container hero-split-container">
        {/* Left Column: Slogan, Subtitle & Actions */}
        <div className="hero-content-col">
          <div className="hero-badge">
            <span className="badge-flag">🇩🇴</span> {settings.heroBadge || 'Santo Domingo • República Dominicana'}
          </div>
          
          <h1 className="hero-main-title">
            Los últimos iPhone y la <span className="gradient-text">mejor tecnología</span> en RD
          </h1>
          
          <p className="hero-subtitle-compact">
            {settings.heroSubtitle}
          </p>
          
          <div className="hero-ctas-compact">
            <a href="#productos" className="btn btn-primary">
              🛒 Ver Catálogo y Precios RD$
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp-hero">
              💬 Pedir por WhatsApp
            </a>
          </div>
          
          {/* Compact Trust Features */}
          <div className="hero-mini-trust">
            <div className="mini-trust-item">
              <span className="trust-icon">📦</span>
              <span>Envíos a todo el país</span>
            </div>
            <div className="mini-trust-item">
              <span className="trust-icon">🛡️</span>
              <span>Garantía Oficial</span>
            </div>
            <div className="mini-trust-item">
              <span className="trust-icon">⚡</span>
              <span>Entrega Inmediata</span>
            </div>
          </div>
        </div>

        {/* Right Column: Store Display Showcase Image */}
        <div className="hero-showcase-col">
          <div className="store-showcase-frame">
            <img 
              src="/assets/store-phones-display.jpg" 
              alt="Tienda DrPhone Technology con smartphones en exhibición" 
              className="store-showcase-img"
              onError={(e) => {
                e.target.src = '/assets/store-showroom.jpg';
              }}
            />
            <div className="store-showcase-overlay">
              <span className="store-live-pill">
                <span className="live-dot"></span> Equipos en Exhibición
              </span>
              <p className="store-caption">DrPhone Technology • Santo Domingo, RD</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
