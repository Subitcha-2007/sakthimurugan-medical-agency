import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, ShieldCheck, MapPin, Award, Truck, HeartHandshake, FileCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-medical-500/10 text-medical-400 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Genuine Pharma</h4>
              <p className="text-xs text-slate-400 mt-1">Direct authorized supply from top Indian & multinational pharmaceutical manufacturers.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Regional Cold Chain</h4>
              <p className="text-xs text-slate-400 mt-1">Dedicated daily dispatch circuits across Erode, Karur, Namakkal & Salem.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-medical-500/10 text-medical-400 flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">GST & Drug Law Compliant</h4>
              <p className="text-xs text-slate-400 mt-1">Legitimate Form 20B/21B wholesale billing with itemized HSN & GST breakdowns.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">B2B Trade Credit</h4>
              <p className="text-xs text-slate-400 mt-1">Flexible 30-day settlement terms for verified & approved medical stores.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-slate-800">
          
          {/* Company Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-medical-600 flex items-center justify-center text-white font-bold">
                SMA
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">SAKTHIMURUGAN MEDICAL AGENCY</h3>
                <p className="text-xs text-medical-400 font-semibold uppercase">Wholesale Medicine Distribution</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              "Your Trusted Wholesale Medicine Partner" — wholesale medicine supply and business order management for medical shops, pharmacies, registered clinics, and authorized wholesale buyers across our service regions.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>50, 1st Floor, Kamaraj Street, Erode, Tamil Nadu - 638001</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-white font-semibold">9994446994 / 9865730150</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-medical-400 flex-shrink-0" />
                <span>orders@sakthimuruganmedicals.com</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Wholesale Catalog</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/medicines?category=antibiotics" className="hover:text-white transition">Antibiotics & Anti-Infectives</Link></li>
              <li><Link to="/medicines?category=cardiovascular" className="hover:text-white transition">Cardiovascular & Cardiac Care</Link></li>
              <li><Link to="/medicines?category=anti-diabetic" className="hover:text-white transition">Anti-Diabetic Therapeutics</Link></li>
              <li><Link to="/medicines?category=pain-relief" className="hover:text-white transition">Analgesics & NSAIDs</Link></li>
              <li><Link to="/medicines?category=gastrointestinal" className="hover:text-white transition">Gastrointestinal & PPIs</Link></li>
              <li><Link to="/medicines?category=critical-care" className="hover:text-white transition">IV Infusions & Emergency Fluids</Link></li>
            </ul>
          </div>

          {/* Proposed Service Regions */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Service Regions</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Erode District (HQ Hub)</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Karur Industrial & Medical</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Namakkal Healthcare Hub</span>
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Salem Metro & Hospital Zone</span>
              </li>
              <li className="pt-2">
                <Link to="/delivery-areas" className="text-medical-400 hover:text-medical-300 font-semibold underline">
                  View Serviced PIN Codes &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Business & Legal */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">B2B Client Portal</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/register" className="hover:text-white transition">Register Medical Shop</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Client / Staff Login</Link></li>
              <li><Link to="/client-dashboard" className="hover:text-white transition">Account & Invoices</Link></li>
              <li><Link to="/about-contact" className="hover:text-white transition">Drug License Verification</Link></li>
              <li><Link to="/about-contact" className="hover:text-white transition">Agency Terms of Wholesale</Link></li>
            </ul>
          </div>

        </div>

        {/* Regulatory Disclaimers & Copyright */}
        <div className="pt-8 text-xs text-slate-500 space-y-3">
          <p className="leading-relaxed">
            <span className="font-semibold text-slate-400">Pharmaceutical Regulatory Notice:</span> Sakthimurugan Medical Agency is a licensed wholesale pharmaceutical distributor operating under Form 20B & 21B granted under the Drugs and Cosmetics Act, 1940 and Rules thereunder. Supplies are made strictly to licensed retail chemists, hospital pharmacies, registered medical practitioners, and authorized institutions holding valid drug licenses.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-[11px]">
            <p>&copy; {new Date().getFullYear()} SAKTHIMURUGAN MEDICAL AGENCY. All Rights Reserved. Erode, Tamil Nadu.</p>
            <p className="flex items-center gap-4 text-slate-400">
              <span>GSTIN: 33AABCS1234F1Z8</span>
              <span>&bull;</span>
              <span>DL No: TN/ERD/20B/10492 & 21B/10493</span>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
