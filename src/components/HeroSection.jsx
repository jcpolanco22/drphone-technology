import { useStore } from '../context/StoreContext';

export default function HeroSection() {
  const { state } = useStore();
  const { settings } = state;
  
  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=Hola! Me interesa conocer sus productos.`;
  
  // Split the title to apply gradient to the middle word
  const titleParts = settings.heroTitle.split(' ');
  const midIndex = Math.floor(titleParts.length / 2);
  
  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-badge animate-pulse">
          {settings.heroBadge}
        </div>
        
        <h2>
          {titleParts.map((word, i) => (
            <span key={i}>
              {i === midIndex || i === midIndex + 1 ? (
                <span className="gradient-text">{word} </span>
              ) : (
                word + ' '
              )}
            </span>
          ))}
        </h2>
        
        <p className="hero-subtitle">
          {settings.heroSubtitle}
        </p>
        
        <div className="hero-ctas">
          <a href="#productos" className="btn btn-primary btn-lg">
            🛒 {settings.heroCta1} ↓
          </a>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
            💬 {settings.heroCta2}
          </a>
        </div>
        
        <div className="trust-badges">
          {settings.trustBadges.map((badge, i) => (
            <div className="trust-badge" key={i}>
              <div className="trust-badge-icon">{badge.icon}</div>
              <div className="trust-badge-text">
                <h4>{badge.title}</h4>
                <p>{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="hero-scroll">↓</div>
      </div>
    </section>
  );
}
