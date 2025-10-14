import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Phone, Calendar, Plus } from 'lucide-react';
import { AppContextType, Service } from '../App';

interface ProviderProfileProps {
  context: AppContextType;
}

const ProviderProfile: React.FC<ProviderProfileProps> = ({ context }) => {
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'info'>('services');
  const provider = context.selectedProvider;

  if (!provider) {
    return (
      <div className="screen-container flex items-center justify-center">
        <p>Proveedor no encontrado</p>
      </div>
    );
  }

  const addToCart = (service: Service) => {
    context.setCartItems([...context.cartItems, service]);
  };

  const reviews = [
    {
      id: 1,
      user: 'Ana González',
      rating: 5,
      date: '15 Ene 2024',
      comment: 'Excelente atención, muy profesionales. Mi perrito quedó perfecto después del grooming.'
    },
    {
      id: 2,
      user: 'Carlos Mendez',
      rating: 4,
      date: '12 Ene 2024',
      comment: 'Buen servicio, aunque tuvimos que esperar un poco más de lo esperado.'
    }
  ];

  return (
    <div className="screen-container bg-gray-50">
      {/* Header with Image */}
      <div className="relative">
        <img
          src={provider.image}
          alt={provider.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-0 left-0 right-0 p-6 pt-12 bg-gradient-to-b from-black/30 to-transparent">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => context.setCurrentScreen('service-listing')}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
              <span className="text-white font-semibold">{provider.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Info Card */}
      <div className="bg-white mx-6 -mt-8 relative z-10 rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{provider.name}</h1>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="mr-4">{provider.address}</span>
          <span className="text-primary-600 font-medium">{provider.distance}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-800">Horarios</p>
              <p className="text-sm text-gray-600">{provider.hours}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-800">Teléfono</p>
              <p className="text-sm text-primary-600">{provider.phone}</p>
            </div>
          </div>
        </div>

        {context.cartItems.length > 0 && (
          <button
            onClick={() => context.setCurrentScreen('booking-cart')}
            className="btn-primary w-full mb-4"
          >
            Ver Carrito ({context.cartItems.length}) - S/ {context.cartItems.reduce((sum, item) => sum + item.price, 0)}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6">
        <div className="flex bg-white rounded-xl p-1 shadow-sm">
          {[
            { key: 'services', label: 'Servicios' },
            { key: 'reviews', label: 'Reseñas' },
            { key: 'info', label: 'Info' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-6 py-6">
        {activeTab === 'services' && (
          <div className="space-y-4">
            {provider.services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{service.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{service.duration}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-primary-600">S/ {service.price}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Agendar
                  </button>
                  <button 
                    onClick={() => addToCart(service)}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-800 mb-1">{provider.rating}</div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${star <= Math.floor(provider.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                    />
                  ))}
                </div>
                <p className="text-gray-600">Basado en {provider.reviews} reseñas</p>
              </div>
            </div>

            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.user}</h4>
                    <p className="text-gray-500 text-sm">{review.date}</p>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Información Adicional</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Servicios Especializados</h4>
                <p className="text-gray-600 text-sm">Atención médica general, vacunación, desparasitación, cirugías menores, consultas de emergencia.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Métodos de Pago</h4>
                <p className="text-gray-600 text-sm">Efectivo, tarjetas de crédito/débito, transferencias bancarias, billeteras digitales.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Política de Cancelación</h4>
                <p className="text-gray-600 text-sm">Cancelaciones gratuitas hasta 2 horas antes de la cita. Cancelaciones tardías pueden incurrir en cargos.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderProfile;