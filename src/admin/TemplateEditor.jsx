import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const defaultColors = {
  bgPrimary: '#0f172a',
  bgSecondary: '#1e293b',
  bgTertiary: '#334155',
  accentPrimary: '#38bdf8',
  accentSecondary: '#818cf8',
  accentGreen: '#10b981',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
};

export default function TemplateEditor() {
  const { state, dispatch } = useStore();
  const [colors, setColors] = useState(state.settings.themeColors || defaultColors);
  const [saved, setSaved] = useState(false);
  
  useEffect(() => {
    // Apply colors to CSS variables in real time
    const root = document.documentElement;
    root.style.setProperty('--color-bg-primary', colors.bgPrimary);
    root.style.setProperty('--color-bg-secondary', colors.bgSecondary);
    root.style.setProperty('--color-bg-tertiary', colors.bgTertiary);
    root.style.setProperty('--color-accent-primary', colors.accentPrimary);
    root.style.setProperty('--color-accent-secondary', colors.accentSecondary);
    root.style.setProperty('--color-accent-green', colors.accentGreen);
    root.style.setProperty('--color-text-primary', colors.textPrimary);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    
    // Update derived values
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`);
    root.style.setProperty('--color-bg-card', `${colors.bgSecondary}b3`);
    root.style.setProperty('--color-border', `${colors.accentPrimary}26`);
    root.style.setProperty('--color-border-hover', `${colors.accentPrimary}66`);
    root.style.setProperty('--color-text-accent', colors.accentPrimary);
  }, [colors]);
  
  const handleColorChange = (key, value) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { themeColors: colors } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  const handleReset = () => {
    setColors(defaultColors);
    dispatch({ type: 'UPDATE_SETTINGS', payload: { themeColors: defaultColors } });
  };
  
  const colorFields = [
    { key: 'bgPrimary', label: 'Fondo Principal', desc: 'Color de fondo de la página' },
    { key: 'bgSecondary', label: 'Fondo Secundario', desc: 'Tarjetas, sidebar, footer' },
    { key: 'bgTertiary', label: 'Fondo Terciario', desc: 'Elementos hover, scrollbar' },
    { key: 'accentPrimary', label: 'Acento Principal', desc: 'Botones, links, badges' },
    { key: 'accentSecondary', label: 'Acento Secundario', desc: 'Gradientes, badges pro' },
    { key: 'accentGreen', label: 'Color Verde', desc: 'WhatsApp, éxito, carrito' },
    { key: 'textPrimary', label: 'Texto Principal', desc: 'Títulos y texto principal' },
    { key: 'textSecondary', label: 'Texto Secundario', desc: 'Subtítulos, descripciones' },
  ];
  
  // Preset themes
  const presets = [
    {
      name: '🌊 Ocean Dark (Default)',
      colors: defaultColors
    },
    {
      name: '🌸 Rose Gold',
      colors: {
        bgPrimary: '#1a0a1e',
        bgSecondary: '#2d1233',
        bgTertiary: '#4a1d52',
        accentPrimary: '#f472b6',
        accentSecondary: '#c084fc',
        accentGreen: '#10b981',
        textPrimary: '#fdf2f8',
        textSecondary: '#d1a3c4',
      }
    },
    {
      name: '🔥 Ember',
      colors: {
        bgPrimary: '#1a0f0a',
        bgSecondary: '#2d1a11',
        bgTertiary: '#4a2c1e',
        accentPrimary: '#f97316',
        accentSecondary: '#ef4444',
        accentGreen: '#10b981',
        textPrimary: '#fef3e2',
        textSecondary: '#c4a882',
      }
    },
    {
      name: '💚 Matrix',
      colors: {
        bgPrimary: '#0a1a0f',
        bgSecondary: '#112d18',
        bgTertiary: '#1e4a2c',
        accentPrimary: '#22c55e',
        accentSecondary: '#10b981',
        accentGreen: '#22c55e',
        textPrimary: '#e2fef0',
        textSecondary: '#82c4a0',
      }
    },
    {
      name: '💜 Midnight Purple',
      colors: {
        bgPrimary: '#0f0a1a',
        bgSecondary: '#1a1133',
        bgTertiary: '#2d1e52',
        accentPrimary: '#a78bfa',
        accentSecondary: '#818cf8',
        accentGreen: '#10b981',
        textPrimary: '#f0e6ff',
        textSecondary: '#a88ec4',
      }
    },
  ];
  
  return (
    <>
      <div className="admin-page-header">
        <h2>Editor de Plantilla</h2>
        <p>Personaliza los colores y apariencia de tu tienda</p>
      </div>
      
      {/* Presets */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>🎭 Temas Predefinidos</h3>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {presets.map((preset, i) => (
            <button
              key={i}
              className="btn btn-outline btn-sm"
              onClick={() => setColors(preset.colors)}
              style={{
                borderColor: preset.colors.accentPrimary + '40',
                background: `linear-gradient(135deg, ${preset.colors.bgPrimary}, ${preset.colors.bgSecondary})`,
              }}
            >
              <span style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: preset.colors.accentPrimary,
                marginRight: '4px'
              }}></span>
              {preset.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Color Editor */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>🎨 Colores Personalizados</h3>
          <button className="btn btn-outline btn-sm" onClick={handleReset}>
            🔄 Restaurar Defaults
          </button>
        </div>
        <div className="admin-form">
          {colorFields.map(field => (
            <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
              <div className="color-picker-swatch" style={{ background: colors[field.key] }}>
                <input
                  type="color"
                  value={colors[field.key]}
                  onChange={(e) => handleColorChange(field.key, e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{field.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{field.desc}</div>
              </div>
              <input
                className="input-field"
                value={colors[field.key]}
                onChange={(e) => handleColorChange(field.key, e.target.value)}
                style={{ maxWidth: '120px', fontFamily: 'monospace', fontSize: '0.8rem' }}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Live Preview */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>👁️ Vista Previa en Vivo</h3>
        </div>
        <div className="template-preview" style={{
          background: colors.bgPrimary,
          border: `1px solid ${colors.accentPrimary}26`,
        }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '0.4rem 1.2rem',
              borderRadius: '999px',
              background: `${colors.accentPrimary}1a`,
              border: `1px solid ${colors.accentPrimary}33`,
              color: colors.accentPrimary,
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              ⚡ Ofertas exclusivas
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: colors.textPrimary, marginBottom: '0.5rem' }}>
              La mejor <span style={{ background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>tecnología</span>
            </h3>
            <p style={{ color: colors.textSecondary, fontSize: '0.85rem', marginBottom: '1rem' }}>Preview de cómo se verá tu tienda</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.75rem',
                background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`,
                color: 'white',
                fontWeight: 600,
                fontSize: '0.8rem',
                border: 'none'
              }}>Ver Productos</button>
              <button style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.75rem',
                background: 'transparent',
                color: colors.accentPrimary,
                fontWeight: 600,
                fontSize: '0.8rem',
                border: `1.5px solid ${colors.accentPrimary}`
              }}>WhatsApp</button>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              {[1, 2, 3].map(n => (
                <div key={n} style={{
                  width: '100px',
                  height: '80px',
                  background: `${colors.bgSecondary}`,
                  border: `1px solid ${colors.accentPrimary}26`,
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  {['📦', '🛡️', '⚡'][n - 1]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Save */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button className="btn btn-primary btn-lg" onClick={handleSave}>
          💾 Guardar Tema
        </button>
      </div>
      
      {saved && (
        <div className="toast">✅ Tema guardado correctamente</div>
      )}
    </>
  );
}
