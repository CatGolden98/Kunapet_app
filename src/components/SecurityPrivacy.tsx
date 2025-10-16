import React from 'react';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

interface SecurityPrivacyProps {
  onBack: () => void;
}

const SecurityPrivacy: React.FC<SecurityPrivacyProps> = ({ onBack }) => {
  return (
    <div className="screen-container bg-gray-50">
      <div className="bg-white px-6 pt-8 pb-6 shadow-sm flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Seguridad y Privacidad</h1>
        <div className="w-10" />
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Conexión Segura</p>
            <p className="text-sm text-gray-600">Tus datos están protegidos con cifrado TLS/SSL.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold text-gray-900 mb-2">Certificado de Seguridad SSL</p>
          <p className="text-sm text-gray-700">
            Empleamos certificados SSL para cifrar la comunicación entre tu navegador y nuestros servidores,
            evitando accesos no autorizados y protegiendo tu información.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-gray-600" />
            <p className="font-bold text-gray-900">Política de Privacidad (Ley N° 29733)</p>
          </div>
          <p className="text-sm text-gray-700">
            Tratamos tus datos personales conforme a la Ley de Protección de Datos Personales (Ley N° 29733).
            Solo usaremos tu información para brindarte nuestros servicios y mejorar tu experiencia.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityPrivacy;