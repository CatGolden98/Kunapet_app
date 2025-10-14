import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, ShoppingCart, Star, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface KunapetShopProps {
  onNavigate: (screen: string, data?: any) => void;
  onAddToCart: (product: any) => void;
}

const KunapetShop: React.FC<KunapetShopProps> = ({ onNavigate, onAddToCart }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const categories = [
    { id: 'all', name: 'Todo', icon: '🎁' },
    { id: 'pastry', name: 'Pastelería', icon: '🎂' },
    { id: 'costumes', name: 'Disfraces', icon: '🎭' },
    { id: 'accessories', name: 'Accesorios', icon: '✨' },
    { id: 'food', name: 'Alimentos', icon: '🍖' },
    { id: 'toys', name: 'Juguetes', icon: '🎾' }
  ];

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery]);

  const loadProducts = async () => {
    let query = supabase
      .from('products')
      .select('*, providers(business_name, logo_url, rating)')
      .order('created_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    const { data } = await query;
    if (data) setProducts(data);
  };

  return (
    <div className="screen-container bg-gray-50">
      <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 px-6 pt-8 pb-6 text-white sticky top-0 z-20">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Kunapet Shop</h1>
          <button
            onClick={() => onNavigate('cart')}
            className="relative p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-white text-secondary-600'
                  : 'bg-white/20 text-black hover:bg-white/30'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {products.length} productos encontrados
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm text-primary-600 font-medium"
          >
            <Filter className="w-4 h-4 mr-1" />
            Filtros
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onNavigate('product-detail', { productId: product.id })}
            >
              <div className="relative">
                <div className="w-full h-40 bg-gray-200"></div>
                {product.discount_percentage > 0 && (
                  <div className="absolute top-2 right-2 bg-secondary-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    -{product.discount_percentage}%
                  </div>
                )}
                {product.trending && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-gray-800 text-xs px-2 py-1 rounded-full font-bold flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    HOT
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {product.providers?.business_name}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-xs text-yellow-500">
                    <Star className="w-3 h-3 fill-current mr-1" />
                    {product.providers?.rating || 4.5}
                  </div>
                  <span className="text-xs text-gray-500">{product.stock} disponibles</span>
                </div>
                {product.discount_percentage > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 line-through">
                      S/ {product.price.toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-secondary-600">
                      S/ {(product.price * (1 - product.discount_percentage / 100)).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-bold text-primary-600">
                    S/ {product.price.toFixed(2)}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                    setCartCount(prev => prev + 1);
                  }}
                  className="w-full mt-3 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No se encontraron productos</p>
            <p className="text-sm text-gray-400">Intenta con otra búsqueda o categoría</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KunapetShop;
