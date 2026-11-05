import { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';

export default function ProductGrid({ onAddToCart, onShowDetails }) {
  const { state } = useStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  
  const filteredProducts = useMemo(() => {
    let result = [...state.products];
    
    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    
    // Filter by search
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }
    
    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    return result;
  }, [state.products, activeCategory, search, sortBy]);
  
  return (
    <section className="products-section" id="productos">
      <div className="container">
        <p className="section-subtitle">
          Descubre la última tecnología de las marcas más reconocidas del mundo
        </p>
        
        <div className="products-toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar productos, marcas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="product-search"
            />
          </div>
          <div className="sort-select">
            <span>⇅</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} id="product-sort">
              <option value="default">Ordenar por</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name">Nombre A-Z</option>
              <option value="rating">Mejor valorados</option>
            </select>
          </div>
        </div>
        
        <div className="category-tabs" id="categorias">
          {state.categories.map(cat => (
            <button
              key={cat.id}
              className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
        
        <div className="products-count">
          <span>☰</span> {filteredProducts.length} productos encontrados
        </div>
        
        <div className="product-grid">
          {filteredProducts.map((product, index) => (
            <div key={product.id} style={{ animationDelay: `${index * 0.08}s` }} className="animate-fade-in-up">
              <ProductCard product={product} onAddToCart={onAddToCart} onShowDetails={onShowDetails} />
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
              <p>No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
