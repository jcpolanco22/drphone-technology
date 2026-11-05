import { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function AdminLogin() {
  const { state, dispatch } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === state.settings.adminPassword) {
      dispatch({ type: 'ADMIN_LOGIN' });
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };
  
  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="logo-icon">🔒</div>
        <h2>Panel de Administración</h2>
        <p>Ingresa la contraseña para acceder</p>
        
        {error && <div className="admin-login-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="admin-password">Contraseña</label>
            <input
              type="password"
              id="admin-password"
              className="input-field"
              placeholder="Ingresa la contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
}
