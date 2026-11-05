import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';

// Storefront
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductGrid from './components/ProductGrid';
import WhySection from './components/WhySection';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Cart from './components/Cart';
import ProductDetails from './components/ProductDetails';


// Admin
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ProductManager from './admin/ProductManager';
import CategoryManager from './admin/CategoryManager';
import SiteSettings from './admin/SiteSettings';
import TemplateEditor from './admin/TemplateEditor';

function StoreFront() {
  const { dispatch } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toast, setToast] = useState('');
  
  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    setToast(`✅ ${product.name} añadido al carrito`);
    setTimeout(() => setToast(''), 2500);
  };

  const handleShowDetails = (product) => {

    setSelectedProduct(product);
    setDetailsOpen(true);
  };
  
  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <main>
        <HeroSection />
        <ProductGrid onAddToCart={handleAddToCart} onShowDetails={handleShowDetails} />
        <WhySection />
      </main>
      <Footer />
      <WhatsAppButton />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <ProductDetails 
        product={selectedProduct} 
        isOpen={detailsOpen} 
        onClose={() => setDetailsOpen(false)} 
      />
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}


function AdminGuard() {
  const { state } = useStore();
  
  if (!state.isAdminAuth) {
    return <AdminLogin />;
  }
  
  return <AdminLayout />;
}

function ThemeApplier({ children }) {
  const { state } = useStore();
  
  useEffect(() => {
    const colors = state.settings.themeColors;
    if (colors) {
      const root = document.documentElement;
      root.style.setProperty('--color-bg-primary', colors.bgPrimary);
      root.style.setProperty('--color-bg-secondary', colors.bgSecondary);
      root.style.setProperty('--color-bg-tertiary', colors.bgTertiary);
      root.style.setProperty('--color-accent-primary', colors.accentPrimary);
      root.style.setProperty('--color-accent-secondary', colors.accentSecondary);
      root.style.setProperty('--color-accent-green', colors.accentGreen);
      root.style.setProperty('--color-text-primary', colors.textPrimary);
      root.style.setProperty('--color-text-secondary', colors.textSecondary);
      root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`);
      root.style.setProperty('--color-bg-card', `${colors.bgSecondary}b3`);
      root.style.setProperty('--color-border', `${colors.accentPrimary}26`);
      root.style.setProperty('--color-border-hover', `${colors.accentPrimary}66`);
      root.style.setProperty('--color-text-accent', colors.accentPrimary);
    }
  }, [state.settings.themeColors]);
  
  return children;
}

export default function App() {
  return (
    <StoreProvider>
      <ThemeApplier>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StoreFront />} />
            <Route path="/admin" element={<AdminGuard />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductManager />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="settings" element={<SiteSettings />} />
              <Route path="template" element={<TemplateEditor />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeApplier>
    </StoreProvider>
  );
}
