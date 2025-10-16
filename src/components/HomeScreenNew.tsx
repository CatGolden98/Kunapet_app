import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Bell, User, Stethoscope, Navigation, ShoppingBag, Star, TrendingUp, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import logoImg from '../assets/WhatsApp Image 2025-10-08 at 3.14.40 PM.png';

interface HomeScreenNewProps {
  onNavigate: (screen: string, data?: any) => void;
  userId: string;
  onAddToCart?: (item: { id: string; name: string; price: number; image?: string }) => void;
}

const HomeScreenNew: React.FC<HomeScreenNewProps> = ({ onNavigate, userId, onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('San Borja, Lima');
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [userPets, setUserPets] = useState<any[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<any[]>([]);
  const [trendingItems, setTrendingItems] = useState<any[]>([]);
  const [kunapuntos, setKunapuntos] = useState(0);
  const [fullName, setFullName] = useState<string>('');

  const discountedRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);
  const scrollBy = (ref: React.RefObject<HTMLDivElement>, dir: 'left'|'right') => {
    const el = ref.current; if (!el) return;
    const delta = dir === 'left' ? -320 : 320;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
   


    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();
    if (profile?.full_name) setFullName(profile.full_name);

    const { data: pets } = await supabase
      .from('pets')
      .select('*')
      .eq('owner_id', userId);

    if (pets) setUserPets(pets);

    const { data: pointsData } = await supabase
      .from('kunapuntos')
      .select('points')
      .eq('user_id', userId);

    if (pointsData) {
      const total = pointsData.reduce((sum, item) => sum + item.points, 0);
      setKunapuntos(total);
    }

    const { data: discounted } = await supabase
      .from('products')
      .select('id,name,price,discount_percentage,photos,providers(business_name)')
      .gt('discount_percentage', 0)
      .limit(8);

    if (discounted) setDiscountedProducts(discounted);

    const { data: trending } = await supabase
      .from('products')
      .select('id,name,price,photos,providers(business_name)')
      .eq('trending', true)
      .limit(12);

    if (trending) setTrendingItems(trending);

    const species = pets?.[0]?.species;
    if (species) {
      const { data: rec } = await supabase
        .from('products')
        .select('id, name, price, photos')
        .or(`species.eq.${species},species.is.null`)
        .limit(6);
      if (rec) setRecommendedProducts(rec);
    }
  };

  const toggleSpecies = (species: string) => {
    setSelectedSpecies(prev =>
      prev.includes(species) ? prev.filter(s => s !== species) : [...prev, species]
    );
  };

  return (
    <div className="screen-container bg-gray-50 overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <img src={logoImg} alt="Kunapet" className="h-8" />
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('notifications')}
              className="relative p-2"
            >
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => onNavigate('account')}
              className="p-2"
            >
              <User className="w-5 h-5 text-primary-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center mb-3">
          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
          <span className="text-sm text-gray-600">{location}</span>
          <button className="ml-2 text-sm text-primary-600 font-medium">Cambiar</button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar servicios para tu mascota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-base font-bold mb-1">¡Hola, {fullName || 'cliente'}! 👋</p>
              <p className="text-sm opacity-90">¿Qué necesita tu mascota hoy?</p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-800">Servicios</h3>
            <button onClick={() => onNavigate('product-cart')} className="text-sm text-primary-600 font-semibold flex items-center">
              <ShoppingBag className="w-4 h-4 mr-1" /> Mi Carrito
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('services', { category: 'veterinary' })}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-800 mb-1">Veterinaria</span>
                <span className="text-xs text-gray-500">Disponible ahora</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('services', { category: 'walking' })}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <Navigation className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-800 mb-1">Paseo</span>
                <span className="text-xs text-gray-500">Disponible ahora</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('services', { category: 'grooming' })}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-3">
                  <Star className="w-6 h-6 text-pink-600" />
                </div>
                <span className="text-sm font-semibold text-gray-800 mb-1">Grooming</span>
                <span className="text-xs text-gray-500">Disponible ahora</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('services', { category: 'hospedaje' })}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-800 mb-1">Hospedaje</span>
                <span className="text-xs text-gray-500">Disponible ahora</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('shop')}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm font-semibold text-gray-800 mb-1">Pet Shop</span>
                <span className="text-xs text-gray-500">Disponible ahora</span>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-base font-bold text-gray-800 mb-3">Acciones Rápidas</h3>
          <button
            onClick={() => onNavigate('pets')}
            className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center"
          >
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-gray-800">Mis Mascotas</p>
              <p className="text-xs text-gray-500">Gestionar perfiles</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Kunapuntos Banner - Optional */}
        {kunapuntos > 0 && (
          <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-black opacity-90 mb-1">Tus Kunapuntos</p>
                <p className="text-2xl text-black font-bold">{kunapuntos}</p>
              </div>
              <button
                onClick={() => onNavigate('kunapuntos')}
                className="px-4 py-2 bg-white text-secondary-600 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Canjear
              </button>
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        {recommendedProducts.length > 0 && (
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-3">Recomendaciones</h3>
            <div className="grid grid-cols-2 gap-3">
              {recommendedProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="w-full h-24 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                    {Array.isArray(p.photos) && p.photos[0] ? (
                      <img src={p.photos[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">{p.name}</p>
                  <p className="text-xs text-gray-500 mb-2">Para {userPets[0]?.species || 'tu mascota'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary-600">S/ {Number(p.price).toFixed(2)}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigate('product-detail', { productId: p.id })}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Ver
                      </button>
                      {onAddToCart && (
                        <button
                          onClick={() => onAddToCart({ id: p.id, name: p.name, price: p.price, image: Array.isArray(p.photos) && p.photos[0] ? p.photos[0] : undefined })}
                          className="text-xs px-2 py-1 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                        >
                          Añadir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discounted Products - Optional */}
        {discountedProducts.length > 0 && (
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-3">Productos con Descuento</h3>
            <div className="flex items-center justify-end gap-2 mb-2 hidden md:flex">
              <button onClick={() => scrollBy(discountedRef, 'left')} className="px-2 py-1 bg-white text-gray-700 rounded-lg border hover:bg-gray-50" aria-label="Anterior">◄</button>
              <button onClick={() => scrollBy(discountedRef, 'right')} className="px-2 py-1 bg-white text-gray-700 rounded-lg border hover:bg-gray-50" aria-label="Siguiente">►</button>
            </div>
            <div ref={discountedRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {discountedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-40 bg-white rounded-xl shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onNavigate('product-detail', { productId: product.id })}
                >
                  <div className="relative">
                    <div className="w-full h-28 bg-gray-200 rounded-lg mb-2 overflow-hidden">
                      {Array.isArray(product.photos) && product.photos[0] ? (
                        <img src={product.photos[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="absolute top-2 right-2 bg-secondary-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      -{product.discount_percentage}%
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">{product.providers?.business_name}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 line-through mr-1">
                        S/ {product.price.toFixed(2)}
                      </span>
                      <span className="text-sm font-bold text-secondary-600">
                        S/ {(product.price * (1 - product.discount_percentage / 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Items - Optional */}
        {trendingItems.length > 0 && (
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 text-secondary-500 mr-2" />
              En Tendencia Ahora
            </h3>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {trendingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-40 bg-white rounded-xl shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onNavigate('product-detail', { productId: item.id })}
                >
                  <div className="relative">
                    <div className="w-full h-28 bg-gray-200 rounded-lg mb-2 overflow-hidden">
                      {Array.isArray(item.photos) && item.photos[0] ? (
                        <img src={item.photos[0]} alt={item.name} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="absolute top-2 left-2 bg-yellow-400 text-gray-800 text-xs px-2 py-1 rounded-full font-bold flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      HOT
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">{item.providers?.business_name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary-600">
                      S/ {item.price.toFixed(2)}
                    </span>
                    <div className="flex items-center text-xs text-yellow-500">
                      <Star className="w-3 h-3 fill-current mr-1" />
                      4.9
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => onNavigate('chat')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-all hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
      </button>
    </div>
  );
};

export default HomeScreenNew;