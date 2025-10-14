import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Crown, Gift, Truck, BookOpen, LogOut, ChevronRight, Settings, Bell, Shield, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import logoImg from '../assets/WhatsApp Image 2025-10-08 at 3.14.40 PM.png';

interface AccountScreenProps {
  onNavigate: (screen: string) => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ onNavigate }) => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [membership, setMembership] = useState<any>(null);
  const [kunapuntos, setKunapuntos] = useState(0);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileData) setProfile(profileData);

    const { data: membershipData } = await supabase
      .from('memberships')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (membershipData) setMembership(membershipData);

    const { data: pointsData } = await supabase
      .from('kunapuntos')
      .select('points')
      .eq('user_id', user.id);

    if (pointsData) {
      const total = pointsData.reduce((sum, item) => sum + item.points, 0);
      setKunapuntos(total);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigate('auth');
  };

  const menuSections = [
    {
      title: 'Beneficios',
      items: [
        {
          id: 'kunapuntos',
          icon: Gift,
          label: 'Mis Kunapuntos',
          value: kunapuntos.toString(),
          color: 'text-primary-600',
          bgColor: 'bg-primary-100',
        },
        {
          id: 'membership',
          icon: Crown,
          label: 'Membresía Premium',
          value: membership?.plan_type === 'free' ? 'Gratis' : 'Premium',
          color: 'text-secondary-600',
          bgColor: 'bg-secondary-100',
        },
      ],
    },
    {
      title: 'Para Proveedores',
      items: [
        {
          id: 'provider-panel',
          icon: BookOpen,
          label: 'Panel de Aliado',
          value: '',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
        },
      ],
    },
    {
      title: 'Configuración',
      items: [
        {
          id: 'settings',
          icon: Settings,
          label: 'Configuración',
          value: '',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        },
        {
          id: 'notifications',
          icon: Bell,
          label: 'Notificaciones',
          value: '',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        },
        {
          id: 'privacy',
          icon: Shield,
          label: 'Privacidad',
          value: '',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        },
        {
          id: 'help',
          icon: HelpCircle,
          label: 'Ayuda y Soporte',
          value: '',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        },
      ],
    },
  ];

  const handleMenuClick = (id: string) => {
    if (id === 'kunapuntos') {
      onNavigate('kunapuntos');
    } else if (id === 'membership') {
      onNavigate('membership');
    } else if (id === 'provider-panel') {
      onNavigate('provider-panel');
    } else if (id === 'help') {
      onNavigate('chat');
    } else if (id === 'notifications') {
      onNavigate('notifications');
    }
  };

  return (
    <div className="screen-container bg-gray-50">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 pt-8 pb-20 text-white">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img src={logoImg} alt="Kunapet" className="h-8" />
          <div className="w-10"></div>
        </div>

        <div className="flex items-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-4">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-primary-600" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">{profile?.full_name || 'Usuario'}</h2>
            <p className="text-white/80 text-sm">{profile?.email}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-12 pb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('kunapuntos')}
              className="text-center p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
            >
              <Gift className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary-600 mb-1">{kunapuntos}</p>
              <p className="text-xs text-gray-600">Kunapuntos</p>
            </button>
            <button
              onClick={() => onNavigate('membership')}
              className="text-center p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors"
            >
              <Crown className="w-8 h-8 text-secondary-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-secondary-600 mb-1">
                {membership?.plan_type === 'free' ? 'Gratis' : 'Premium'}
              </p>
              <p className="text-xs text-gray-600">Membresía</p>
            </button>
          </div>
        </div>

        {menuSections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 px-2">
              {section.title}
            </h3>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                      itemIndex !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${item.bgColor} rounded-xl flex items-center justify-center mr-4`}>
                        <IconComponent className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{item.label}</p>
                        {item.value && (
                          <p className="text-sm text-gray-500">{item.value}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button
          onClick={handleSignOut}
          className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center text-red-600 font-medium hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Cerrar Sesión
        </button>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Kunapet v1.0.0 • Hecho con amor para tus mascotas
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountScreen;
