import { useStore } from '../context/StoreContext';

export default function WhatsAppButton() {
  const { state } = useStore();
  const whatsappUrl = `https://wa.me/${state.settings.whatsapp}?text=Hola! Me interesa conocer sus productos.`;
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      id="whatsapp-button"
      title="Chatea con nosotros por WhatsApp"
    >
      💬
    </a>
  );
}
