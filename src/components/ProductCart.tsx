import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
}

interface ProductCartProps {
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onProceed: () => void;
  onBack: () => void;
}

const ProductCart: React.FC<ProductCartProps> = ({ items, onUpdateQty, onRemove, onProceed, onBack }) => {
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subtotal > 50 ? 0 : (items.length > 0 ? 10 : 0);
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="screen-container bg-gray-50 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h3>
          <p className="text-gray-500 mb-4">Explora productos y añade lo que necesites</p>
          <div className="flex gap-3 justify-center">
            <button onClick={onBack} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Volver</button>
            <button onClick={() => onBack('shop')} className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">Ir a la tienda</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container bg-gray-50">
      <div className="bg-white px-6 pt-8 pb-6 shadow-sm flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Mi Carrito</h1>
        <div className="w-10" />
      </div>

      <div className="px-6 py-6 space-y-4">
        {items.map((it) => (
          <div key={it.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-3 items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
              {it.image ? <img src={it.image} alt={it.name} className="w-full h-full object-cover" /> : null}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 line-clamp-2">{it.name}</p>
              <p className="text-sm text-primary-600 font-bold">S/ {it.price.toFixed(2)}</p>
              <div className="mt-2 inline-flex items-center bg-gray-100 rounded-lg">
                <button onClick={() => onUpdateQty(it.id, -1)} className="px-3 py-1.5 text-gray-700">−</button>
                <span className="px-3 py-1.5 font-semibold text-gray-800">{it.qty}</span>
                <button onClick={() => onUpdateQty(it.id, +1)} className="px-3 py-1.5 text-gray-700">+</button>
              </div>
            </div>
            <button onClick={() => onRemove(it.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="px-6 pb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Envío</span><span>{shipping === 0 ? 'Gratis' : `S/ ${shipping.toFixed(2)}`}</span></div>
          <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800"><span>Total</span><span>S/ {total.toFixed(2)}</span></div>
        </div>
      </div>

      <div className="bg-white p-6 border-t">
        <button onClick={onProceed} className="btn-primary w-full">Proceder al Pago</button>
      </div>
    </div>
  );
};

export default ProductCart;