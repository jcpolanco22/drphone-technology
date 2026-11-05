import { NavLink, Outlet, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function AdminLayout() {
  const { dispatch } = useStore();
  
  const navItems = [
    { to: '/admin', icon: '📊', label: 'Dashboard', end: true },
    { to: '/admin/products', icon: '📦', label: 'Productos' },
    { to: '/admin/categories', icon: '🏷️', label: 'Categorías' },
    { to: '/admin/settings', icon: '⚙️', label: 'Ajustes del Sitio' },
    { to: '/admin/template', icon: '🎨', label: 'Plantilla' },
  ];
  
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="logo-icon">📱</div>
          <div>
            <h2>DrPhone</h2>
            <span>Admin Panel</span>
          </div>
        </div>
        
        <nav className="admin-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-link" style={{ marginBottom: '0.5rem' }}>
            <span className="nav-icon">🏠</span>
            Ver Tienda
          </Link>
          <button
            className="admin-nav-link"
            onClick={() => dispatch({ type: 'ADMIN_LOGOUT' })}
            style={{ width: '100%', textAlign: 'left' }}
          >
            <span className="nav-icon">🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>
      
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
