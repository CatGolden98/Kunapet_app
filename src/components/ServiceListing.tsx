import React from 'react';
import { ArrowLeft, MapPin, Star, Clock, Filter } from 'lucide-react';
import { AppContextType, Provider } from '../App';

interface ServiceListingProps {
  context: AppContextType;
}

const ServiceListing: React.FC<ServiceListingProps> = ({ context }) => {
  // Mock data for providers
  const mockProviders: Provider[] = [
    {
      id: '1',
      name: 'Clínica Veterinaria San Borja',
      type: 'veterinaria',
      rating: 4.8,
      distance: '0.8 km',
      image: 'https://images.pexels.com/photos/6235991/pexels-photo-6235991.jpeg?auto=compress&cs=tinysrgb&w=400',
      address: 'Av. San Borja Sur 123',
      phone: '+51 999 888 777',
      hours: 'L-V 8:00-20:00, S-D 9:00-18:00',
      services: [
        { id: '1', name: 'Consulta General', price: 80, duration: '30 min', description: 'Examen general completo' },
        { id: '2', name: 'Vacunación', price: 50, duration: '15 min', description: 'Vacunas preventivas' }
      ],
      reviews: 127
    },
    {
      id: '2',
      name: 'VetCare Plus',
      type: 'veterinaria',
      rating: 4.6,
      distance: '1.2 km',
      image: 'https://images.pexels.com/photos/6235659/pexels-photo-6235659.jpeg?auto=compress&cs=tinysrgb&w=400',
      address: 'Av. Javier Prado Este 456',
      phone: '+51 888 777 666',
      hours: 'L-S 7:00-21:00',
      services: [
        { id: '3', name: 'Consulta Especializada', price: 120, duration: '45 min', description: 'Consulta con especialista' }
      ],
      reviews: 89
    },
    {
      id: '3',
      name: 'Pet Grooming Deluxe',
      type: 'grooming',
      rating: 4.9,
      distance: '0.5 km',
      image: 'https://images.pexels.com/photos/6816861/pexels-photo-6816861.jpeg?auto=compress&cs=tinysrgb&w=400',
      address: 'Av. República de Panamá 789',
      phone: '+51 777 666 555',
      hours: 'L-S 9:00-19:00',
      services: [
        { id: '4', name: 'Baño y Corte', price: 60, duration: '60 min', description: 'Baño completo con corte' }
      ],
      reviews: 156
    }
  ];

  const serviceNames: Record<string, string> = {
    'veterinaria': 'Veterinarias',
    'paseo': 'Paseo de Mascotas',
    'grooming': 'Peluquería',
    'hospedaje': 'Hospedaje',
    'petshop': 'Pet Shops'
  };

  const filteredProviders = mockProviders.filter(provider => 
    provider.type === context.selectedService
  );

  const handleProviderClick = (provider: Provider) => {
    context.setSelectedProvider(provider);
    context.setCurrentScreen('provider-profile');
  };

  return (
    <div className="screen-container bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => context.setCurrentScreen('home')}
            className="p-2 rounded-full bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            {serviceNames[context.selectedService || 'veterinaria']}
          </h1>
          <button className="p-2 rounded-full bg-gray-100">
            <Filter className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Location */}
        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-gray-600">San Borja, Lima</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-gray-500">{filteredProviders.length} disponibles</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex space-x-3 overflow-x-auto">
          <button className="px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-medium whitespace-nowrap">
            Más cercanos
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium whitespace-nowrap">
            Mejor calificados
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium whitespace-nowrap">
            Precio menor
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium whitespace-nowrap">
            Disponible ahora
          </button>
        </div>
      </div>

      {/* Provider List */}
      <div className="flex-1 px-6 py-6">
        <div className="space-y-4">
          {filteredProviders.map((provider) => (
            <div 
              key={provider.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
              onClick={() => handleProviderClick(provider)}
            >
              <div className="flex p-4">
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="w-20 h-20 rounded-xl object-cover mr-4"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">
                      {provider.name}
                    </h3>
                    <div className="flex items-center bg-green-100 px-2 py-1 rounded-full ml-2">
                      <Star className="w-4 h-4 text-green-600 mr-1" fill="currentColor" />
                      <span className="text-green-600 font-semibold text-sm">{provider.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="mr-3">{provider.distance}</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Abierto hasta 20:00</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {provider.address}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-semibold">
                      Desde S/ {Math.min(...provider.services.map(s => s.price))}
                    </span>
                    <span className="text-xs text-gray-500">
                      {provider.reviews} reseñas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay servicios disponibles
            </h3>
            <p className="text-gray-500">
              Intenta expandir el área de búsqueda o cambia los filtros
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceListing;