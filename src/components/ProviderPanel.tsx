import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Truck, Package, CheckCircle, Clock, Award, MapPin, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProviderPanelProps {
  onNavigate: (screen: string, data?: any) => void;
  userId: string;
}

const ProviderPanel: React.FC<ProviderPanelProps> = ({ onNavigate, userId }) => {
  const [activeTab, setActiveTab] = useState<'training' | 'logistics'>('training');
  const [provider, setProvider] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [providerTraining, setProviderTraining] = useState<any[]>([]);
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);

  useEffect(() => {
    loadProviderData();
  }, [userId]);

  const loadProviderData = async () => {
    const { data: providerData } = await supabase
      .from('providers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (providerData) {
      setProvider(providerData);
      setDeliveryEnabled(providerData.delivery_available);
    }

    const { data: coursesData } = await supabase
      .from('training_courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (coursesData) setCourses(coursesData);

    if (providerData) {
      const { data: trainingData } = await supabase
        .from('provider_training')
        .select('*, training_courses(*)')
        .eq('provider_id', providerData.id);

      if (trainingData) setProviderTraining(trainingData);
    }
  };

  const handleToggleDelivery = async () => {
    if (!provider) return;

    const newValue = !deliveryEnabled;
    const { error } = await supabase
      .from('providers')
      .update({ delivery_available: newValue })
      .eq('id', provider.id);

    if (!error) {
      setDeliveryEnabled(newValue);
    }
  };

  const handleStartCourse = async (courseId: string) => {
    if (!provider) return;

    const { error } = await supabase.from('provider_training').insert({
      provider_id: provider.id,
      course_id: courseId,
      progress_percentage: 0,
      completed: false,
    });

    if (!error) {
      loadProviderData();
    }
  };

  const getCourseProgress = (courseId: string) => {
    const training = providerTraining.find(t => t.course_id === courseId);
    return training ? training.progress_percentage : 0;
  };

  const isCourseEnrolled = (courseId: string) => {
    return providerTraining.some(t => t.course_id === courseId);
  };

  return (
    <div className="screen-container bg-gray-50">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 pt-8 pb-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Panel de Aliado</h1>
          <button
            onClick={() => onNavigate('provider-settings')}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {provider && (
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold">{provider.business_name}</p>
                <div className="flex items-center text-sm">
                  <Award className="w-4 h-4 mr-1" />
                  <span>{provider.rating.toFixed(1)} • {provider.total_reviews} reseñas</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('training')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'training'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Capacitación
            </button>
            <button
              onClick={() => setActiveTab('logistics')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'logistics'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500'
              }`}
            >
              <Truck className="w-4 h-4 inline mr-2" />
              Logística
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'training' ? (
              <div className="space-y-4">
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Award className="w-5 h-5 text-primary-600 mr-2" />
                    Microcursos Virtuales
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Mejora tus habilidades y obtén certificaciones reconocidas
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      {providerTraining.filter(t => t.completed).length} completados
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                      {providerTraining.filter(t => !t.completed).length} en progreso
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {courses.map((course) => {
                    const progress = getCourseProgress(course.id);
                    const enrolled = isCourseEnrolled(course.id);

                    return (
                      <div
                        key={course.id}
                        className="border border-gray-200 rounded-xl p-4 hover:border-primary-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <BookOpen className="w-4 h-4 text-primary-600 mr-2" />
                              <h4 className="font-semibold text-gray-800">{course.title}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {course.duration_hours}h
                              </span>
                              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
                                {course.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {enrolled ? (
                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">Progreso</span>
                              <span className="font-semibold text-primary-600">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                              <div
                                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <button className="w-full py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                              Continuar curso
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartCourse(course.id)}
                            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            Comenzar curso
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {courses.length === 0 && (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No hay cursos disponibles</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Truck className="w-5 h-5 text-secondary-600 mr-2" />
                    Delivery Pet-Friendly
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Activa el servicio de entrega a domicilio para tus productos
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Estado del servicio</span>
                    <button
                      onClick={handleToggleDelivery}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        deliveryEnabled ? 'bg-primary-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          deliveryEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {deliveryEnabled && (
                  <>
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <MapPin className="w-4 h-4 text-primary-600 mr-2" />
                        Configurar zonas de cobertura
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Radio de entrega (km)</label>
                          <input
                            type="number"
                            defaultValue="5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Tarifa de envío (S/)</label>
                          <input
                            type="number"
                            step="0.1"
                            defaultValue="10"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Tiempo estimado (minutos)</label>
                          <input
                            type="number"
                            defaultValue="45"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <button className="w-full py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                          Guardar configuración
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Pedidos en tiempo real</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Pendientes</span>
                          <span className="font-semibold text-yellow-600">3</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">En camino</span>
                          <span className="font-semibold text-blue-600">5</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">Entregados hoy</span>
                          <span className="font-semibold text-green-600">12</span>
                        </div>
                      </div>
                      <button className="w-full mt-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Ver todos los pedidos
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderPanel;
