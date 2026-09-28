import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Building2,
  ChevronLeft,
  AlertCircle,
  Loader2,
  ShieldCheck,
  User,
  Phone,
} from 'lucide-react';
import api from '../api/axios';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error('Error fetching order tracking info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-medical-600 mb-3" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading order timeline from warehouse database...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white dark:bg-slate-800 rounded-3xl text-center space-y-4 shadow-lg">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Not Found</h2>
        <p className="text-xs text-slate-500">Could not retrieve order details for reference {id}.</p>
        <Link to="/orders" className="px-5 py-2.5 bg-medical-600 text-white rounded-xl text-xs font-bold inline-block">
          View My Orders
        </Link>
      </div>
    );
  }

  const steps = ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Delivered'];
  const currentStepIdx = steps.indexOf(order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/orders" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-medical-600 mb-2">
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Orders List</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Order Tracking: <span className="font-mono text-medical-600 dark:text-medical-400">{order.orderId}</span>
            </h1>
            <span className={`px-3 py-1 text-xs font-black rounded-full uppercase ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : order.status === 'Dispatched' ? 'bg-medical-100 text-medical-800 dark:bg-medical-950/60 dark:text-medical-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'}`}>
              {order.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div>
          <Link
            to={`/invoices/${order.orderId}`}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-medical-500 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 shadow-sm flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-medical-600" />
            <span>View & Print Tax Invoice</span>
          </Link>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-8">
          Fulfillment & Dispatch Pipeline
        </h3>

        <div className="relative">
          {/* Progress bar background line */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 dark:bg-slate-700 -z-0 hidden md:block" />

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const isCompleted = currentStepIdx >= idx && order.status !== 'Cancelled';
              const isCurrent = order.status === step;

              return (
                <div key={step} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3">
                  {/* Step Icon circle */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition shadow-md ${isCompleted ? 'bg-medical-600 text-white shadow-medical-500/25' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 border border-slate-300 dark:border-slate-600'}`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div>
                    <p className={`text-xs font-bold ${isCurrent ? 'text-medical-600 dark:text-medical-400 text-sm' : isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                      {step === 'Pending' ? '1. Order Placed' : step === 'Confirmed' ? '2. Confirmed' : step === 'Processing' ? '3. Warehouse Packing' : step === 'Dispatched' ? '4. Dispatched (Van)' : '5. Delivered'}
                    </p>
                    {isCurrent && (
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-medical-50 dark:bg-medical-950/60 text-medical-600 text-[10px] font-extrabold rounded">
                        Current Stage
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Delivery Assignment & Order Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Logistics Info & Status Log */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Delivery Handover Details */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
              <Truck className="w-4 h-4 text-medical-600" />
              <span>Agency Logistics & Handover</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Fulfillment Hub:</span>
                <span className="font-bold text-slate-900 dark:text-white">{order.deliveryAreaName || 'Erode Central Distribution HQ'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Assigned Vehicle:</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">{order.deliveryAssignment?.vehicleNumber || 'Agency Delivery Van (Scheduled)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Delivery Executive:</span>
                <span className="font-bold text-slate-900 dark:text-white">{order.deliveryAssignment?.staffName || 'Operations Team'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Payment Method:</span>
                <span className="font-bold text-slate-900 dark:text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Payment Status:</span>
                <span className="font-bold text-emerald-600">{order.paymentStatus}</span>
              </div>
            </div>

            {/* Destination Address */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs space-y-1">
              <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Delivery Address ({order.businessName})</span>
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city}, {order.deliveryAddress?.district} - {order.deliveryAddress?.pincode}
              </p>
              <p className="text-slate-500">Contact: {order.deliveryAddress?.phone}</p>
            </div>
          </div>

          {/* Activity Timeline Log from Database */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
              <Clock className="w-4 h-4 text-medical-600" />
              <span>Operational Status History</span>
            </h3>

            <div className="space-y-4 text-xs">
              {order.statusHistory?.map((hist, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-medical-600 mt-1 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{hist.status}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(hist.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} &bull; {new Date(hist.timestamp).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">{hist.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Ordered Items & Value */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span>Ordered Formulations ({order.items.length})</span>
            <span className="font-black text-medical-600">₹{order.grandTotal?.toFixed(2)}</span>
          </h3>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">{item.name}</span>
                  <span>₹{item.total?.toFixed(2)}</span>
                </div>
                <p className="text-slate-500 text-[11px]">{item.genericName}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Batch: {item.batchNumber} | Pack: {item.packSize}</span>
                  <span>Qty: {item.quantity} x ₹{item.unitPrice?.toFixed(2)} (+{item.gstRate}% GST)</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{order.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>CGST + SGST:</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{order.gstTotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-700">
              <span>Grand Total:</span>
              <span className="text-medical-600 dark:text-medical-400">₹{order.grandTotal?.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default OrderTrackingPage;
