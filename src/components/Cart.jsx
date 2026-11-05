import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/currency';
import Checkout from './Checkout';

export default function Cart({ isOpen, onClose }) {
  const { state, dispatch } = useStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  
  if (!isOpen && !checkoutOpen) return null;
  
  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const handleCheckoutSuccess = () => {
    setCheckoutOpen(false);
    onClose();
  };

  const handleWhatsAppCartOrder = () => {
    if (state.cart.length === 0) return;
    
    const itemsList = state.cart.map(item => {
      const colorTxt = item.selectedColor ? ` [Color: ${item.selectedColor}]` : '';
      const storageTxt = item.selectedStorage ? ` [${item.selectedStorage}]` : '';
      return `• ${item.name}${colorTxt}${storageTxt} (x${item.quantity}) — ${formatPrice(item.price * item.quantity)}`;
    }).join('\n');

    const message = `¡Hola DrPhone Technology! 👋 Deseo realizar este pedido:\n\n${itemsList}\n\n*Total a Pagar:* ${formatPrice(total)}\n\n¿Tienen entrega disponible en República Dominicana?`;
    const whatsappNum = state.settings.whatsapp || '18094226985';
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };
  
  return (
    <>
      {isOpen && (
        <>
          <div className="cart-overlay" onClick={onClose}></div>
          <div className="cart-sidebar" id="cart-sidebar">
            <div className="cart-header">
              <h3>🛒 Mi Carrito ({state.cart.reduce((acc, i) => acc + i.quantity, 0)})</h3>
              <button className="cart-close" onClick={onClose}>✕</button>
            </div>
            
            <div className="cart-items">
              {state.cart.length === 0 ? (
                <div className="cart-empty">
                  <span>📱</span>
                  <h4>Tu carrito está vacío</h4>
                  <p>Explora los últimos modelos de iPhone y smartphones con precios en RD$.</p>
                </div>
              ) : (
                state.cart.map((item, idx) => (
                  <div className="cart-item" key={item.cartItemId || idx}>
                    <div className="cart-item-image">
                      <img 
                        src={item.image || (item.images && item.images[0]) || ''} 
                        alt={item.name} 
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&fit=crop';
                        }}
                      />
                    </div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      
                      {/* Specs pills */}
                      <div className="cart-item-specs">
                        {item.selectedColor && (
                          <span className="cart-spec-pill">🎨 {item.selectedColor}</span>
                        )}
                        {item.selectedStorage && (
                          <span className="cart-spec-pill">💾 {item.selectedStorage}</span>
                        )}
                      </div>

                      <div className="cart-item-price">{formatPrice(item.price * item.quantity)}</div>
                      
                      <div className="cart-item-controls">
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => dispatch({ 
                            type: 'UPDATE_CART_QTY', 
                            payload: { id: item.id, cartItemId: item.cartItemId, quantity: item.quantity - 1 } 
                          })}
                        >−</button>
                        <span className="cart-qty">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => dispatch({ 
                            type: 'UPDATE_CART_QTY', 
                            payload: { id: item.id, cartItemId: item.cartItemId, quantity: item.quantity + 1 } 
                          })}
                        >+</button>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() => dispatch({ 
                        type: 'REMOVE_FROM_CART', 
                        payload: { id: item.id, cartItemId: item.cartItemId } 
                      })}
                      title="Eliminar artículo"
                    >🗑️</button>
                  </div>
                ))
              )}
            </div>
            
            {state.cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total (Pesos Dominicanos):</span>
                  <span className="total-amount-highlight">{formatPrice(total)}</span>
                </div>

                {/* WhatsApp Quick Order */}
                <button 
                  type="button" 
                  className="btn btn-whatsapp-direct" 
                  style={{ width: '100%', marginBottom: '0.6rem' }}
                  onClick={handleWhatsAppCartOrder}
                >
                  💬 Pedir Todo por WhatsApp Directo
                </button>
                
                {/* Regular Checkout Button */}
                <button 
                  type="button"
                  className="btn btn-primary btn-lg" 
                  style={{ width: '100%' }}
                  onClick={() => {
                    setCheckoutOpen(true);
                  }}
                >
                  💳 Finalizar Compra con Tarjeta / Transferencia
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Checkout Modal */}
      <Checkout
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />
    </>
  );
}
