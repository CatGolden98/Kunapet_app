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
  | 'cart'
  | 'booking-cart'
  | 'payment-confirmation'
  | 'notifications';

interface NavigationData {
  [key: string]: any;
}

function AppContent() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [navigationData, setNavigationData] = useState<NavigationData>({});
  const [cartItems, setCartItems] = useState<any[]>([]);

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
          <HomeScreenNew onNavigate={handleNavigate} userId={user.id} />
        ) : (
          <AuthScreenNew onNavigate={handleNavigate} />
        );
      case 'shop':
        return <KunapetShop onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
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
        return <ServiceListingNew onNavigate={handleNavigate} category={navigationData.category || 'veterinary'} />;
      case 'provider-detail':
        return <ProviderProfileNew onNavigate={handleNavigate} providerId={navigationData.providerId} />;
      case 'product-detail':
        return <ProductDetail onNavigate={handleNavigate} productId={navigationData.productId} onAddToCart={handleAddToCart} />;
      case 'pet-profile':
        return <PetProfile context={{ currentScreen, setCurrentScreen: handleNavigate } as any} />;
      case 'service-listing':
        return <ServiceListing context={{ currentScreen, setCurrentScreen: handleNavigate } as any} />;
      case 'provider-profile':
        return <ProviderProfile context={{ currentScreen, setCurrentScreen: handleNavigate } as any} />;
      case 'booking-cart':
        return <BookingCart context={{ currentScreen, setCurrentScreen: handleNavigate, cartItems } as any} />;
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
