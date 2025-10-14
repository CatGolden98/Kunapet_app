import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MapPin, Clock, Star, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import logoImg from '../assets/WhatsApp Image 2025-10-08 at 3.14.40 PM.png';

interface ProviderProfileNewProps {
  onNavigate: (screen: string, data?: any) => void;
  providerId: string;
}

const ProviderProfileNew: React.FC<ProviderProfileNewProps> = ({ onNavigate, providerId }) => {
  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'about'>('services');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const carouselImages = [
    'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=800',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
  ];

  useEffect(() => {
    loadProviderData();
  }, [providerId]);

  const loadProviderData = async () => {
    setLoading(true);

    const { data: providerData } = await supabase
      .from('providers')
      .select('*')
      .eq('id', providerId)
      .maybeSingle();

    if (providerData) setProvider(providerData);

    const { data: servicesData } = await supabase
      .from('services')
      .select('*')
      .eq('provider_id', providerId)
      .eq('active', true);

    if (servicesData) setServices(servicesData);

    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*, profiles(full_name, avatar_url)')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (reviewsData) setReviews(reviewsData);

    setLoading(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  if (loading) {
    return (
      <div className="screen-container bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="screen-container bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Proveedor no encontrado</p>
      </div>
    );
  }

  return (
    <div className="screen-container bg-gray-50">
      <div className="relative">
        <div className="relative h-64 bg-gray-200 overflow-hidden">
          <img
            src={carouselImages[currentImageIndex]}
            alt="Provider"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
            <button
              onClick={() => onNavigate('services', { category: 'veterinary' })}
              className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <img src={logoImg} alt="Kunapet" className="h-8" />
            <div className="w-10"></div>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-2xl font-bold text-white mb-2">{provider.business_name}</h1>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
              <span className="text-white font-semibold">{provider.rating.toFixed(1)}</span>
              <span className="text-white/80 text-sm ml-1">({provider.total_reviews} reseñas)</span>
            </div>
          </div>

          {carouselImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                {carouselImages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  ></div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-white px-6 py-4 shadow-sm">
          <div className="flex items-start mb-4">
            <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0" />
            <div>
              <p className="text-gray-700 font-medium">{provider.address || 'Av. Javier Prado 123, San Isidro'}</p>
              <p className="text-sm text-gray-500">2.5 km de distancia</p>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-gray-400 mr-2" />
            <p className="text-gray-700">Lun - Sáb: 9:00 AM - 7:00 PM</p>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-semibold flex items-center justify-center hover:bg-primary-600 transition-colors">
              <Phone className="w-5 h-5 mr-2" />
              Llamar
            </button>
            <button className="flex-1 py-3 border-2 border-primary-500 text-primary-600 rounded-xl font-semibold flex items-center justify-center hover:bg-primary-50 transition-colors">
              <MapPin className="w-5 h-5 mr-2" />
              Cómo Llegar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === 'services'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500'
            }`}
          >
            Servicios
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === 'reviews'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500'
            }`}
          >
            Reseñas
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === 'about'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500'
            }`}
          >
            Nosotros
          </button>
        </div>
      </div>

      <div className="px-6 py-6 pb-24">
        {activeTab === 'services' && (
          <div className="space-y-3">
            {services.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay servicios disponibles</p>
            ) : (
              services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{service.name}</h3>
                      {service.description && (
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      )}
                      {service.duration_minutes && (
                        <p className="text-xs text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {service.duration_minutes} minutos
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xl font-bold text-secondary-600">S/ {service.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay reseñas todavía</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex-shrink-0 overflow-hidden">
                      {review.profiles?.avatar_url ? (
                        <img src={review.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                          {review.profiles?.full_name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{review.profiles?.full_name || 'Usuario'}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(review.created_at).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.comment && <p className="text-gray-700 text-sm">{review.comment}</p>}
                  {review.verified && (
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Compra verificada
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Acerca de Nosotros</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              {provider.description ||
                'Somos un equipo de profesionales dedicados al cuidado y bienestar de tu mascota. Con años de experiencia y amor por los animales, brindamos servicios de calidad que superan las expectativas de nuestros clientes.'}
            </p>

            {provider.verified && (
              <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900">Proveedor Verificado</p>
                  <p className="text-sm text-blue-700">Este proveedor ha sido verificado por Kunapet</p>
                </div>
              </div>
            )}

            {provider.ong_alliance && (
              <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-xl mt-3">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">Alianza con ONGs</p>
                  <p className="text-sm text-green-700">Apoya a organizaciones de protección animal</p>
                </div>
              </div>
            )}

            {provider.delivery_available && (
              <div className="flex items-center p-4 bg-secondary-50 border border-secondary-200 rounded-xl mt-3">
                <CheckCircle className="w-6 h-6 text-secondary-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-secondary-900">Delivery Disponible</p>
                  <p className="text-sm text-secondary-700">Servicio de entrega a domicilio pet-friendly</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-[480px] mx-auto">
        <button
          onClick={() => onNavigate('booking', { providerId })}
          className="w-full py-4 bg-secondary-500 text-white rounded-xl font-bold text-lg hover:bg-secondary-600 transition-colors shadow-lg"
          style={{ minHeight: '48px' }}
        >
          Reservar Cita
        </button>
      </div>
    </div>
  );
};

export default ProviderProfileNew;
