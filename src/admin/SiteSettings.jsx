import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

export default function SiteSettings() {
  const { state, dispatch } = useStore();
  const [form, setForm] = useState({ ...state.settings });
  const [saved, setSaved] = useState(false);
  
  useEffect(() => {
    setForm({ ...state.settings });
  }, [state.settings]);
  
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  
  const handleTrustBadgeChange = (index, field, value) => {
    const newBadges = [...form.trustBadges];
    newBadges[index] = { ...newBadges[index], [field]: value };
    setForm(prev => ({ ...prev, trustBadges: newBadges }));
  };
  
  const handleStatChange = (index, field, value) => {
    const newStats = [...form.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setForm(prev => ({ ...prev, stats: newStats }));
  };
  
  const handleSave = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  return (
    <>
      <div className="admin-page-header">
        <h2>Ajustes del Sitio</h2>
        <p>Personaliza la información y contenido de tu tienda</p>
      </div>
      
      {/* Contact Info */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>📞 Información de Contacto</h3>
        </div>
        <div className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre de la Tienda</label>
              <input className="input-field" value={form.storeName} onChange={(e) => handleChange('storeName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <input className="input-field" value={form.storeTagline} onChange={(e) => handleChange('storeTagline', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Teléfono</label>
              <input className="input-field" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label>WhatsApp (solo número)</label>
              <input className="input-field" value={form.whatsapp} onChange={(e) => handleChange('whatsapp', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input className="input-field" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input className="input-field" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>🎯 Sección Hero</h3>
        </div>
        <div className="admin-form">
          <div className="form-group">
            <label>Badge de Oferta</label>
            <input className="input-field" value={form.heroBadge} onChange={(e) => handleChange('heroBadge', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Título Principal</label>
            <input className="input-field" value={form.heroTitle} onChange={(e) => handleChange('heroTitle', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Subtítulo</label>
            <textarea className="input-field" rows="3" value={form.heroSubtitle} onChange={(e) => handleChange('heroSubtitle', e.target.value)} style={{ resize: 'vertical' }} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Botón CTA 1</label>
              <input className="input-field" value={form.heroCta1} onChange={(e) => handleChange('heroCta1', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Botón CTA 2</label>
              <input className="input-field" value={form.heroCta2} onChange={(e) => handleChange('heroCta2', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Trust Badges */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>🛡️ Trust Badges</h3>
        </div>
        <div className="admin-form">
          {form.trustBadges.map((badge, i) => (
            <div className="form-row" key={i} style={{ gridTemplateColumns: '80px 1fr 1fr' }}>
              <div className="form-group">
                <label>Icono</label>
                <input className="input-field" value={badge.icon} onChange={(e) => handleTrustBadgeChange(i, 'icon', e.target.value)} style={{ textAlign: 'center', fontSize: '1.3rem' }} />
              </div>
              <div className="form-group">
                <label>Título</label>
                <input className="input-field" value={badge.title} onChange={(e) => handleTrustBadgeChange(i, 'title', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Subtítulo</label>
                <input className="input-field" value={badge.subtitle} onChange={(e) => handleTrustBadgeChange(i, 'subtitle', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Why Section Stats */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>📊 Sección "¿Por qué elegir DrPhone?"</h3>
        </div>
        <div className="admin-form">
          <div className="form-group">
            <label>Título</label>
            <input className="input-field" value={form.whyTitle} onChange={(e) => handleChange('whyTitle', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Subtítulo</label>
            <textarea className="input-field" rows="2" value={form.whySubtitle} onChange={(e) => handleChange('whySubtitle', e.target.value)} style={{ resize: 'vertical' }} />
          </div>
          {form.stats.map((stat, i) => (
            <div className="form-row" key={i} style={{ gridTemplateColumns: '80px 1fr 1fr' }}>
              <div className="form-group">
                <label>Icono</label>
                <input className="input-field" value={stat.icon} onChange={(e) => handleStatChange(i, 'icon', e.target.value)} style={{ textAlign: 'center', fontSize: '1.3rem' }} />
              </div>
              <div className="form-group">
                <label>Valor</label>
                <input className="input-field" value={stat.value} onChange={(e) => handleStatChange(i, 'value', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Label</label>
                <input className="input-field" value={stat.label} onChange={(e) => handleStatChange(i, 'label', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Admin Password */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>🔒 Seguridad</h3>
        </div>
        <div className="admin-form">
          <div className="form-group" style={{ maxWidth: '400px' }}>
            <label>Contraseña de Admin</label>
            <input className="input-field" type="password" value={form.adminPassword} onChange={(e) => handleChange('adminPassword', e.target.value)} />
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button className="btn btn-primary btn-lg" onClick={handleSave}>
          💾 Guardar Cambios
        </button>
      </div>
      
      {saved && (
        <div className="toast">✅ Cambios guardados correctamente</div>
      )}
    </>
  );
}
