import { useStore } from '../context/StoreContext';

export default function WhySection() {
  const { state } = useStore();
  const { settings } = state;
  
  return (
    <section className="why-section compact-why-section" id="why-drphone">
      <div className="container">
        <h2 className="why-title-compact">
          ¿Por qué comprar en <span className="gradient-text">DrPhone Technology</span>?
        </h2>
        
        <p className="why-subtitle-compact">
          {settings.whySubtitle}
        </p>
        
        <div className="stats-grid compact-stats-grid">
          {settings.stats.map((stat, i) => (
            <div className="stat-card compact-stat-card" key={i}>
              <div className="stat-card-icon compact-stat-icon">{stat.icon}</div>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
