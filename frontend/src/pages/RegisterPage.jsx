import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ArrowRight,
  UploadCloud,
  FileText,
  Lock,
  Phone,
  Mail,
  User,
  MapPin,
  Pill,
} from 'lucide-react';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setExplicitTheme } = useTheme();

  // Initially open in light theme
  useEffect(() => {
    setExplicitTheme('light');
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    businessType: 'Pharmacy / Medical Shop',
    drugLicenseNumber: '',
    gstin: '',
    addressLine: '',
    city: 'Erode',
    district: 'Erode',
    state: 'Tamil Nadu',
    pincode: '638001',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successResponse, setSuccessResponse] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!formData.drugLicenseNumber) {
      setErrorMessage('Please provide your retail / wholesale Drug License Number (Form 20B / 21B).');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        setSuccessResponse(res.data);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-600 to-medical-800 flex items-center justify-center text-white mx-auto shadow-xl shadow-medical-600/20">
            <Pill className="w-8 h-8 rotate-45" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Register as B2B Business Client
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Authorized pharmaceutical wholesale ordering for registered retail chemists, medical shops, hospitals, and clinics.
          </p>
        </div>

        {/* Success Modal / Card if registration submitted */}
        {successResponse ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto">
              <Clock className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
                Application Status: PENDING ADMIN APPROVAL
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                Registration Request Submitted!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-3 leading-relaxed">
                "Your registration request has been submitted successfully. Your account is currently awaiting admin approval."
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <p><span className="font-bold text-slate-900">Applicant:</span> {formData.name}</p>
              <p><span className="font-bold text-slate-900">Establishment:</span> {formData.shopName}</p>
              <p><span className="font-bold text-slate-900">Drug License:</span> {formData.drugLicenseNumber}</p>
              <p><span className="font-bold text-slate-900">Location:</span> {formData.city}, {formData.district} - {formData.pincode}</p>
            </div>

            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our Erode central office will verify your submitted drug license with the Drug Control Administration. You will receive login access as soon as the administrator approves your request.
            </p>

            <div className="pt-4 flex justify-center gap-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-bold shadow"
              >
                Go to Login Screen
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-8">
            
            {/* Compliance notice */}
            <div className="p-4 bg-medical-50 border border-medical-200 rounded-2xl flex items-start gap-3 text-medical-900 text-xs">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 text-medical-600 mt-0.5" />
              <div>
                <span className="font-bold">Form 20B/21B Wholesale Compliance:</span>
                <p className="mt-0.5 text-medical-800">
                  Medicines are supplied strictly to licensed retail chemists and hospitals. Accounts undergo mandatory admin approval prior to wholesale catalog ordering.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section 1: Personal & Account Credentials */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <User className="w-4 h-4 text-medical-600" />
                  <span>1. Applicant / Pharmacist Credentials</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Dr. / Mr. / Ms. Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="pharmacy@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Business & Pharmacy Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Building2 className="w-4 h-4 text-medical-600" />
                  <span>2. Business & Medical Establishment Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Shop / Business Name *</label>
                    <input
                      type="text"
                      name="shopName"
                      required
                      placeholder="e.g. Murugan Medicals & Super Pharmacy"
                      value={formData.shopName}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Business Type *</label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                    >
                      <option value="Pharmacy / Medical Shop">Pharmacy / Medical Shop</option>
                      <option value="Hospital / Clinic">Hospital / Clinic</option>
                      <option value="Wholesale Distributor">Wholesale Distributor</option>
                      <option value="Nursing Home">Nursing Home</option>
                      <option value="Other">Other Healthcare Entity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Drug License Number (Form 20B / 21B) *
                    </label>
                    <input
                      type="text"
                      name="drugLicenseNumber"
                      required
                      placeholder="e.g. TN/ERD/20B/88921"
                      value={formData.drugLicenseNumber}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-medical-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN (Optional)</label>
                    <input
                      type="text"
                      name="gstin"
                      placeholder="33AAAAA0000A1Z5"
                      value={formData.gstin}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-medical-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Address Line *</label>
                    <input
                      type="text"
                      name="addressLine"
                      required
                      placeholder="Shop No, Street, Road Name"
                      value={formData.addressLine}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">District *</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                    >
                      <option value="Erode">Erode</option>
                      <option value="Karur">Karur</option>
                      <option value="Namakkal">Namakkal</option>
                      <option value="Salem">Salem</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength="6"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold tracking-wider focus:ring-2 focus:ring-medical-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      disabled
                      value={formData.state}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-medical-600 hover:bg-medical-700 disabled:bg-slate-300 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-medical-600/25 flex items-center justify-center gap-2 transition active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Application to Agency Compliance...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Business Application for Admin Approval</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500">
              <span>Already have an approved account? </span>
              <Link to="/login" className="font-bold text-medical-600 hover:underline">
                Sign In to Wholesale Portal &rarr;
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default RegisterPage;
