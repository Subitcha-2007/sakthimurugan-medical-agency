import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, AlertCircle, Eye, Building2, Package, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const MedicineCard = ({ medicine }) => {
  const { addToCart, loading } = useCart();
  const { user, isApprovedClient } = useAuth();
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const discountPercent = medicine.mrp && medicine.wholesalePrice
    ? Math.round(((medicine.mrp - medicine.wholesalePrice) / medicine.mrp) * 100)
    : 0;

  const isLowStock = medicine.stock > 0 && medicine.stock <= (medicine.lowStockThreshold || 20);
  const isOutOfStock = medicine.stock <= 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(medicine._id, qty);
    setIsAdding(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-medical-300 dark:hover:border-medical-700 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Media & Badges */}
      <div className="relative p-4 pb-0">
        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative">
          <img
            src={medicine.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'}
            alt={medicine.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Discount Margin Badge */}
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
              {discountPercent}% Margin
            </span>
          )}

          {/* Dosage form badge */}
          <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
            {medicine.dosageForm}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Manufacturer & Category */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-medical-700 dark:text-medical-400 truncate max-w-[65%]">
              {medicine.manufacturer}
            </span>
            <span className="text-[11px] bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
              {medicine.category?.name || 'Pharma'}
            </span>
          </div>

          {/* Brand Name */}
          <Link
            to={`/medicines/${medicine._id}`}
            className="font-bold text-base text-slate-900 dark:text-white hover:text-medical-600 dark:hover:text-medical-400 line-clamp-1 transition"
          >
            {medicine.name}
          </Link>

          {/* Generic Composition */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed" title={medicine.genericName}>
            <span className="font-medium text-slate-700 dark:text-slate-300">Salt:</span> {medicine.genericName}
          </p>

          {/* Pack size & Batch */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              <span>{medicine.packSize}</span>
            </span>
            <span className="font-mono text-[10px] bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              GST {medicine.gstRate}%
            </span>
          </div>
        </div>

        {/* Pricing & Stock Availability */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-semibold text-slate-400">Net:</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  ₹{medicine.wholesalePrice?.toFixed(2)}
                </span>
              </div>
              {medicine.mrp && (
                <p className="text-[11px] text-slate-400">
                  MRP: <span className="line-through">₹{medicine.mrp.toFixed(2)}</span>
                </p>
              )}
            </div>

            {/* Live Stock Indicator */}
            <div className="text-right">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3 h-3" /> Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3 h-3" /> Only {medicine.stock} left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> In Stock ({medicine.stock})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            to={`/medicines/${medicine._id}`}
            className="p-2.5 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition flex items-center justify-center"
            title="View full batch & technical specifications"
          >
            <Eye className="w-4 h-4" />
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="flex-1 py-2.5 px-3 bg-medical-600 hover:bg-medical-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isAdding ? 'Adding...' : isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default MedicineCard;
