import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Truck,
  CheckCircle2,
  FileCheck2,
  Clock,
  Send,
  HeartHandshake,
  Pill,
} from 'lucide-react';

const AboutContactPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inquiry, setInquiry] = useState({
    name: '',
    phone: '',
    email: '',
    shopName: '',
    city: 'Erode',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Hero / About Company Header */}
      <div className="bg-gradient-to-r from-medical-900 via-medical-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Licensed Wholesale Pharmaceutical Distributor &bull; Est. Erode</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Your Trusted Wholesale Medicine Partner
        </h1>

        <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed">
          Wholesale medicine supply and business order management for medical shops and registered customers across our service areas.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
          <div>
            <p className="text-slate-400 font-medium">Headquarters</p>
            <p className="font-bold text-white mt-0.5">Erode, Tamil Nadu</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Wholesale Drug Licenses</p>
            <p className="font-bold text-emerald-400 mt-0.5 font-mono">Form 20B & 21B Authorized</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Direct Helplines</p>
            <p className="font-bold text-white mt-0.5 font-mono">9994446994 / 9865730150</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Distribution Coverage</p>
            <p className="font-bold text-white mt-0.5">Erode, Karur, Namakkal, Salem</p>
          </div>
        </div>
      </div>

      {/* Corporate Credentials & Target Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: About Agency Mission & Target Customers */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-medical-600 dark:text-medical-400">
            About Our Wholesale Operations
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Professional Pharmaceutical Supply Chain
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Sakthimurugan Medical Agency is a dedicated B2B wholesale pharmaceutical distributor based in Erode, Tamil Nadu. We bridge leading multinational and Indian drug manufacturers with regional retail chemists, community pharmacies, and healthcare institutions.
          </p>

          {/* Target Customers */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Authorized Customer Groups Served:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                'Retail Medical Shops & Chemists',
                'Community & Hospital Pharmacies',
                'Registered Nursing Homes & Clinics',
                'Authorized Wholesale Buyers',
                'Registered Business Customers',
                'Government & Private Institutions',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory License Box */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <h4 className="font-extrabold uppercase text-[11px] text-medical-600">Regulatory Certifications:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-slate-700 dark:text-slate-300">
              <p><strong>Wholesale Drug License:</strong> TN/ERD/20B/10492 & 21B/10493</p>
              <p><strong>GST Identification Number:</strong> 33AABCS1234F1Z8</p>
              <p><strong>Permanent Account Number:</strong> AABCS1234F</p>
              <p><strong>FSSAI Food Safety Reg:</strong> 12419008000451</p>
            </div>
          </div>
        </div>

        {/* Right: Contact & Dispatch Desk */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-medical-600 dark:text-medical-400">
            Headquarters & Desk
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Get in Touch
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <MapPin className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Central Headquarters & Hub</p>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  50, 1st Floor, Kamaraj Street, Erode, Tamil Nadu - 638001
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Wholesale Booking Helplines</p>
                <p className="font-mono text-slate-900 dark:text-white font-bold text-sm mt-1">9994446994</p>
                <p className="font-mono text-slate-900 dark:text-white font-bold text-sm">9865730150</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Mon – Sat: 9:00 AM – 9:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Mail className="w-5 h-5 text-medical-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Email Correspondence</p>
                <p className="text-slate-700 dark:text-slate-300 font-semibold mt-1">orders@sakthimuruganmedicals.com</p>
                <p className="text-[11px] text-slate-400">Response within 2 hours during trade hours</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Quick B2B Business Inquiry Form */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12 shadow-xl">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-medical-600 dark:text-medical-400">
              Medical Store & Hospital Inquiries
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Send Wholesale Inquiry to Our Desk
            </h3>
            <p className="text-xs text-slate-500">
              Need bulk institutional rates, hospital rate contracts, or service region expansion inquiries?
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">Inquiry Received!</h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-400">
                Our wholesale executive at Kamaraj Street, Erode will call you at <strong>{inquiry.phone}</strong> shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pharmacist / Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={inquiry.name}
                    onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9994446994"
                    value={inquiry.phone}
                    onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pharmacy / Hospital Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City Health Pharmacy"
                    value={inquiry.shopName}
                    onChange={(e) => setInquiry({ ...inquiry, shopName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location District *</label>
                  <select
                    value={inquiry.city}
                    onChange={(e) => setInquiry({ ...inquiry, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl outline-none text-slate-900 dark:text-white"
                  >
                    <option value="Erode">Erode</option>
                    <option value="Karur">Karur</option>
                    <option value="Namakkal">Namakkal</option>
                    <option value="Salem">Salem</option>
                    <option value="Other">Other Western TN Area</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Inquiry / Drug Requirement Details</label>
                <textarea
                  rows="3"
                  placeholder="Mention requested formulations, brands, or trade credit terms..."
                  value={inquiry.message}
                  onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl outline-none text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-medical-600 hover:bg-medical-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-medical-600/25 flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry to Agency Desk</span>
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
};

export default AboutContactPage;
