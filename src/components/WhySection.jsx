import { useStore } from '../context/StoreContext';

export default function WhySection() {
  const { state } = useStore();
  const { settings } = state;
  
  return (
    <section className="why-section" id="why-drphone">
      <div className="container">
        <h2>
          {settings.whyTitle.split('DrPhone').map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && <span className="gradient-text">DrPhone</span>}
            </span>
          ))}
        </h2>
        
        <p>{settings.whySubtitle}</p>
        
        <div className="stats-grid">
          {settings.stats.map((stat, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-card-icon">{stat.icon}</div>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
