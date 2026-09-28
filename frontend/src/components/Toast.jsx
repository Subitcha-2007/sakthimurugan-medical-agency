import React from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  const bgColors = {
    success: 'bg-emerald-600 text-white shadow-emerald-500/20',
    error: 'bg-rose-600 text-white shadow-rose-500/20',
    warning: 'bg-amber-600 text-white shadow-amber-500/20',
    info: 'bg-medical-600 text-white shadow-medical-500/20',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    info: <Info className="w-5 h-5 flex-shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl font-medium text-sm border border-white/10 ${bgColors[type] || bgColors.info}`}>
        {icons[type] || icons.info}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
