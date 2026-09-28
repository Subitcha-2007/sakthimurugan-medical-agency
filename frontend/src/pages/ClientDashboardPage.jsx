import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Package,
  Truck,
  FileText,
  Clock,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  CreditCard,
  Sun,
  Moon,
  Loader2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const ClientDashboardPage = () => {
  const { user, updateUserProfile } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { totalItemsCount } = useCart();

  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const [ordersRes, invoicesRes] = await Promise.all([
          api.get('/orders/my-orders'),
          api.get('/invoices'),
        ]);

        if (ordersRes.data.success) {
          setOrders(ordersRes.data.orders || []);
        }
        if (invoicesRes.data.success) {
          setInvoices(invoicesRes.data.invoices || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner Card */}
      <div className="bg-gradient-to-r from-medical-800 via-medical-700 to-medical-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Approved Wholesale Client Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.businessDetails?.shopName || user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-medical-100 max-w-xl">
            Pharmacist Incharge: <strong>{user?.name}</strong> &bull; License: <strong>{user?.businessDetails?.drugLicenseNumber || 'TN/ERD/20B/88219'}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/medicines"
            className="px-5 py-3 bg-white text-medical-900 hover:bg-medical-50 rounded-xl text-xs font-extrabold shadow-md transition"
          >
            Order Medicines &rarr;
          </Link>
          <button
            onClick={toggleTheme}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold flex items-center gap-2 border border-white/20 transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-white" />}
            <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{orders.length}</p>
          <span className="text-[11px] text-medical-600 font-semibold">Processed via Erode Central</span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Deliveries</span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {orders.filter((o) => ['Pending', 'Confirmed', 'Processing', 'Dispatched'].includes(o.status)).length}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">In dispatch pipeline</span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tax Invoices</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{invoices.length}</p>
          <span className="text-[11px] text-slate-400 font-semibold">Form 20B/21B compliant</span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Items in Cart</span>
          <p className="text-3xl font-black text-medical-600 dark:text-medical-400">{totalItemsCount}</p>
          <Link to="/cart" className="text-[11px] text-medical-600 font-bold hover:underline">
            View Wholesale Cart &rarr;
          </Link>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Recent Orders List */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-medical-600" />
              <span>Recent Wholesale Orders</span>
            </h2>
            <Link to="/medicines" className="text-xs font-bold text-medical-600 hover:underline">
              Place New Order &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-medical-600 mx-auto mb-2" />
              <p className="text-xs">Fetching order history...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <p>No orders placed yet.</p>
              <Link to="/medicines" className="mt-3 inline-block px-4 py-2 bg-medical-600 text-white font-bold rounded-xl">
                Browse Wholesale Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{order.orderId}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} &bull; {order.items.length} items
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full uppercase ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : order.status === 'Dispatched' ? 'bg-medical-100 text-medical-800 dark:bg-medical-950/60 dark:text-medical-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'}`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">₹{order.grandTotal?.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate max-w-[50%]">
                      Hub: <strong>{order.deliveryAreaName || 'Erode Central'}</strong>
                    </span>

                    <div className="flex items-center gap-3">
                      <Link
                        to={`/orders/${order.orderId}`}
                        className="font-bold text-medical-600 dark:text-medical-400 hover:underline flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </Link>
                      <Link
                        to={`/invoices/${order.orderId}`}
                        className="font-bold text-slate-700 dark:text-slate-300 hover:text-medical-600 flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Business Profile & Saved Addresses */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Business Details Card */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
              <Building2 className="w-4 h-4 text-medical-600" />
              <span>Business Profile</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Business Name:</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm">{user?.businessDetails?.shopName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Drug License Number:</span>
                <span className="font-bold font-mono text-emerald-600">{user?.businessDetails?.drugLicenseNumber || 'TN/ERD/20B/88219'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">GSTIN:</span>
                <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{user?.businessDetails?.gstin || '33AAACM5542G1ZP'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Account Status:</span>
                <span className="font-bold text-emerald-600 uppercase">Approved Active Client ✓</span>
              </div>
            </div>
          </div>

          {/* Delivery Location Card */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Default Delivery Location</span>
            </h3>

            {user?.addresses && user.addresses.length > 0 ? (
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <p className="font-bold text-slate-900 dark:text-white">{user.addresses[0].addressLine}</p>
                <p>{user.addresses[0].city}, {user.addresses[0].district} - {user.addresses[0].pincode}</p>
                <p className="text-emerald-600 font-semibold pt-1">Direct Regional Delivery Circuit Active</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No saved address found.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ClientDashboardPage;
