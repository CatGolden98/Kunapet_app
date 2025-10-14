import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Trash2, CreditCard, MapPin } from 'lucide-react';
import { AppContextType } from '../App';

interface BookingCartProps {
  context: AppContextType;
}

const BookingCart: React.FC<BookingCartProps> = ({ context }) => {
  const [selectedDate, setSelectedDate] = useState('2024-01-20');
  const [selectedTime, setSelectedTime] = useState('14:00');
  
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const total = context.cartItems.reduce((sum, item) => sum + item.price, 0);
  const serviceFee = Math.round(total * 0.1);
  const finalTotal = total + serviceFee;

  const removeFromCart = (serviceId: string) => {
    context.setCartItems(context.cartItems.filter(item => item.id !== serviceId));
  };

  const handleProceedToPayment = () => {
    context.setCurrentScreen('payment-confirmation');
  };

  if (context.cartItems.length === 0) {
    return (
      <div className="screen-container bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Tu carrito está vacío
          </h3>
          <p className="text-gray-500 mb-6">
            Agrega servicios para continuar
          </p>
          <button
            onClick={() => context.setCurrentScreen('provider-profile')}
            className="btn-primary"
          >
            Ver Servicios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => context.setCurrentScreen('provider-profile')}
          className="p-2 rounded-full bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Resumen de Reserva</h1>
        <div></div>
      </div>

      <div className="flex-1 px-6 py-6">
        {/* Provider Info */}
        {context.selectedProvider && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <div className="flex items-center">
              <img
                src={context.selectedProvider.image}
                alt={context.selectedProvider.name}
                className="w-12 h-12 rounded-xl object-cover mr-3"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{context.selectedProvider.name}</h3>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{context.selectedProvider.distance}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Servicios Seleccionados</h2>
          
          <div className="space-y-4">
            {context.cartItems.map((service, index) => (
              <div key={`${service.id}-${index}`} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{service.name}</h3>
                  <p className="text-gray-500 text-sm">{service.description}</p>
                  <div className="flex items-center text-gray-400 text-sm mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{service.duration}</span>
                  </div>
                </div>
                <div className="flex items-center ml-4">
                  <span className="font-bold text-lg text-gray-800 mr-3">S/ {service.price}</span>
                  <button
                    onClick={() => removeFromCart(service.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date & Time Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Fecha y Hora</h2>
          
          {/* Date Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Seleccionar Fecha
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Clock className="w-4 h-4 inline mr-1" />
              Seleccionar Hora
            </label>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Resumen de Costos</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({context.cartItems.length} servicios)</span>
              <span>S/ {total}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tarifa de servicio</span>
              <span>S/ {serviceFee}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span>S/ {finalTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-primary-50 rounded-2xl p-4 mb-6">
          <h3 className="font-semibold text-primary-800 mb-2">Resumen de tu Cita</h3>
          <div className="text-primary-700 text-sm space-y-1">
            <p>📅 {new Date(selectedDate).toLocaleDateString('es-PE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p>⏰ {selectedTime}</p>
            <p>📋 {context.cartItems.length} servicio(s)</p>
            <p>💰 Total: S/ {finalTotal}</p>
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="bg-white p-6 border-t">
        <button
          onClick={handleProceedToPayment}
          className="btn-primary w-full flex items-center justify-center"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Proceder al Pago - S/ {finalTotal}
        </button>
      </div>
    </div>
  );
};

export default BookingCart;