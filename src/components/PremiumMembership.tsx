import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Crown, Truck, Headphones, Percent, Zap, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PremiumMembershipProps {
  onNavigate: (screen: string, data?: any) => void;
  userId: string;
}

const PremiumMembership: React.FC<PremiumMembershipProps> = ({ onNavigate, userId }) => {
  const [currentPlan, setCurrentPlan] = useState<'free' | 'monthly' | 'annual'>('free');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMembership();
  }, [userId]);

  const loadMembership = async () => {
    const { data } = await supabase
      .from('memberships')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (data) {
      setCurrentPlan(data.plan_type);
    }
  };

  const handleUpgrade = async (planType: 'monthly' | 'annual') => {
    setLoading(true);

    const { error } = await supabase
      .from('memberships')
      .update({ plan_type: planType, status: 'active' })
      .eq('user_id', userId);

    if (!error) {
      setCurrentPlan(planType);
      alert(`¡Bienvenido a Kunapet ${planType === 'monthly' ? 'Mensual' : 'Anual'}!`);
    }

    setLoading(false);
  };

  const plans = [
    {
      id: 'free',
      name: 'Plan Gratuito',
      price: 0,
      period: '',
      icon: Star,
      color: 'gray',
      features: [
        { text: 'Acceso a servicios básicos', included: true },
        { text: 'Búsqueda de proveedores', included: true },
        { text: 'Sistema de calificaciones', included: true },
        { text: 'Envíos gratis', included: false },
        { text: 'Descuentos exclusivos', included: false },
        { text: 'Soporte prioritario', included: false },
        { text: 'Acumulación 2x Kunapuntos', included: false },
      ],
    },
    {
      id: 'monthly',
      name: 'Premium Mensual',
      price: 29.90,
      period: '/mes',
      icon: Zap,
      color: 'primary',
      popular: false,
      features: [
        { text: 'Todo lo del plan gratuito', included: true },
        { text: 'Envíos gratis en todos los pedidos', included: true },
        { text: '10% descuento en servicios', included: true },
        { text: '15% descuento en productos', included: true },
        { text: 'Soporte prioritario 24/7', included: true },
        { text: 'Acumulación 2x Kunapuntos', included: true },
        { text: 'Acceso anticipado a nuevos productos', included: true },
      ],
    },
    {
      id: 'annual',
      name: 'Premium Anual',
      price: 299.90,
      period: '/año',
      icon: Crown,
      color: 'secondary',
      popular: true,
      savings: 'Ahorra S/ 59',
      features: [
        { text: 'Todo lo del plan mensual', included: true },
        { text: 'Envíos gratis en todos los pedidos', included: true },
        { text: '15% descuento en servicios', included: true },
        { text: '20% descuento en productos', included: true },
        { text: 'Soporte prioritario 24/7', included: true },
        { text: 'Acumulación 3x Kunapuntos', included: true },
        { text: 'Acceso anticipado a nuevos productos', included: true },
        { text: '1 consulta veterinaria gratis al mes', included: true },
      ],
    },
  ];

  return (
    <div className="screen-container bg-gray-50 overflow-y-auto">
      <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 px-6 pt-8 pb-12 text-white">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('account')}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-black text-2xl font-bold">Membresía Premium</h1>
          <div className="w-10"></div>
        </div>

        <p className="text-center text-black/90 text-sm mb-4">
          Disfruta de beneficios exclusivos y ahorra en cada compra
        </p>

        <div className="text-black grid grid-cols-4 gap-3">
          {[
            { icon: Truck, text: 'Envíos gratis' },
            { icon: Percent, text: 'Descuentos' },
            { icon: Headphones, text: 'Soporte 24/7' },
            { icon: Zap, text: 'Más puntos' },
          ].map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                <IconComponent className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs font-medium">{benefit.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-6 -mt-6 pb-6 space-y-4">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          const isCurrent = currentPlan === plan.id;
          const colorClasses = {
            gray: 'from-gray-100 to-gray-200 border-gray-300',
            primary: 'from-primary-50 to-primary-100 border-primary-300',
            secondary: 'from-secondary-50 to-secondary-100 border-secondary-300',
          };

          return (
            <div
              key={plan.id}
              className={`relative bg-gradient-to-br ${colorClasses[plan.color as keyof typeof colorClasses]} border-2 rounded-2xl p-6 shadow-md ${
                isCurrent ? 'ring-4 ring-primary-500 ring-opacity-50' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-secondary-500 text-white text-xs px-4 py-1 rounded-full font-bold">
                  MÁS POPULAR
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 right-4 bg-primary-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center">
                  <Check className="w-3 h-3 mr-1" />
                  PLAN ACTUAL
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <IconComponent className={`w-6 h-6 mr-2 ${
                      plan.color === 'gray' ? 'text-gray-600' :
                      plan.color === 'primary' ? 'text-primary-600' :
                      'text-secondary-600'
                    }`} />
                    <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-800">
                      S/ {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-gray-600 ml-1">{plan.period}</span>
                    )}
                  </div>
                  {plan.savings && (
                    <span className="inline-block mt-1 text-xs bg-green-500 text-white px-2 py-1 rounded-full font-medium">
                      {plan.savings}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                      feature.included
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}>
                      {feature.included ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : (
                        <span className="text-white text-xs">✕</span>
                      )}
                    </div>
                    <span className={`text-sm ${
                      feature.included ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {!isCurrent && plan.id !== 'free' && (
                <button
                  onClick={() => handleUpgrade(plan.id as 'monthly' | 'annual')}
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white font-semibold transition-colors ${
                    plan.color === 'primary'
                      ? 'bg-primary-500 hover:bg-primary-600'
                      : 'bg-secondary-500 hover:bg-secondary-600'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Procesando...' : 'Actualizar a este plan'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-6 pb-8">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2">¿Tienes dudas?</h3>
          <p className="text-sm opacity-90 mb-4">
            Nuestro equipo está listo para ayudarte a elegir el mejor plan
          </p>
          <button
            onClick={() => onNavigate('chat')}
            className="w-full py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Contactar soporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumMembership;
