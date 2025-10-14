import React, { useState } from 'react';
import { ArrowLeft, Bell, Calendar, Syringe, Clock, MapPin, CheckCircle } from 'lucide-react';
import { AppContextType } from '../App';

interface NotificationsScreenProps {
  context: AppContextType;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ context }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'appointments' | 'health'>('all');

  const notifications = [
    {
      id: '1',
      type: 'appointment',
      title: 'Recordatorio de Cita',
      message: 'Tu cita con Clínica Veterinaria San Borja es mañana a las 2:00 PM',
      time: '2 horas',
      icon: Calendar,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      unread: true
    },
    {
      id: '2',
      type: 'health',
      title: 'Vacuna Próxima',
      message: 'Max necesita su vacuna contra la rabia el 25 de enero',
      time: '1 día',
      icon: Syringe,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      unread: true
    },
    {
      id: '3',
      type: 'appointment',
      title: 'Cita Confirmada',
      message: 'Tu reserva en Pet Grooming Deluxe ha sido confirmada para el 22 de enero',
      time: '3 días',
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      unread: false
    },
    {
      id: '4',
      type: 'health',
      title: 'Desparasitación',
      message: 'Bella debe recibir tratamiento antiparasitario en febrero',
      time: '1 semana',
      icon: Syringe,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      unread: false
    },
    {
      id: '5',
      type: 'appointment',
      title: 'Servicio Completado',
      message: 'El grooming de Max se completó exitosamente. ¡Califica el servicio!',
      time: '2 semanas',
      icon: CheckCircle,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      unread: false
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'appointments') return notification.type === 'appointment';
    if (activeTab === 'health') return notification.type === 'health';
    return true;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

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
          <h1 className="text-xl font-bold text-gray-800">Notificaciones</h1>
          <div className="flex items-center">
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-primary-50 rounded-2xl p-4">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <p className="font-semibold text-primary-800">Centro de Notificaciones</p>
              <p className="text-primary-600 text-sm">
                {unreadCount} nuevas • {filteredNotifications.length} total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
          {[
            { key: 'all', label: 'Todas', count: notifications.length },
            { key: 'appointments', label: 'Citas', count: notifications.filter(n => n.type === 'appointment').length },
            { key: 'health', label: 'Salud', count: notifications.filter(n => n.type === 'health').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 px-6 py-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay notificaciones
            </h3>
            <p className="text-gray-500">
              Te notificaremos sobre citas y recordatorios de salud
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Today Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800">Hoy</h2>
              {filteredNotifications.slice(0, 2).map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div 
                    key={notification.id} 
                    className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${
                      notification.unread ? 'border-primary-500' : 'border-gray-200'
                    } hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex items-start">
                      <div className={`w-12 h-12 ${notification.iconBg} rounded-2xl flex items-center justify-center mr-4 flex-shrink-0`}>
                        <IconComponent className={`w-6 h-6 ${notification.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold ${notification.unread ? 'text-gray-800' : 'text-gray-600'}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-2">Hace {notification.time}</span>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {notification.message}
                        </p>

                        {/* Action buttons for appointment notifications */}
                        {notification.type === 'appointment' && notification.unread && (
                          <div className="flex space-x-2 mt-3">
                            <button className="px-4 py-2 bg-primary-100 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors">
                              Ver Detalles
                            </button>
                            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                              Recordar después
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Earlier Section */}
            {filteredNotifications.length > 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800">Anteriores</h2>
                {filteredNotifications.slice(2).map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div 
                      key={notification.id} 
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start">
                        <div className={`w-10 h-10 ${notification.iconBg} rounded-xl flex items-center justify-center mr-3 flex-shrink-0`}>
                          <IconComponent className={`w-5 h-5 ${notification.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-600">
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-400">Hace {notification.time}</span>
                          </div>
                          <p className="text-gray-500 text-sm">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;