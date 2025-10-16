import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface OrderDetailsProps {
  onBack: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ onBack }) => {
  const [showShipping, setShowShipping] = useState(true);
  const [showItems, setShowItems] = useState(true);
  const [showPayment, setShowPayment] = useState(true);

  return (
    <div className="screen-container bg-gray-50">
      <div className="bg-white px-6 pt-8 pb-6 shadow-sm flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Detalles del Pedido</h1>
        <div className="w-10" />
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-800">Envío y Entrega</p>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={showShipping} onChange={() => setShowShipping(!showShipping)} />
              <span className={`w-10 h-6 flex items-center bg-gray-200 rounded-full p-1 duration-200 ${showShipping ? 'bg-primary-500' : ''}`}>
                <span className={`bg-white w-4 h-4 rounded-full shadow transform duration-200 ${showShipping ? 'translate-x-4' : ''}`}></span>
              </span>
            </label>
          </div>
          {showShipping && (
            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <p>Fecha: 14/10/2025</p>
              <p>Estado: En proceso</p>
              <p>Dirección: Calle Ejemplo 123, San Borja</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-800">Artículos y Facturas</p>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={showItems} onChange={() => setShowItems(!showItems)} />
              <span className={`w-10 h-6 flex items-center bg-gray-200 rounded-full p-1 duration-200 ${showItems ? 'bg-primary-500' : ''}`}>
                <span className={`bg-white w-4 h-4 rounded-full shadow transform duration-200 ${showItems ? 'translate-x-4' : ''}`}></span>
              </span>
            </label>
          </div>
          {showItems && (
            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <p>- Shampoo para perros x1 — S/ 29.90</p>
              <p>- Cepillo desenredante x1 — S/ 35.00</p>
              <p>Factura electrónica: F001-000123</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-800">Resumen de Pago</p>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={showPayment} onChange={() => setShowPayment(!showPayment)} />
              <span className={`w-10 h-6 flex items-center bg-gray-200 rounded-full p-1 duration-200 ${showPayment ? 'bg-primary-500' : ''}`}>
                <span className={`bg-white w-4 h-4 rounded-full shadow transform duration-200 ${showPayment ? 'translate-x-4' : ''}`}></span>
              </span>
            </label>
          </div>
          {showPayment && (
            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <p>Subtotal: S/ 64.90</p>
              <p>Envío: S/ 10.00</p>
              <p>Total: S/ 74.90</p>
              <p>Método de pago: Tarjeta</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;