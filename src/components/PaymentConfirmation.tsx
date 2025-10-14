import React from 'react';
import { CheckCircle, Calendar, Clock, MapPin, Home, Receipt } from 'lucide-react';
import { AppContextType } from '../App';

interface PaymentConfirmationProps {
  context: AppContextType;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ context }) => {
  const bookingId = `KNP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  const total = context.cartItems.reduce((sum, item) => sum + item.price, 0);
  const serviceFee = Math.round(total * 0.1);
  const finalTotal = total + serviceFee;

  const handleGoHome = () => {
    // Clear cart and navigate to home
    context.setCartItems([]);
    context.setSelectedProvider(null);
    context.setSelectedService(null);
    context.setCurrentScreen('home');
  };

  return (
    <div className="screen-container bg-gray-50">
      {/* Success Animation */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="text-4xl mb-2">🎉</div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            ¡Reserva Confirmada!
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Tu cita ha sido reservada exitosamente. Recibirás una confirmación por correo electrónico.
          </p>

          {/* Booking Details Card */}
          <div className="bg-white rounded-3xl p-6 shadow-lg mb-8 text-left">
            {/* Booking ID */}
            <div className="bg-primary-50 rounded-2xl p-4 mb-6 text-center">
              <h3 className="text-sm font-medium text-primary-700 mb-1">Código de Reserva</h3>
              <p className="text-2xl font-bold text-primary-800 tracking-wider">{bookingId}</p>
            </div>

            {/* Provider Info */}
            {context.selectedProvider && (
              <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                <img
                  src={context.selectedProvider.image}
                  alt={context.selectedProvider.name}
                  className="w-12 h-12 rounded-xl object-cover mr-3"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{context.selectedProvider.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{context.selectedProvider.address}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Appointment Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-semibold text-gray-800">Sábado, 20 Enero 2024</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hora</p>
                  <p className="font-semibold text-gray-800">2:00 PM</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="font-semibold text-gray-800 mb-3">Servicios Reservados</h4>
              <div className="space-y-2 mb-4">
                {context.cartItems.map((service, index) => (
                  <div key={`${service.id}-${index}`} className="flex justify-between text-sm">
                    <span className="text-gray-600">{service.name}</span>
                    <span className="font-semibold text-gray-800">S/ {service.price}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <div className="flex justify-between text-base font-bold text-gray-800">
                    <span>Total Pagado</span>
                    <span>S/ {finalTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="btn-secondary w-full flex items-center justify-center">
              <Receipt className="w-5 h-5 mr-2" />
              Descargar Comprobante
            </button>
            
            <button
              onClick={handleGoHome}
              className="btn-primary w-full flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Volver al Inicio
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-2xl">
            <p className="text-blue-800 text-sm font-medium mb-2">
              📱 ¿Qué sigue?
            </p>
            <p className="text-blue-700 text-sm">
              Te enviaremos recordatorios por WhatsApp y email. Puedes modificar o cancelar tu cita hasta 2 horas antes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;