import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Truck,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Building2,
  Calendar,
  Search,
  ChevronRight,
} from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const StaffDashboardPage = () => {
  const { showToast } = useCart();
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('Processing');
  const [statusNote, setStatusNote] = useState('');

  // Stock edit modal
  const [stockModal, setStockModal] = useState(null);
  const [newStock, setNewStock] = useState(0);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const [ordRes, medRes] = await Promise.all([
        api.get('/orders'),
        api.get('/medicines?limit=100'),
      ]);

      if (ordRes.data.success) setOrders(ordRes.data.orders || []);
      if (medRes.data.success) setMedicines(medRes.data.medicines || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const res = await api.patch(`/orders/${selectedOrder._id}/status`, {
        status: newStatus,
        note: statusNote || `Updated by Operations Staff`,
      });

      if (res.data.success) {
        showToast(`Order status updated to ${newStatus}`, 'success');
        setSelectedOrder(null);
        setStatusNote('');
        fetchStaffData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (!stockModal) return;

    try {
      const res = await api.patch(`/medicines/${stockModal._id}/stock`, {
        stock: parseInt(newStock, 10),
      });

      if (res.data.success) {
        showToast(res.data.message, 'success');
        setStockModal(null);
        fetchStaffData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update stock', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-medical-600 mb-3" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading operations queue...</p>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => ['Pending', 'Confirmed', 'Processing'].includes(o.status));
  const lowStock = medicines.filter((m) => m.stock <= (m.lowStockThreshold || 20));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-medical-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-medical-300">
            Wholesale Warehouse Operations Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Dispatch Queue & Inventory Allocation
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Erode Kamaraj Street Distribution Hub & Regional Van Logistics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold">
            {pendingOrders.length} In Fulfillment Queue
          </span>
        </div>
      </div>

      {/* Main Grid: Orders to Pack + Low Stock Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Orders Queue */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-700">
            Active Fulfillment Queue ({orders.length})
          </h2>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{ord.orderId}</span>
                    <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5">{ord.businessName}</h3>
                    <p className="text-[11px] text-slate-400">
                      Destination: {ord.deliveryAddress?.city}, {ord.deliveryAddress?.district} - {ord.deliveryAddress?.pincode}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase ${ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : ord.status === 'Dispatched' ? 'bg-medical-100 text-medical-800' : 'bg-amber-100 text-amber-800'}`}>
                      {ord.status}
                    </span>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">₹{ord.grandTotal?.toFixed(2)}</p>
                  </div>
                </div>

                {/* Items preview snippet */}
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300">Items to Pack ({ord.items.length}):</p>
                  <ul className="list-disc pl-4 text-slate-500 space-y-0.5">
                    {ord.items.map((i, idx) => (
                      <li key={idx}>
                        <strong>{i.name}</strong> &bull; Qty: {i.quantity} &bull; Batch: {i.batchNumber} ({i.packSize})
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <Link to={`/invoices/${ord.orderId}`} className="text-slate-500 hover:text-medical-600 font-semibold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Packing Slip / Invoice</span>
                  </Link>

                  <button
                    onClick={() => {
                      setSelectedOrder(ord);
                      setNewStatus(ord.status);
                    }}
                    className="px-4 py-1.5 bg-medical-600 hover:bg-medical-700 text-white rounded-lg font-bold shadow"
                  >
                    Update Stage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Low Stock Alerts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Low Stock Alerts ({lowStock.length})</span>
            </h3>

            {lowStock.length === 0 ? (
              <p className="text-xs text-slate-400">All warehouse stock levels healthy.</p>
            ) : (
              <div className="space-y-3 text-xs">
                {lowStock.map((m) => (
                  <div key={m._id} className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{m.name}</p>
                      <p className="text-[10px] text-slate-500">Batch: {m.batchNumber}</p>
                      <span className="font-extrabold text-rose-600">{m.stock} units left</span>
                    </div>

                    <button
                      onClick={() => {
                        setStockModal(m);
                        setNewStock(m.stock);
                      }}
                      className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg font-bold text-slate-800 dark:text-slate-200 text-[11px]"
                    >
                      Adjust Stock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Update Order Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Progress Order: {selectedOrder.orderId}
            </h3>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Select Stage</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl font-bold"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing (Packing Completed)</option>
                  <option value="Dispatched">Dispatched (Van Circuit)</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Operations Note</label>
                <input
                  type="text"
                  placeholder="e.g. Packed in Cold-Box with Batch Verification"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-medical-600 text-white rounded-xl font-bold"
                >
                  Save Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {stockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Adjust Inventory Stock
            </h3>
            <p className="text-xs text-slate-500">{stockModal.name} (Batch: {stockModal.batchNumber})</p>

            <form onSubmit={handleUpdateStock} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">New Physical Units Count *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl text-base font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStockModal(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-medical-600 text-white rounded-xl font-bold"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffDashboardPage;
