import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/currency';

export default function Checkout({ isOpen, onClose, onSuccess }) {
  const { state, dispatch } = useStore();
  const [paymentMethod, setPaymentMethod] = useState('transferencia');
  const [orderStatus, setOrderStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Santo Domingo',
    address: '',
    notes: ''
  });
  
  if (!isOpen) return null;
  
  const { settings } = state;
  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItems = state.cart;
  
  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleWhatsAppOrder = () => {
    const items = cartItems.map(item => {
      const colorTxt = item.selectedColor ? ` [Color: ${item.selectedColor}]` : '';
      const storageTxt = item.selectedStorage ? ` [${item.selectedStorage}]` : '';
      return `• ${item.name}${colorTxt}${storageTxt} (x${item.quantity}) — ${formatPrice(item.price * item.quantity)}`;
    }).join('\n');

    const customerDetails = `
*DATOS DEL CLIENTE:*
👤 *Nombre:* ${formData.name || 'Cliente'}
📞 *Teléfono:* ${formData.phone || 'Por confirmar'}
📍 *Ciudad/Provincia:* ${formData.city}
🏠 *Dirección de Entrega:* ${formData.address || 'Pendiente de acordar'}
💳 *Método de Pago:* ${paymentMethod.toUpperCase()}
${formData.notes ? `📝 *Nota:* ${formData.notes}` : ''}`;

    const message = `¡Hola DrPhone Technology! 👋 He completado mi orden en la web:\n\n*PEDIDO:* \n${items}\n\n*TOTAL A PAGAR:* ${formatPrice(total)}\n${customerDetails}\n\nPor favor confirmar disponibilidad y tiempo de entrega.`;
    
    const whatsappNum = settings.whatsapp || '18094226985';
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setOrderStatus('success');
  };
  
  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div className="checkout-modal enhanced-checkout-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="checkout-header">
          <h3>💳 Finalizar Compra en República Dominicana</h3>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>
        
        {/* Order Success */}
        {orderStatus === 'success' && (
          <div className="checkout-body">
            <div className="checkout-success">
              <div className="checkout-success-icon">✅</div>
              <h3>¡Pedido Enviado Exitosamente!</h3>
              <p>Tu orden por <strong>{formatPrice(total)}</strong> ha sido recibida y abierta en WhatsApp para confirmación inmediata con el equipo de DrPhone Technology.</p>
              <button className="btn btn-primary btn-lg" onClick={() => {
                dispatch({ type: 'CLEAR_CART' });
                setOrderStatus(null);
                onSuccess?.();
                onClose();
              }} style={{ marginTop: '1.5rem' }}>
                Volver a la Tienda
              </button>
            </div>
          </div>
        )}
        
        {/* Normal Checkout Flow */}
        {!orderStatus && (
          <div className="checkout-body">
            {/* Order Summary */}
            <div className="checkout-summary">
              <h4>Resumen de tu Orden ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} artículos)</h4>
              <div className="checkout-items">
                {cartItems.map((item, idx) => (
                  <div className="checkout-item" key={item.cartItemId || idx}>
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{item.name}</span>
                      <div className="checkout-item-sub">
                        {item.selectedColor && <span className="spec-tag">Color: {item.selectedColor}</span>}
                        {item.selectedStorage && <span className="spec-tag">{item.selectedStorage}</span>}
                        <span className="checkout-item-qty">Cantidad: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="checkout-item-price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="checkout-total-row">
                <span>Total a Pagar (RD$):</span>
                <span className="checkout-total-amount">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Customer Form */}
            <div className="checkout-form-section">
              <h4>Datos de Entrega en RD</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ej. Juan Pérez"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Ej. 809-555-0199"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Ciudad / Provincia</label>
                  <select name="city" value={formData.city} onChange={handleInputChange}>
                    <option value="Santo Domingo (Distrito Nacional)">Santo Domingo (Distrito Nacional)</option>
                    <option value="Santo Domingo Este">Santo Domingo Este</option>
                    <option value="Santo Domingo Oeste">Santo Domingo Oeste</option>
                    <option value="Santo Domingo Norte">Santo Domingo Norte</option>
                    <option value="Santiago de los Caballeros">Santiago de los Caballeros</option>
                    <option value="La Vega">La Vega</option>
                    <option value="San Cristóbal">San Cristóbal</option>
                    <option value="Punta Cana / Bávaro">Punta Cana / Bávaro</option>
                    <option value="Puerto Plata">Puerto Plata</option>
                    <option value="Otra provincia (Envío por Caribe Tours/Metro)">Otra provincia</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Dirección / Sector</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Calle, Número, Sector o Referencia"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="checkout-payment-section">
              <h4>Método de Pago Preferido</h4>
              <div className="payment-options-grid">
                <label className={`payment-option-card ${paymentMethod === 'transferencia' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="transferencia"
                    checked={paymentMethod === 'transferencia'}
                    onChange={() => setPaymentMethod('transferencia')}
                  />
                  <div className="payment-option-content">
                    <span className="pay-icon">🏦</span>
                    <div>
                      <strong>Transferencia Bancaria</strong>
                      <p>Banco Popular, Banreservas, BHD</p>
                    </div>
                  </div>
                </label>

                <label className={`payment-option-card ${paymentMethod === 'contraentrega' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="contraentrega"
                    checked={paymentMethod === 'contraentrega'}
                    onChange={() => setPaymentMethod('contraentrega')}
                  />
                  <div className="payment-option-content">
                    <span className="pay-icon">💵</span>
                    <div>
                      <strong>Pago Contra Entrega</strong>
                      <p>Efectivo al recibir en Santo Domingo</p>
                    </div>
                  </div>
                </label>

                <label className={`payment-option-card ${paymentMethod === 'tarjeta' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="tarjeta"
                    checked={paymentMethod === 'tarjeta'}
                    onChange={() => setPaymentMethod('tarjeta')}
                  />
                  <div className="payment-option-content">
                    <span className="pay-icon">💳</span>
                    <div>
                      <strong>Tarjeta / Enlace de Pago</strong>
                      <p>Visa, Mastercard mediante link seguro</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Confirm button */}
            <div className="checkout-submit-box">
              <button 
                type="button" 
                className="btn btn-primary btn-lg" 
                style={{ width: '100%', fontSize: '1.1rem' }}
                onClick={handleWhatsAppOrder}
              >
                ✅ Confirmar Pedido por WhatsApp — {formatPrice(total)}
              </button>
              <p className="checkout-safe-note">
                🔒 Tu pedido se confirma directamente con nuestro personal en Santo Domingo. Sin comisiones ocultas.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
