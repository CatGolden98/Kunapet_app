import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import logoImg from '../assets/WhatsApp Image 2025-10-08 at 3.14.40 PM.png';

interface ProductDetailProps {
  onNavigate: (screen: string, data?: any) => void;
  productId: string;
  onAddToCart: (product: any, variant?: any) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onNavigate, productId, onAddToCart }) => {
  const [product, setProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const productImages = [
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
  ];

  const sizes = ['Pequeño', 'Mediano', 'Grande'];
  const flavors = ['Pollo', 'Carne', 'Pescado'];

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, providers(business_name, logo_url, rating)')
      .eq('id', productId)
      .maybeSingle();

    if (data) {
      setProduct(data);
      if (sizes.length > 0) setSelectedSize(sizes[0]);
      if (flavors.length > 0) setSelectedFlavor(flavors[0]);
    }
    setLoading(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    onAddToCart(product, {
      size: selectedSize,
      flavor: selectedFlavor,
      quantity,
    });

    setAddingToCart(false);

    const confirm = window.confirm('Producto agregado al carrito. ¿Ver carrito?');
    if (confirm) {
      onNavigate('cart');
    }
  };

  if (loading) {
    return (
      <div className="screen-container bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="screen-container bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Producto no encontrado</p>
      </div>
    );
  }

  const finalPrice = product.discount_percentage > 0
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  return (
    <div className="screen-container bg-white">
      <div className="relative">
        <div className="relative h-96 bg-gray-100 overflow-hidden">
          <img
            src={productImages[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {product.discount_percentage > 0 && (
            <div className="absolute top-4 right-4 bg-secondary-500 text-white px-4 py-2 rounded-full font-bold text-lg">
              -{product.discount_percentage}%
            </div>
          )}

          {product.trending && (
            <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm flex items-center">
              <Star className="w-4 h-4 fill-current mr-1" />
              Trending
            </div>
          )}

          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-between w-[calc(100%-2rem)]">
            <button
              onClick={() => onNavigate('shop')}
              className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <img src={logoImg} alt="Kunapet" className="h-8" />
            <div className="flex gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
              </button>
              <button
                className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Share2 className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          {productImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  ></button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-6 py-6 pb-32">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
              <span className="font-semibold text-gray-700">{product.providers?.rating?.toFixed(1) || '4.8'}</span>
              <span className="text-gray-500 text-sm ml-1">(248 reseñas)</span>
            </div>
            <div className="text-right">
              {product.discount_percentage > 0 ? (
                <div>
                  <p className="text-sm text-gray-400 line-through">S/ {product.price.toFixed(2)}</p>
                  <p className="text-3xl font-bold text-secondary-600">S/ {finalPrice.toFixed(2)}</p>
                </div>
              ) : (
                <p className="text-3xl font-bold text-secondary-600">S/ {product.price.toFixed(2)}</p>
              )}
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span>Vendido por </span>
            <button className="ml-1 text-primary-600 font-semibold">
              {product.providers?.business_name || 'Kunapet Store'}
            </button>
          </div>

          {product.stock > 0 && product.stock < 10 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800 font-medium">
                ¡Solo quedan {product.stock} unidades!
              </p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="font-bold text-gray-800 mb-3">Descripción</h2>
          <p className="text-gray-700 leading-relaxed">
            {product.description || 'Producto de alta calidad para tu mascota. Elaborado con ingredientes naturales y bajo estrictos controles de calidad para garantizar la satisfacción y bienestar de tu compañero peludo.'}
          </p>
        </div>

        {sizes.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Tamaño</h3>
            <div className="flex gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    selectedSize === size
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {flavors.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Sabor</h3>
            <div className="grid grid-cols-3 gap-3">
              {flavors.map((flavor) => (
                <button
                  key={flavor}
                  onClick={() => setSelectedFlavor(flavor)}
                  className={`py-3 rounded-xl font-medium transition-colors ${
                    selectedFlavor === flavor
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3">Cantidad</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 bg-gray-100 rounded-xl font-bold text-xl text-gray-700 hover:bg-gray-200 transition-colors"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              −
            </button>
            <span className="text-2xl font-bold text-gray-800 w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-12 h-12 bg-gray-100 rounded-xl font-bold text-xl text-gray-700 hover:bg-gray-200 transition-colors"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-xl">
            <Truck className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <p className="font-semibold text-green-900 text-sm">Envío gratis</p>
              <p className="text-xs text-green-700">En compras mayores a S/ 50</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <p className="font-semibold text-blue-900 text-sm">Garantía de calidad</p>
              <p className="text-xs text-blue-700">Productos 100% originales</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <RotateCcw className="w-6 h-6 text-orange-600 mr-3" />
            <div>
              <p className="font-semibold text-orange-900 text-sm">Devoluciones fáciles</p>
              <p className="text-xs text-orange-700">Hasta 30 días después de la compra</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-[480px] mx-auto">
        <div className="flex gap-3">
          <div className="flex-1 text-center">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-secondary-600">
              S/ {(finalPrice * quantity).toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
            className={`flex-[2] py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-colors ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : addingToCart
                ? 'bg-secondary-400 text-white'
                : 'bg-secondary-500 text-white hover:bg-secondary-600'
            }`}
            style={{ minHeight: '48px' }}
          >
            {addingToCart ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Agregando...
              </>
            ) : product.stock === 0 ? (
              'Agotado'
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
