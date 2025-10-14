import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Heart, ArrowLeft } from 'lucide-react';
import { AppContextType } from '../App';

interface AuthScreenProps {
  context: AppContextType;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ context }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    context.setCurrentScreen('home');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="screen-container bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <button className="p-2 rounded-full bg-white shadow-sm">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center">
          <Heart className="w-8 h-8 text-primary-500 mr-2" fill="currentColor" />
          <span className="text-xl font-bold text-gray-800">Kunapet</span>
        </div>
        <div></div>
      </div>

      <div className="flex-1 px-6 pb-6">
        {/* Welcome text */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? '¡Bienvenido de vuelta!' : '¡Únete a Kunapet!'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Ingresa para cuidar a tu mascota' : 'Crea tu cuenta y comienza'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field pl-4 pr-4"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field pl-10 pr-4"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                className="input-field pl-10 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? 
                  <EyeOff className="w-5 h-5 text-gray-400" /> : 
                  <Eye className="w-5 h-5 text-gray-400" />
                }
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field pl-10 pr-4"
                  required
                />
              </div>
            )}

            <button type="submit" className="btn-primary w-full mt-6">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>

          {isLogin && (
            <div className="text-center mt-4">
              <a href="#" className="text-primary-600 text-sm">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          )}
        </div>

        {/* Social Login */}
        <div className="space-y-3 mb-6">
          <button className="btn-secondary w-full flex items-center justify-center">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-3" />
            Continuar con Google
          </button>
          <button className="btn-secondary w-full flex items-center justify-center">
            <div className="w-5 h-5 bg-blue-600 rounded mr-3 flex items-center justify-center">
              <span className="text-white text-xs font-bold">f</span>
            </div>
            Continuar con Facebook
          </button>
        </div>

        {/* Toggle auth mode */}
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-600 font-medium"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;