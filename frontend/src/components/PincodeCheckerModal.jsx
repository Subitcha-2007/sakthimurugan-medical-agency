import React, { useState } from 'react';
import { MapPin, X, CheckCircle2, AlertTriangle, Loader2, Navigation } from 'lucide-react';
import api from '../api/axios';

const PincodeCheckerModal = ({ isOpen, onClose }) => {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6) {
      setResult({ serviceable: false, message: 'Please enter a valid 6-digit PIN code.' });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      const res = await api.get(`/pincodes/check/${pincode.trim()}`);
      if (res.data.success) {
        setResult(res.data);
      }
    } catch (err) {
      setResult({
        serviceable: false,
        message: err.response?.data?.message || 'Error verifying pincode. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const samplePincodes = [
    { code: '638001', area: 'Erode Fort (HQ)' },
    { code: '638009', area: 'Perundurai Medical Zone' },
    { code: '639001', area: 'Karur Main' },
    { code: '637001', area: 'Namakkal Central' },
    { code: '636004', area: 'Salem Meyyanur' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-medical-50 dark:bg-medical-950/60 flex items-center justify-center text-medical-600 dark:text-medical-400">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Check Delivery Availability</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enter your pharmacy PIN code to verify serviceability</p>
          </div>
        </div>

        <form onSubmit={handleCheck} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit Pincode (e.g. 638001)"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 text-lg font-semibold tracking-wider text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none"
            />
            <button
              type="submit"
              disabled={loading || pincode.length !== 6}
              className="absolute right-2 top-2 bottom-2 px-5 bg-medical-600 hover:bg-medical-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold rounded-lg flex items-center gap-2 transition"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check'}
            </button>
          </div>
        </form>

        {/* Results */}
        {result && (
          <div className={`mt-5 p-4 rounded-xl border ${result.serviceable ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300'}`}>
            <div className="flex items-start gap-3">
              {result.serviceable ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold text-sm">
                  {result.serviceable ? 'Direct Wholesale Delivery Available' : 'Currently Outside Service Circuit'}
                </p>
                <p className="text-xs">{result.message}</p>
                {result.serviceable && (
                  <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                    <p><span className="font-semibold">Servicing Hub:</span> {result.deliveryArea}</p>
                    <p><span className="font-semibold">Locality:</span> {result.areaName}, {result.district}</p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-bold">⚡ {result.estimatedDeliveryText}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick sample buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Try active regional hubs:</p>
          <div className="flex flex-wrap gap-2">
            {samplePincodes.map((item) => (
              <button
                key={item.code}
                onClick={() => {
                  setPincode(item.code);
                  setResult(null);
                }}
                className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-700/60 hover:bg-medical-50 dark:hover:bg-medical-950/50 hover:text-medical-600 dark:hover:text-medical-400 text-slate-700 dark:text-slate-300 rounded-lg transition border border-slate-200 dark:border-slate-600"
              >
                {item.code} - {item.area}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400">
            Headquarters: 50, 1st Floor, Kamaraj Street, Erode | Helpline: 9994446994
          </p>
        </div>
      </div>
    </div>
  );
};

export default PincodeCheckerModal;
