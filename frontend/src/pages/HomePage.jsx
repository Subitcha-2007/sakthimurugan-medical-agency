import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Truck,
  ArrowRight,
  Sparkles,
  Building2,
  Package,
  Award,
  CheckCircle2,
  PhoneCall,
  Clock,
  Layers,
  FileCheck2,
  CreditCard,
  ChevronRight,
  Pill,
} from 'lucide-react';
import api from '../api/axios';
import MedicineCard from '../components/MedicineCard';
import PincodeCheckerModal from '../components/PincodeCheckerModal';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredMedicines, setFeaturedMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [medRes, catRes, areaRes] = await Promise.all([
          api.get('/medicines?isFeatured=true&limit=8'),
          api.get('/categories'),
          api.get('/delivery-areas'),
        ]);

        if (medRes.data.success) {
          setFeaturedMedicines(medRes.data.medicines || []);
        }
        if (catRes.data.success) {
          setCategories(catRes.data.categories || []);
        }
        if (areaRes.data.success) {
          setDeliveryAreas(areaRes.data.areas || []);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKey.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(searchKey.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-medical-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 pt-12 pb-20 border-b border-slate-200/80 dark:border-slate-800">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-medical-400/10 dark:bg-medical-500/5 blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-medical-100/80 dark:bg-medical-950/80 border border-medical-200 dark:border-medical-800 text-medical-800 dark:text-medical-300 text-xs font-bold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-medical-600 dark:text-medical-400" />
                <span>Authorized Pharmaceutical Wholesale Distributor &bull; Erode</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Your Trusted Wholesale Medicine Partner
              </h1>

              {/* Supporting Subheading */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Wholesale medicine supply and business order management for medical shops and registered customers across our service areas.
              </p>

              {/* Interactive Search Bar on Hero */}
              <form onSubmit={handleSearch} className="max-w-xl mx-auto lg:mx-0 pt-2">
                <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-xl shadow-medical-900/5 border border-slate-200 dark:border-slate-700">
                  <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search brand, active salt, generic name, or manufacturer..."
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    className="w-full px-3 py-2.5 bg-transparent text-sm text-slate-800 dark:text-white outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs rounded-xl shadow-md transition whitespace-nowrap"
                  >
                    Find Medicines
                  </button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/medicines"
                  className="px-6 py-3.5 bg-medical-600 hover:bg-medical-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-medical-600/25 flex items-center gap-2 transition"
                >
                  <Pill className="w-4 h-4" />
                  <span>Browse Medicines</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setIsPincodeModalOpen(true)}
                  className="px-5 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl font-bold text-sm border border-slate-300 dark:border-slate-600 shadow-sm flex items-center gap-2 transition"
                >
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>Check Delivery Availability</span>
                </button>

                <Link
                  to="/register"
                  className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Register as Business Client</span>
                </Link>
              </div>

              {/* Quick Info Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">1,000+</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Wholesale Formulations</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-medical-600 dark:text-medical-400">4 Regions</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Erode, Karur, Namakkal, Salem</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">GST & Form 20B Verified</p>
                </div>
              </div>

            </div>

            {/* Right Card / Visual Banner */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
                
                {/* Agency HQ Badge Card */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-medical-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-medical-600/20">
                      SMA
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">SAKTHIMURUGAN</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Medical Agency &bull; Central Hub</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                    Live Wholesale
                  </span>
                </div>

                {/* Regional Dispatch Radar */}
                <div className="py-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-medical-600" />
                      <span>Proposed Service Regions</span>
                    </span>
                    <span className="text-emerald-600 font-bold">Active Circuits</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-800 dark:text-white">Erode Hub</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Same Day Dispatch</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-800 dark:text-white">Karur Circuit</p>
                      <p className="text-[10px] text-medical-600 dark:text-medical-400 font-semibold">Next Morning Route</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-800 dark:text-white">Namakkal Sector</p>
                      <p className="text-[10px] text-medical-600 dark:text-medical-400 font-semibold">Daily Medical Transit</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-800 dark:text-white">Salem Zone</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Hospital Supply Lines</p>
                    </div>
                  </div>
                </div>

                {/* Headquarters Box */}
                <div className="p-4 bg-medical-50 dark:bg-medical-950/40 rounded-2xl border border-medical-200 dark:border-medical-800 text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Central Wholesale Headquarters</p>
                      <p className="text-slate-600 dark:text-slate-400">50, 1st Floor, Kamaraj Street, Erode, Tamil Nadu</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-medical-200 dark:border-medical-800 text-medical-800 dark:text-medical-300 font-semibold">
                    <span className="flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                      <span>9994446994</span>
                    </span>
                    <span>9865730150</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. MEDICINE CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-medical-600 dark:text-medical-400">
              Wholesale Therapeutic Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Browse by Clinical Speciality
            </h2>
          </div>
          <Link
            to="/medicines"
            className="text-xs sm:text-sm font-bold text-medical-600 dark:text-medical-400 hover:text-medical-700 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/medicines?category=${cat.slug}`}
              className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-medical-400 dark:hover:border-medical-500 shadow-sm hover:shadow-lg transition text-center group flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-medical-50 dark:bg-medical-950/60 text-medical-600 dark:text-medical-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-medical-600 group-hover:text-white transition duration-200">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-medical-600 dark:group-hover:text-medical-400 transition">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {cat.medicineCount || 'Multiple'} Items
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED WHOLESALE MEDICINES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              High-Demand Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Featured Wholesale Medicines
            </h2>
          </div>
          <Link
            to="/medicines"
            className="text-xs sm:text-sm font-bold text-medical-600 dark:text-medical-400 hover:text-medical-700 flex items-center gap-1 group"
          >
            <span>Explore Full Wholesale Catalog</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Medicines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMedicines.map((med) => (
            <MedicineCard key={med._id} medicine={med} />
          ))}
        </div>
      </section>

      {/* 4. WHOLESALE BENEFITS (Why Retailers & Hospitals Choose Sakthimurugan) */}
      <section className="bg-slate-100/80 dark:bg-slate-800/50 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-medical-600 dark:text-medical-400">
              Wholesale Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Built Specifically for Retail Pharmacies & Hospitals
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              We streamline wholesale procurement with certified authenticity, wholesale pricing structures, and scheduled regional delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-medical-50 dark:bg-medical-950/60 text-medical-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">100% Genuine Drug Quality</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Direct authorized sourcing from Sun Pharma, Cipla, GSK, Torrent, Alkem, Glenmark, and Dr. Reddy's. Temperature-controlled cold chain for heat-sensitive injectables and biologicals.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Express Regional Dispatch</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Daily scheduled delivery vans serving medical stores and hospital clinics across Erode, Karur, Namakkal, and Salem with real-time status dispatch tracking.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-medical-50 dark:bg-medical-950/60 text-medical-600 flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">GST Invoicing & B2B Credit</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Instant digital pro-forma and Tax Invoices with itemized HSN codes and GST percentages. 30-day revolving credit line available for approved wholesale accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROPOSED SERVICE REGIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-medical-600 dark:text-medical-400">
                Logistics Network
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Proposed Service Regions
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Sakthimurugan Medical Agency operates daily distribution routes covering prime commercial, industrial, and hospital centers across 4 key Western Tamil Nadu districts:
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                {deliveryAreas.map((area) => (
                  <div key={area._id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{area.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">District: {area.district}</p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{area.estimatedDeliveryTime}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setIsPincodeModalOpen(true)}
                  className="px-5 py-2.5 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  Verify Your Medical Shop Pincode &rarr;
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 bg-gradient-to-br from-medical-900 to-slate-900 rounded-2xl p-6 text-white space-y-4">
              <h3 className="text-lg font-bold">Direct Wholesale Distribution Route</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Never claim guaranteed delivery unless verified in our system. Enter your 6-digit PIN code to check live service route availability.
              </p>
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 space-y-2">
                <p className="text-xs text-medical-200 font-semibold uppercase">Headquarters Fulfillment Center:</p>
                <p className="text-sm font-bold">50, 1st Floor, Kamaraj Street, Erode, Tamil Nadu - 638001</p>
                <p className="text-xs text-emerald-300">Dispatch Team Helpline: 9994446994 / 9865730150</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. HOW ORDERING WORKS (Step 1-4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-medical-600 dark:text-medical-400">
            Workflow & Compliance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            How B2B Wholesale Ordering Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-medical-600 text-white font-extrabold flex items-center justify-center mx-auto text-sm">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Business Registration</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submit your pharmacy/clinic details and Drug License (Form 20B/21B). Account is placed in PENDING status.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-medical-600 text-white font-extrabold flex items-center justify-center mx-auto text-sm">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Admin Approval</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Agency admin validates drug license and business credentials, clearing your account to APPROVED status.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-medical-600 text-white font-extrabold flex items-center justify-center mx-auto text-sm">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Browse & Order</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access wholesale prices, build your order with real-time stock checks, and checkout to your delivery address.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center mx-auto text-sm">
              4
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Delivery & Tax Invoice</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Agency van dispatches your order with complete GST Tax Invoice, batch tracking, and delivery handover.
            </p>
          </div>
        </div>
      </section>

      {/* 7. BUSINESS REGISTRATION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-medical-800 via-medical-700 to-medical-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
              Register Your Medical Shop Today
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Get Wholesale Medicine Supply for Your Pharmacy
            </h2>
            <p className="text-sm text-medical-100 leading-relaxed">
              Join dozens of registered medical shops and hospitals across Erode, Karur, Namakkal, and Salem who trust Sakthimurugan Medical Agency for daily pharmaceutical replenishment.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/register"
                className="px-6 py-3.5 bg-white text-medical-900 hover:bg-medical-50 rounded-xl font-extrabold text-sm shadow-lg transition"
              >
                Create Business Account &rarr;
              </Link>
              <Link
                to="/about-contact"
                className="px-6 py-3.5 bg-medical-900/50 hover:bg-medical-900/80 text-white rounded-xl font-bold text-sm border border-white/20 transition"
              >
                Contact Wholesale Desk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pincode Modal */}
      <PincodeCheckerModal isOpen={isPincodeModalOpen} onClose={() => setIsPincodeModalOpen(false)} />

    </div>
  );
};

export default HomePage;
