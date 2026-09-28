import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Building2,
  PackageX,
  ChevronLeft,
  Truck,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart, loading } = useCart();
  const { user, isApprovedClient } = useAuth();
  const navigate = useNavigate();

  const items = cart?.items || [];

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-center shadow-xl space-y-6">
        <div className="w-16 h-16 bg-medical-50 dark:bg-medical-950/60 rounded-2xl flex items-center justify-center mx-auto text-medical-600">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Wholesale Shopping Cart</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Please sign in to your verified business account to view your wholesale orders, inventory allocations, and trade pricing.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="px-6 py-3 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-sm font-bold shadow">
            Client Login
          </Link>
          <Link to="/register" className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm font-bold">
            Register Pharmacy
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-10 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-center shadow-lg space-y-6">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700/60 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
          <PackageX className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Wholesale Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            You currently have no pharmaceutical formulations queued for dispatch.
          </p>
        </div>
        <div>
          <Link
            to="/medicines"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-sm font-bold shadow-md transition"
          >
            <span>Browse Wholesale Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-medical-600 dark:text-medical-400">
            Order Review & Quantities
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Wholesale Procurement Cart
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/medicines"
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-medical-600 flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Add More Items</span>
          </Link>
          <button
            onClick={clearCart}
            className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1.5 ml-4"
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty Cart</span>
          </button>
        </div>
      </div>

      {/* Cart Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const med = item.medicine;
            if (!med) return null;

            return (
              <div
                key={item._id}
                className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Media & Details */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={med.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'}
                    alt={med.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-900 flex-shrink-0"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-medical-600 dark:text-medical-400">{med.manufacturer}</span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">
                        GST {item.gstRate}%
                      </span>
                    </div>
                    <Link
                      to={`/medicines/${med._id}`}
                      className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-medical-600 line-clamp-1"
                    >
                      {med.name}
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{med.genericName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">Batch: {med.batchNumber} | Pack: {med.packSize}</p>
                  </div>
                </div>

                {/* Pricing, Quantity Stepper & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-700">
                  
                  {/* Stepper */}
                  <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1 || loading}
                      className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= (med.stock || 999) || loading}
                      className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[90px]">
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      ₹{item.total?.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      @ ₹{item.unitPrice?.toFixed(2)} / unit
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })}

          {/* Delivery & Compliance Banner */}
          <div className="p-4 bg-medical-50 dark:bg-medical-950/40 rounded-2xl border border-medical-200 dark:border-medical-800 flex items-center gap-3 text-xs text-medical-900 dark:text-medical-200 font-medium">
            <Truck className="w-5 h-5 text-medical-600 flex-shrink-0" />
            <span>Orders placed before 2:00 PM are dispatched on the same evening delivery route (Erode/Karur/Namakkal/Salem).</span>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 sticky top-28">
          
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-700">
            Wholesale Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Items Total ({cart.items.reduce((s, i) => s + i.quantity, 0)} units):</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{cart.subtotal?.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Estimated GST (CGST + SGST):</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{cart.gstTotal?.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Regional Delivery & Cold Chain:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">FREE (Agency Route)</span>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">Grand Net Total:</span>
              <span className="text-2xl font-black text-medical-600 dark:text-medical-400">
                ₹{cart.grandTotal?.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-medical-600 hover:bg-medical-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-medical-600/25 flex items-center justify-center gap-2 transition active:scale-[0.99]"
          >
            <span>Proceed to B2B Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">GST Compliance Guaranteed:</p>
            <p>Official GST Tax Invoice (Form 20B / 21B authorized) is generated immediately upon order submission.</p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CartPage;
