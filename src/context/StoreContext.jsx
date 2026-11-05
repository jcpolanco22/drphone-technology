import { createContext, useContext, useReducer, useEffect } from 'react';
import { defaultProducts, defaultCategories, defaultSettings } from '../data/defaultData';

const StoreContext = createContext(null);

const STORAGE_KEY = 'drphone_store';
const STORE_VERSION = 'v5_drphone_doctorphonemobile_real';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Auto-migrate if version doesn't match or products are outdated
      if (parsed.version === STORE_VERSION && parsed.products && parsed.products.length > 0 && parsed.products[0].colors) {
        return {
          products: parsed.products,
          categories: parsed.categories || defaultCategories,
          settings: { ...defaultSettings, ...parsed.settings },
          cart: parsed.cart || [],
          isAdminAuth: false
        };
      }
    }
  } catch (e) {
    console.error('Error loading state:', e);
  }
  return {
    products: defaultProducts,
    categories: defaultCategories,
    settings: defaultSettings,
    cart: [],
    isAdminAuth: false
  };
}

function storeReducer(state, action) {
  switch (action.type) {
    // === Products ===
    case 'ADD_PRODUCT': {
      const newProduct = {
        ...action.payload,
        id: Date.now()
      };
      return { ...state, products: [...state.products, newProduct] };
    }
    case 'UPDATE_PRODUCT': {
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        )
      };
    }
    case 'DELETE_PRODUCT': {
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    }
    
    // === Categories ===
    case 'ADD_CATEGORY': {
      return { ...state, categories: [...state.categories, action.payload] };
    }
    case 'UPDATE_CATEGORY': {
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        )
      };
    }
    case 'DELETE_CATEGORY': {
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload)
      };
    }
    
    // === Settings ===
    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    }
    
    // === Cart ===
    case 'ADD_TO_CART': {
      const cartItemId = action.payload.cartItemId || 
        `${action.payload.id}-${action.payload.selectedColor || ''}-${action.payload.selectedStorage || ''}`;
      
      const existing = state.cart.find(item => item.cartItemId === cartItemId || item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(item =>
            (item.cartItemId === cartItemId || item.id === action.payload.id)
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { 
          ...action.payload, 
          cartItemId, 
          quantity: action.payload.quantity || 1,
          image: action.payload.image || (action.payload.images && action.payload.images[0]) || ''
        }]
      };
    }
    case 'UPDATE_CART_QTY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => 
            (action.payload.cartItemId ? item.cartItemId !== action.payload.cartItemId : item.id !== action.payload.id)
          )
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          ((action.payload.cartItemId && item.cartItemId === action.payload.cartItemId) || (!action.payload.cartItemId && item.id === action.payload.id))
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    }
    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        cart: state.cart.filter(item => 
          (action.payload.cartItemId ? item.cartItemId !== action.payload.cartItemId : item.id !== action.payload)
        )
      };
    }
    case 'CLEAR_CART': {
      return { ...state, cart: [] };
    }
    
    // === Auth ===
    case 'ADMIN_LOGIN': {
      return { ...state, isAdminAuth: true };
    }
    case 'ADMIN_LOGOUT': {
      return { ...state, isAdminAuth: false };
    }
    
    // === Reset ===
    case 'RESET_ALL': {
      return {
        products: defaultProducts,
        categories: defaultCategories,
        settings: defaultSettings,
        cart: [],
        isAdminAuth: state.isAdminAuth
      };
    }
    
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, null, loadState);
  
  // Persist to localStorage on every change
  useEffect(() => {
    try {
      const toSave = {
        version: STORE_VERSION,
        products: state.products,
        categories: state.categories,
        settings: state.settings,
        cart: state.cart
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }, [state.products, state.categories, state.settings, state.cart]);
  
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
