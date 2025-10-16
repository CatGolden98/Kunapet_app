import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SplashScreen from './components/SplashScreen';
import AuthScreenNew from './components/AuthScreenNew';
import HomeScreenNew from './components/HomeScreenNew';
import KunapetShop from './components/KunapetShop';
import KunapuntosScreen from './components/KunapuntosScreen';
import PremiumMembership from './components/PremiumMembership';
import ProviderPanel from './components/ProviderPanel';
import ChatSupport from './components/ChatSupport';
import AccountScreen from './components/AccountScreen';
import ServiceListingNew from './components/ServiceListingNew';
import ProviderProfileNew from './components/ProviderProfileNew';
import ProductDetail from './components/ProductDetail';
import PetProfile from './components/PetProfile';
import ServiceListing from './components/ServiceListing';
import ProviderProfile from './components/ProviderProfile';
import BookingCart from './components/BookingCart';
import PaymentConfirmation from './components/PaymentConfirmation';
import NotificationsScreen from './components/NotificationsScreen';
import ProductCart from './components/ProductCart';
import PaymentMethods from './components/PaymentMethods';
import SecurityPrivacy from './components/SecurityPrivacy';
import OrderDetails from './components/OrderDetails';
import './index.css';

export type Screen =
  | 'splash'
  | 'auth'
  | 'home'
  | 'shop'
  | 'kunapuntos'
  | 'membership'
  | 'provider-panel'
  | 'chat'
  | 'account'
  | 'pet-profile'
  | 'services'
  | 'service-listing'
  | 'provider-profile'
  | 'provider-detail'
  | 'product-detail'
  | 'booking-cart'
  | 'payment-confirmation'
  | 'notifications'
  | 'product-cart'
  | 'payment-methods'
  | 'security'
  | 'order-details';

interface NavigationData {
  [key: string]: any;
}

function AppContent() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [navigationData, setNavigationData] = useState<NavigationData>({});
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [productCart, setProductCart] = useState<Array<{ id: string; name: string; price: number; image?: string; qty: number }>>([]);

  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen(user ? 'home' : 'auth');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, user]);

  useEffect(() => {
    if (!loading) {
      if (user && currentScreen === 'auth') {
        setCurrentScreen('home');
      } else if (!user && currentScreen !== 'splash' && currentScreen !== 'auth') {
        setCurrentScreen('auth');
      }
    }
  }, [user, loading]);

  const handleNavigate = (screen: Screen, data?: any) => {
    setCurrentScreen(screen);
    if (data) {
      setNavigationData(data);
    }
  };

  const handleAddToCart = (product: any) => {
    setCartItems([...cartItems, product]);
  };

  const handleAddProductToCart = (item: { id: string; name: string; price: number; image?: string }) => {
    setProductCart(prev => {
      const idx = prev.findIndex(p => p.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleUpdateProductQty = (id: string, delta: number) => {
    setProductCart(prev => prev
      .map(p => (p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p))
      .filter(p => p.qty > 0)
    );
  };

  const handleRemoveProduct = (id: string) => {
    setProductCart(prev => prev.filter(p => p.id !== id));
  };

  const renderScreen = () => {
    if (loading && currentScreen !== 'splash') {
      return (
        <div className="screen-container bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      );
    }

    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'auth':
        return <AuthScreenNew onNavigate={handleNavigate} />;
      case 'home':
        return user ? (
          <HomeScreenNew onNavigate={handleNavigate} userId={user.id} onAddToCart={handleAddProductToCart} />
        ) : (
          <AuthScreenNew onNavigate={handleNavigate} />
        );
      case 'shop':
        return (
          <KunapetShop
            onNavigate={handleNavigate}
            onAddToCart={(p: any) =>
              handleAddProductToCart({
                id: p.id,
                name: p.name,
                price: p.price,
                image: Array.isArray(p.photos) && p.photos.length > 0 ? p.photos[0] : undefined,
              })
            }
          />
        );
      case 'kunapuntos':
        return user ? (
          <KunapuntosScreen onNavigate={handleNavigate} userId={user.id} />
        ) : (
          <AuthScreenNew onNavigate={handleNavigate} />
        );
      case 'membership':
        return user ? (
          <PremiumMembership onNavigate={handleNavigate} userId={user.id} />
        ) : (
          <AuthScreenNew onNavigate={handleNavigate} />
        );
      case 'provider-panel':
        return user ? (
          <ProviderPanel onNavigate={handleNavigate} userId={user.id} />
        ) : (
          <AuthScreenNew onNavigate={handleNavigate} />
        );
      case 'chat':
        return <ChatSupport onNavigate={handleNavigate} />;
      case 'account':
        return <AccountScreen onNavigate={handleNavigate} />;
      case 'services':
        return <ServiceListingNew onNavigate={handleNavigate} category={navigationData.category || 'veterinary'} onAddToCart={handleAddProductToCart} />;
      case 'provider-detail':
        return <ProviderProfileNew onNavigate={handleNavigate} providerId={navigationData.providerId} />;
      case 'product-detail':
        return (
          <ProductDetail
            onNavigate={handleNavigate}
            productId={navigationData.productId}
            onAddToCart={(p: any) =>
              handleAddProductToCart({
                id: p.id,
                name: p.name,
                price: p.price,
                image: Array.isArray(p.photos) && p.photos.length > 0 ? p.photos[0] : undefined,
              })
            }
          />
        );
      case 'pet-profile':
        return <PetProfile context={{ currentScreen, setCurrentScreen: handleNavigate } as any} />;
      case 'service-listing':
        return <ServiceListing context={{ currentScreen, setCurrentScreen: handleNavigate } as any} />;
      case 'provider-profile':
        return <ProviderProfile context={{ currentScreen, setCurrentScreen: handleNavigate } as any} />;
      case 'booking-cart':
        return <BookingCart context={{ currentScreen, setCurrentScreen: handleNavigate, cartItems } as any} />;
      case 'product-cart':
        return (
          <ProductCart
            items={productCart}
            onUpdateQty={handleUpdateProductQty}
            onRemove={handleRemoveProduct}
            onProceed={() => setCurrentScreen('payment-methods')}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'payment-methods':
        return (
          <PaymentMethods
            total={productCart.reduce((sum, i) => sum + i.price * i.qty, 0)}
            onBack={() => setCurrentScreen('product-cart')}
            onSuccess={(paymentInfo) => setCurrentScreen('payment-confirmation')}
            onSecurity={() => setCurrentScreen('security')}
          />
        );
      case 'security':
        return <SecurityPrivacy onBack={() => setCurrentScreen('payment-methods')} />;
      case 'order-details':
        return <OrderDetails onBack={() => setCurrentScreen('home')} />;
      case 'payment-confirmation':
        return <PaymentConfirmation context={{ currentScreen, setCurrentScreen: handleNavigate } as any} />;
      case 'notifications':
        return <NotificationsScreen context={{ currentScreen, setCurrentScreen: handleNavigate } as any} />;
      default:
        return user ? (
          <HomeScreenNew onNavigate={handleNavigate} userId={user.id} />
        ) : (
          <AuthScreenNew onNavigate={handleNavigate} />
        );
    }
  };

  return <div className="app-container">{renderScreen()}</div>;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
