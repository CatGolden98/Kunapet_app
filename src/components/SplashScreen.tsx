import React from 'react';
import logoImg from '../assets/WhatsApp Image 2025-10-08 at 3.14.40 PM.png';

const SplashScreen: React.FC = () => {
  return (
    <div className="screen-container bg-gradient-to-br from-white via-primary-50 to-secondary-50 flex flex-col items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="mb-8 flex items-center justify-center">
          <img
            src={logoImg}
            alt="Kunapet Logo"
            className="w-64 h-auto"
          />
        </div>

        <p className="text-lg text-gray-600 font-medium mb-8">
          Cuidamos a tu mascota con amor
        </p>

        <div className="flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-secondary-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-accent-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-100/20 to-transparent"></div>
    </div>
  );
};

export default SplashScreen;