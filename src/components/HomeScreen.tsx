import React from 'react';
import { Search, MapPin, Bell, User, Heart, Stethoscope, Scissors, TreePine, Home, ShoppingBag } from 'lucide-react';
import { AppContextType } from '../App';

interface HomeScreenProps {
  context: AppContextType;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ context }) => {
  const services = [
    {
      id: 'veterinaria',
      name: 'Veterinaria',
      icon: Stethoscope,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'paseo',
      name: 'Paseo',
      icon: TreePine,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'grooming',
      name: 'Grooming',
      icon: Scissors,
      color: 'bg-pink-100 text-pink-600'
    },
    {
      id: 'hospedaje',
      name: 'Hospedaje',
      icon: Home,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'petshop',
      name: 'Pet Shop',
      icon: ShoppingBag,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const handleServiceClick = (serviceId: string) => {
    context.setSelectedService(serviceId);
    context.setCurrentScreen('service-listing');
  };

  return (
    <div className="screen-container bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 rounded-b-3xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-primary-500 mr-2" fill="currentColor" />
            <span className="text-xl font-bold text-gray-800">Kunapet</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => context.setCurrentScreen('notifications')}
              className="p-2 rounded-full bg-gray-100"
            >
              <Bell className="w-6 h-6 text-gray-600" />
            </button>
            <button 
              onClick={() => context.setCurrentScreen('pet-profile')}
              className="p-2 rounded-full bg-primary-100"
            >
              <User className="w-6 h-6 text-primary-600" />
            </button>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center mb-6">
          <MapPin className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-gray-600">San Borja, Lima</span>
          <button className="ml-2 text-primary-600 text-sm font-medium">Cambiar</button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar servicios para tu mascota..."
            className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="mx-6 mt-6 p-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl text-white">
        <h2 className="text-xl font-bold mb-2">¡Hola, María! 👋</h2>
        <p className="text-primary-100 mb-4">¿Qué necesita tu mascota hoy?</p>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full"></div>
          <div className="w-6 h-6 bg-white bg-opacity-30 rounded-full mt-1"></div>
          <div className="w-4 h-4 bg-white bg-opacity-20 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-6 mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Servicios</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 active:scale-95"
              >
                <div className={`w-12 h-12 ${service.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-800 text-left">{service.name}</h4>
                <p className="text-sm text-gray-500 mt-1 text-left">Disponible ahora</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <button className="flex items-center justify-between w-full p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-accent-100 text-accent-600 rounded-xl flex items-center justify-center mr-4">
                <Heart className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">Mis Mascotas</p>
                <p className="text-sm text-gray-500">Gestionar perfiles</p>
              </div>
            </div>
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;