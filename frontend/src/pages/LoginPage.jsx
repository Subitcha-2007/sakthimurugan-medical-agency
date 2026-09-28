import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Building2,
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  Clock,
  XCircle,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Pill,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const { setExplicitTheme } = useTheme();

  // Requirement: Login pages must ALWAYS initially open in LIGHT THEME
  useEffect(() => {
    setExplicitTheme('light');
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [accountStatusInfo, setAccountStatusInfo] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setAccountStatusInfo(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email address and password');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email.trim(), password);

      if (res.success) {
        // Redirect based on user role
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else if (res.user.role === 'staff') {
          navigate('/staff');
        } else {
          navigate(from === '/login' ? '/client-dashboard' : from);
        }
      }
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.accountStatus === 'pending') {
        setAccountStatusInfo({
          type: 'pending',
          title: 'Account Approval Pending',
          message: resp.message || 'Your business account is awaiting admin approval.',
        });
      } else if (resp?.accountStatus === 'rejected') {
        setAccountStatusInfo({
          type: 'rejected',
          title: 'Application Not Approved',
          message: resp.message || 'Your business account application was not approved.',
        });
      } else {
        setErrorMessage(resp?.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
    setAccountStatusInfo(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        
        {/* Top Header Card */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-600 to-medical-800 flex items-center justify-center text-white mx-auto shadow-xl shadow-medical-600/20">
            <Pill className="w-8 h-8 rotate-45" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-slate-600">
            Sakthimurugan Medical Agency &bull; Wholesale Portal Access
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          
          {/* Error / Account Status Alerts */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {accountStatusInfo && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${accountStatusInfo.type === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
              {accountStatusInfo.type === 'pending' ? (
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold">{accountStatusInfo.title}</p>
                <p className="leading-relaxed">{accountStatusInfo.message}</p>
                <p className="text-[11px] text-slate-500 pt-1">
                  For inquiries or drug license clearance, contact <strong>9994446994</strong> or <strong>9865730150</strong>.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="pharmacy@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-medical-600 hover:bg-medical-700 disabled:bg-slate-300 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-medical-600/25 flex items-center justify-center gap-2 transition active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
              One-Click Demo Roles & Test Scenarios:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoAccount('admin@sakthimurugan.com', 'Admin@123')}
                className="p-2 bg-slate-100 hover:bg-medical-50 hover:text-medical-700 rounded-xl text-left border border-slate-200 transition"
              >
                <span className="font-bold block text-slate-900">👑 Admin Portal</span>
                <span className="text-[10px] text-slate-500">Full control & approvals</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoAccount('staff@sakthimurugan.com', 'Staff@123')}
                className="p-2 bg-slate-100 hover:bg-medical-50 hover:text-medical-700 rounded-xl text-left border border-slate-200 transition"
              >
                <span className="font-bold block text-slate-900">📦 Staff Portal</span>
                <span className="text-[10px] text-slate-500">Logistics & packing</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoAccount('client@muruganpharmacy.com', 'Client@123')}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-left border border-emerald-200 transition"
              >
                <span className="font-bold block text-emerald-900">✅ Approved Pharmacy</span>
                <span className="text-[10px] text-emerald-700">Full wholesale ordering</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoAccount('pending@kaverimedicals.com', 'Pending@123')}
                className="p-2 bg-amber-50 hover:bg-amber-100 rounded-xl text-left border border-amber-200 transition"
              >
                <span className="font-bold block text-amber-900">⏳ Pending Account</span>
                <span className="text-[10px] text-amber-700">Tests approval gate</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-slate-500">
            <span>New Medical Shop or Pharmacy? </span>
            <Link to="/register" className="font-bold text-medical-600 hover:underline">
              Register as Business Client &rarr;
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
