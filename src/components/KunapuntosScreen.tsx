import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gift, TrendingUp, History, Award, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface KunapuntosScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  userId: string;
}

const KunapuntosScreen: React.FC<KunapuntosScreenProps> = ({ onNavigate, userId }) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');

  useEffect(() => {
    loadKunapuntosData();
  }, [userId]);

  const loadKunapuntosData = async () => {
    const { data: pointsData } = await supabase
      .from('kunapuntos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (pointsData) {
      setTransactions(pointsData);
      const total = pointsData.reduce((sum, item) => sum + item.points, 0);
      setTotalPoints(total);
    }

    const { data: rewardsData } = await supabase
      .from('kunapuntos_rewards')
      .select('*')
      .eq('active', true)
      .order('points_required', { ascending: true });

    if (rewardsData) setRewards(rewardsData);
  };

  const handleRedeemReward = async (reward: any) => {
    if (totalPoints < reward.points_required) {
      alert('No tienes suficientes Kunapuntos');
      return;
    }

    const { error } = await supabase.from('kunapuntos').insert({
      user_id: userId,
      points: -reward.points_required,
      transaction_type: 'redeemed',
      description: `Canjeado: ${reward.name}`,
    });

    if (!error) {
      alert(`¡Has canjeado ${reward.name}!`);
      loadKunapuntosData();
    }
  };

  return (
    <div className="screen-container bg-gray-50">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 pt-8 pb-12 text-white">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Mis Kunapuntos</h1>
          <div className="w-10"></div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Saldo disponible</p>
              <p className="text-5xl font-bold mb-2">{totalPoints}</p>
              <p className="text-sm opacity-75">Kunapuntos acumulados</p>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Gift className="w-10 h-10" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
            <Star className="w-5 h-5 text-yellow-600" fill="currentColor" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Gana más puntos</p>
            <p className="text-xs opacity-75">Por cada S/ 10 en compras = 1 Kunapunto</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6 pb-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'rewards'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500'
              }`}
            >
              <Gift className="w-4 h-4 inline mr-2" />
              Catálogo de Canje
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500'
              }`}
            >
              <History className="w-4 h-4 inline mr-2" />
              Historial
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'rewards' ? (
              <div className="space-y-3">
                {rewards.map((reward) => {
                  const canRedeem = totalPoints >= reward.points_required;
                  return (
                    <div
                      key={reward.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-primary-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{reward.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                          <div className="flex items-center">
                            <Award className="w-4 h-4 text-primary-500 mr-1" />
                            <span className="text-sm font-bold text-primary-600">
                              {reward.points_required} puntos
                            </span>
                            <span className="ml-3 text-sm text-secondary-600 font-medium">
                              {reward.discount_percentage}% descuento
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRedeemReward(reward)}
                        disabled={!canRedeem}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                          canRedeem
                            ? 'bg-primary-500 text-white hover:bg-primary-600'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {canRedeem ? 'Canjear ahora' : `Te faltan ${reward.points_required - totalPoints} puntos`}
                      </button>
                    </div>
                  );
                })}
                {rewards.length === 0 && (
                  <div className="text-center py-8">
                    <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No hay recompensas disponibles</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => {
                  const isPositive = transaction.points > 0;
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            isPositive ? 'bg-green-100' : 'bg-red-100'
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          ) : (
                            <Gift className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-bold ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {transaction.points}
                      </div>
                    </div>
                  );
                })}
                {transactions.length === 0 && (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No hay transacciones</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl p-4 border border-secondary-200">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
            <TrendingUp className="w-5 h-5 text-secondary-600 mr-2" />
            Calculadora de Puntos
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Estima cuántos puntos ganarás en tu próxima compra
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="Monto en S/"
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
              Calcular
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KunapuntosScreen;
