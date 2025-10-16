import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, CreditCard, Smartphone, Banknote, BanknoteIcon } from 'lucide-react';

type Method = 'card' | 'yape' | 'plin' | 'transfer' | 'cash';

interface PaymentMethodsProps {
  total: number;
  onBack: () => void;
  onSuccess: (paymentInfo: { method: Method; reference?: string }) => void;
  onSecurity: () => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ total, onBack, onSuccess, onSecurity }) => {
  const [method, setMethod] = useState<Method>('card');
  const [processing, setProcessing] = useState(false);
  const [reference, setReference] = useState('');

  const submit = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 800));
    onSuccess({ method, reference: reference || undefined });
  };

  const methodButton = (value: Method, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setMethod(value)}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${method === value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}
    >
      {icon}
      <span className="font-semibold text-gray-800">{label}</span>
    </button>
  );

  return (
    <div className="screen-container bg-gray-50">
      <div className="bg-white px-6 pt-8 pb-6 shadow-sm flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Método de Pago</h1>
        <button onClick={onSecurity} className="p-2 rounded-full hover:bg-gray-100">
          <ShieldCheck className="w-6 h-6 text-green-600" />
        </button>
      </div>

      <div className="px-6 py-6 space-y-4">
        {methodButton('card', 'Tarjeta crédito / débito', <CreditCard className="w-5 h-5 text-primary-600" />)}
        {methodButton('yape', 'Yape', <Smartphone className="w-5 h-5 text-purple-600" />)}
        {methodButton('plin', 'Plin', <Smartphone className="w-5 h-5 text-blue-600" />)}
        {methodButton('transfer', 'Transferencia bancaria', <BanknoteIcon className="w-5 h-5 text-emerald-600" />)}
        {methodButton('cash', 'Pago en efectivo', <Banknote className="w-5 h-5 text-amber-600" />)}

        {/* Campo de referencia cuando aplique */}
        {['yape', 'plin', 'transfer'].includes(method) && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="text-sm text-gray-600">Referencia (opcional)</label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Código de operación / referencia"
              className="mt-2 w-full bg-gray-100 rounded-lg px-3 py-2 focus:outline-none"
            />
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total a pagar</span>
            <span className="text-xl font-bold text-gray-800">S/ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border-t">
        <button
          onClick={submit}
          disabled={processing}
          className={`w-full py-3 rounded-xl font-semibold text-white ${processing ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'} transition-colors`}
        >
          {processing ? 'Procesando...' : 'Confirmar Pago'}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethods;