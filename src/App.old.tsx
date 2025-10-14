import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
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
  | 'pet-profile' 
  | 'service-listing' 
  | 'provider-profile' 
  | 'booking-cart' 
  | 'payment-confirmation' 
  | 'notifications';

export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  age: string;
  breed: string;
  photo?: string;
  medicalHistory: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

export interface Provider {
  id: string;
  name: string;
  type: 'veterinaria' | 'grooming' | 'paseo' | 'hospedaje' | 'petshop';
  rating: number;
  distance: string;
  image: string;
  address: string;
  phone: string;
  hours: string;
  services: Service[];
  reviews: number;
}

export interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  selectedService: string | null;
  setSelectedService: (service: string | null) => void;
  selectedProvider: Provider | null;
  setSelectedProvider: (provider: Provider | null) => void;
  pets: Pet[];
  setPets: (pets: Pet[]) => void;
  cartItems: Service[];
  setCartItems: (items: Service[]) => void;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [cartItems, setCartItems] = useState<Service[]>([]);

  useEffect(() => {
    // Simulate splash screen duration
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('auth');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const appContext: AppContextType = {
    currentScreen,
    setCurrentScreen,
    selectedService,
    setSelectedService,
    selectedProvider,
    setSelectedProvider,
    pets,
    setPets,
    cartItems,
    setCartItems
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'auth':
        return <AuthScreen context={appContext} />;
      case 'home':
        return <HomeScreen context={appContext} />;
      case 'pet-profile':
        return <PetProfile context={appContext} />;
      case 'service-listing':
        return <ServiceListing context={appContext} />;
      case 'provider-profile':
        return <ProviderProfile context={appContext} />;
      case 'booking-cart':
        return <BookingCart context={appContext} />;
      case 'payment-confirmation':
        return <PaymentConfirmation context={appContext} />;
      case 'notifications':
        return <NotificationsScreen context={appContext} />;
      default:
        return <HomeScreen context={appContext} />;
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}
    </div>
  );
}

export default App;