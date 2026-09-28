import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Truck, FileText, ArrowRight, Building2, Package, MapPin } from 'lucide-react';
import api from '../api/axios';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);

  useEffect(() => {
    if (!order) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${id}`);
          if (res.data.success) {
            setOrder(res.data.order);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  return (
    <div className="max-w-3xl mx-auto my-12 px-4 space-y-8">
      
      {/* Confirmation Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700 shadow-2xl text-center space-y-6">
        
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Wholesale Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Your pharmaceutical procurement order has been registered in the Sakthimurugan Medical Agency dispatch queue.
          </p>
        </div>

        {/* Order Details Badge Box */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Order Reference ID:</span>
            <span className="font-extrabold font-mono text-sm text-medical-600 dark:text-medical-400">{order?.orderId || id}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">GST Tax Invoice Number:</span>
            <span className="font-extrabold font-mono text-sm text-slate-900 dark:text-white">{order?.invoiceNumber || 'Generated in System'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Fulfillment Dispatch Hub:</span>
            <span className="font-bold text-slate-800 dark:text-white">{order?.deliveryAreaName || 'Erode Central Hub'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Net Order Value:</span>
            <span className="font-black text-sm text-slate-900 dark:text-white">₹{order?.grandTotal?.toFixed(2) || '---'}</span>
          </div>
        </div>

        {/* Delivery Address snippet */}
        {order?.deliveryAddress && (
          <div className="p-4 bg-medical-50 dark:bg-medical-950/40 rounded-xl text-left text-xs border border-medical-200 dark:border-medical-800 space-y-1">
            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Dispatched to: {order.businessName}</span>
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {order.deliveryAddress.addressLine}, {order.deliveryAddress.city}, {order.deliveryAddress.district} - {order.deliveryAddress.pincode}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <Link
            to={`/orders/${order?.orderId || id}`}
            className="w-full sm:w-auto px-6 py-3.5 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order & Dispatch Timeline</span>
          </Link>

          <Link
            to={`/invoices/${order?.orderId || id}`}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 text-medical-600" />
            <span>Print Official GST Invoice</span>
          </Link>
        </div>

      </div>

    </div>
  );
};

export default OrderSuccessPage;
