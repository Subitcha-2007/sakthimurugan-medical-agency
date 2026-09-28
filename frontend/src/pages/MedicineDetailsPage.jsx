import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Package,
  Calendar,
  Layers,
  Building2,
  ShoppingCart,
  Check,
  AlertCircle,
  Truck,
  FileText,
  ChevronLeft,
  Loader2,
  Info,
  Thermometer,
} from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import MedicineCard from '../components/MedicineCard';

const MedicineDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isApprovedClient } = useAuth();

  const [medicine, setMedicine] = useState(null);
  const [relatedMedicines, setRelatedMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/medicines/${id}`);
        if (res.data.success) {
          setMedicine(res.data.medicine);
          setRelatedMedicines(res.data.relatedMedicines || []);
          setQuantity(1);
        }
      } catch (err) {
        console.error('Error fetching medicine details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-medical-600 mb-3" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading pharmaceutical data...</p>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-center shadow-lg">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Medicine Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The requested product could not be located in our catalog.</p>
        <Link to="/medicines" className="px-5 py-2.5 bg-medical-600 text-white rounded-xl text-xs font-bold">
          Back to Medicines Catalog
        </Link>
      </div>
    );
  }

  const isLowStock = medicine.stock > 0 && medicine.stock <= (medicine.lowStockThreshold || 20);
  const isOutOfStock = medicine.stock <= 0;
  const marginPercent = medicine.mrp && medicine.wholesalePrice
    ? Math.round(((medicine.mrp - medicine.wholesalePrice) / medicine.mrp) * 100)
    : 0;

  const handleAdd = async () => {
    setIsAdding(true);
    await addToCart(medicine._id, quantity);
    setIsAdding(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back link */}
      <div>
        <Link
          to="/medicines"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-medical-600 dark:hover:text-medical-400 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Wholesale Catalog</span>
        </Link>
      </div>

      {/* Main Product Details Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Product Image */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
              <img
                src={medicine.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'}
                alt={medicine.name}
                className="w-full h-full object-cover"
              />
              {marginPercent > 0 && (
                <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-md">
                  {marginPercent}% Retail Margin
                </span>
              )}
            </div>

            {/* Storage temperature alert */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
              <Thermometer className="w-5 h-5 text-medical-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-slate-800 dark:text-white">Cold Chain & Storage Conditions</p>
                <p className="text-slate-500 dark:text-slate-400">{medicine.storageConditions}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & Purchasing Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header & Badges */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-medical-50 dark:bg-medical-950/60 text-medical-700 dark:text-medical-400 text-xs font-bold rounded-lg border border-medical-200 dark:border-medical-800">
                  {medicine.category?.name || 'Pharma Category'}
                </span>
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg">
                  {medicine.dosageForm}
                </span>
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 font-mono text-[11px] text-slate-600 dark:text-slate-300 rounded-lg">
                  HSN: {medicine.hsnCode || '3004'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {medicine.name}
              </h1>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Manufacturer:</span>
                <span className="font-bold text-medical-700 dark:text-medical-400">{medicine.manufacturer}</span>
              </div>
            </div>

            {/* Salt / Generic Composition Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Chemical Composition</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{medicine.genericName}</p>
            </div>

            {/* Price Box */}
            <div className="p-6 bg-gradient-to-br from-medical-50 to-slate-50 dark:from-slate-900 dark:to-slate-900 rounded-2xl border border-medical-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Wholesale Net Price (Per Unit)</span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    ₹{medicine.wholesalePrice?.toFixed(2)}
                  </span>
                  {medicine.mrp && (
                    <span className="text-sm text-slate-400">
                      MRP: <span className="line-through">₹{medicine.mrp?.toFixed(2)}</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  + GST {medicine.gstRate}% applicable &bull; Itemized on Tax Invoice
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-slate-200 dark:sm:border-slate-700 sm:pl-6">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Live Stock Availability</span>
                {isOutOfStock ? (
                  <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-full">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-full">
                    Low Stock ({medicine.stock} units)
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-full">
                    In Stock ({medicine.stock} units)
                  </span>
                )}
              </div>
            </div>

            {/* Batch & Specification Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <p className="text-slate-400 font-medium">Trade Packaging</p>
                <p className="font-bold text-slate-800 dark:text-white mt-0.5">{medicine.packSize}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <p className="text-slate-400 font-medium">Batch Number</p>
                <p className="font-bold text-slate-800 dark:text-white font-mono mt-0.5">{medicine.batchNumber}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <p className="text-slate-400 font-medium">Expiry Date</p>
                <p className="font-bold text-slate-800 dark:text-white mt-0.5">
                  {medicine.expiryDate ? new Date(medicine.expiryDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              
              {/* Quantity Stepper */}
              <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden self-start">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-sm font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={medicine.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(medicine.stock, parseInt(e.target.value) || 1)))}
                  className="w-14 text-center bg-transparent text-sm font-bold text-slate-900 dark:text-white outline-none"
                />
                <button
                  onClick={() => setQuantity((q) => Math.min(medicine.stock, q + 1))}
                  disabled={quantity >= medicine.stock || isOutOfStock}
                  className="px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-sm font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAdd}
                disabled={isOutOfStock || isAdding}
                className="flex-1 py-3.5 px-6 bg-medical-600 hover:bg-medical-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-[0.99]"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {isAdding ? 'Adding to Wholesale Order...' : isOutOfStock ? 'Currently Out of Stock' : `Add ${quantity} Unit(s) to Cart (₹${(quantity * medicine.wholesalePrice).toFixed(2)})`}
                </span>
              </button>

            </div>

            {/* Description & Clinical Information */}
            {medicine.description && (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Therapeutic Indications & Overview</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {medicine.description}
                </p>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Related Products from same category */}
      {relatedMedicines.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Related Formulations in {medicine.category?.name}
            </h2>
            <Link to={`/medicines?category=${medicine.category?.slug}`} className="text-xs font-bold text-medical-600 hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedMedicines.map((rel) => (
              <MedicineCard key={rel._id} medicine={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default MedicineDetailsPage;
