import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  ShoppingCart,
  Truck,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  TrendingUp,
  FileText,
  Building2,
  DollarSign,
  ChevronRight,
  Filter,
} from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const AdminDashboardPage = () => {
  const { showToast } = useCart();
  const [activeTab, setActiveTab] = useState('overview'); // overview, approvals, orders, inventory, areas, users

  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals / Action states
  const [reviewModal, setReviewModal] = useState(null); // { app, action: 'approve' | 'reject' }
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Status update modal for order
  const [orderModal, setOrderModal] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState('Confirmed');
  const [orderStatusNote, setOrderStatusNote] = useState('');

  // Add / Edit Medicine state
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    genericName: '',
    manufacturer: '',
    category: '',
    dosageForm: 'Tablet',
    packSize: '',
    wholesalePrice: '',
    mrp: '',
    gstRate: 12,
    stock: 100,
    batchNumber: '',
    expiryDate: '',
    hsnCode: '3004',
    description: '',
    image: '',
  });
  const [editingMedicineId, setEditingMedicineId] = useState(null);

  // Add Pincode state
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [newPincodeForm, setNewPincodeForm] = useState({
    pincode: '',
    areaName: '',
    district: 'Erode',
    deliveryArea: '',
    estimatedDeliveryDays: 1,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        appsRes,
        ordersRes,
        medsRes,
        catsRes,
        areasRes,
        pinsRes,
        usersRes,
      ] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/business-applications'),
        api.get('/orders'),
        api.get('/medicines?limit=100'),
        api.get('/categories'),
        api.get('/delivery-areas'),
        api.get('/pincodes'),
        api.get('/admin/users'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (appsRes.data.success) setApplications(appsRes.data.applications || []);
      if (ordersRes.data.success) setOrders(ordersRes.data.orders || []);
      if (medsRes.data.success) setMedicines(medsRes.data.medicines || []);
      if (catsRes.data.success) setCategories(catsRes.data.categories || []);
      if (areasRes.data.success) setDeliveryAreas(areasRes.data.areas || []);
      if (pinsRes.data.success) setPincodes(pinsRes.data.pincodes || []);
      if (usersRes.data.success) setUsersList(usersRes.data.users || []);
    } catch (err) {
      console.error('Error loading admin control panel data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Application Approval / Rejection handler
  const handleReviewApplication = async (e) => {
    e.preventDefault();
    if (!reviewModal) return;

    try {
      const res = await api.put(`/business-applications/${reviewModal.app._id}/review`, {
        action: reviewModal.action,
        rejectionReason,
        adminNotes,
      });

      if (res.data.success) {
        showToast(res.data.message, reviewModal.action === 'approve' ? 'success' : 'warning');
        setReviewModal(null);
        setRejectionReason('');
        setAdminNotes('');
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error processing application', 'error');
    }
  };

  // Order status update handler
  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault();
    if (!orderModal) return;

    try {
      const res = await api.patch(`/orders/${orderModal._id}/status`, {
        status: newOrderStatus,
        note: orderStatusNote,
      });

      if (res.data.success) {
        showToast(`Order status updated to ${newOrderStatus}`, 'success');
        setOrderModal(null);
        setOrderStatusNote('');
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    }
  };

  // Medicine Save / Edit handler
  const handleSaveMedicine = async (e) => {
    e.preventDefault();
    try {
      if (editingMedicineId) {
        const res = await api.put(`/medicines/${editingMedicineId}`, medicineForm);
        if (res.data.success) {
          showToast('Medicine details updated successfully', 'success');
        }
      } else {
        const res = await api.post('/medicines', medicineForm);
        if (res.data.success) {
          showToast('New medicine added to wholesale catalog', 'success');
        }
      }
      setIsMedicineModalOpen(false);
      setEditingMedicineId(null);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save medicine', 'error');
    }
  };

  // Add Pincode handler
  const handleAddPincode = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/pincodes', newPincodeForm);
      if (res.data.success) {
        showToast(res.data.message, 'success');
        setIsPincodeModalOpen(false);
        setNewPincodeForm({
          pincode: '',
          areaName: '',
          district: 'Erode',
          deliveryArea: deliveryAreas[0]?._id || '',
          estimatedDeliveryDays: 1,
        });
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add PIN code', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-medical-600 mb-3" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading live agency metrics from database...</p>
      </div>
    );
  }

  const pendingApps = applications.filter((a) => a.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Title Banner */}
      <div className="bg-gradient-to-r from-medical-950 via-slate-900 to-medical-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-medical-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Executive Admin Management Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            SAKTHIMURUGAN MEDICAL AGENCY &bull; Control Hub
          </h1>
          <p className="text-xs text-slate-300">
            Live operations: Client Approvals, Wholesale Orders, Inventory Radar, and Service Routes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingMedicineId(null);
              setMedicineForm({
                name: '',
                genericName: '',
                manufacturer: '',
                category: categories[0]?._id || '',
                dosageForm: 'Tablet',
                packSize: '10x10 Strip Box',
                wholesalePrice: '',
                mrp: '',
                gstRate: 12,
                stock: 200,
                batchNumber: 'BN-' + Math.floor(100000 + Math.random() * 900000),
                expiryDate: '2028-12-31',
                hsnCode: '3004',
                description: '',
                image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
              });
              setIsMedicineModalOpen(true);
            }}
            className="px-4 py-2.5 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-700 text-xs font-bold">
        {[
          { id: 'overview', name: 'Overview & Metrics', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'approvals', name: `Client Approvals (${pendingApps.length})`, icon: <Clock className="w-4 h-4 text-amber-500" /> },
          { id: 'orders', name: `Wholesale Orders (${orders.length})`, icon: <Truck className="w-4 h-4" /> },
          { id: 'inventory', name: `Medicine Inventory (${medicines.length})`, icon: <Package className="w-4 h-4" /> },
          { id: 'areas', name: `Service Areas & PIN Codes (${pincodes.length})`, icon: <MapPin className="w-4 h-4" /> },
          { id: 'users', name: `Clients Directory (${usersList.length})`, icon: <Users className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-2 transition ${activeTab === tab.id ? 'bg-medical-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Client Approvals</span>
              <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{stats?.pendingApprovals || pendingApps.length}</p>
              <button onClick={() => setActiveTab('approvals')} className="text-xs font-bold text-medical-600 hover:underline">
                Review Applications &rarr;
              </button>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{stats?.totalOrders || orders.length}</p>
              <p className="text-[11px] text-emerald-600 font-bold">Revenue: ₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Catalog Medicines</span>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{stats?.totalMedicines || medicines.length}</p>
              <span className="text-[11px] text-slate-500 font-semibold">{categories.length} therapeutic specialities</span>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Stock Medicines</span>
              <p className="text-3xl font-black text-rose-600 dark:text-rose-400">{stats?.lowStockCount || 0}</p>
              <button onClick={() => setActiveTab('inventory')} className="text-xs font-bold text-rose-600 hover:underline">
                View Low Stock Alerts &rarr;
              </button>
            </div>
          </div>

          {/* Pending Approvals Summary Banner if any */}
          {pendingApps.length > 0 && (
            <div className="p-6 bg-amber-50 dark:bg-amber-950/40 rounded-3xl border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-sm text-amber-900 dark:text-amber-300">
                    {pendingApps.length} Client Registration Application(s) Awaiting Review
                  </h3>
                  <p className="text-xs text-amber-800 dark:text-amber-400">
                    Retail pharmacies and medical stores awaiting drug license clearance.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('approvals')}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Review & Approve Clients
              </button>
            </div>
          )}

          {/* Recent Orders Overview */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Wholesale Orders</h3>
              <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-medical-600 hover:underline">
                View All Orders &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 5).map((ord) => (
                <div key={ord._id} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{ord.orderId}</span>
                    <p className="text-slate-500 font-semibold">{ord.businessName}</p>
                    <p className="text-[10px] text-slate-400">{ord.deliveryAddress?.city}, {ord.deliveryAddress?.district} &bull; {ord.items.length} products</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-medical-100 text-medical-800'}`}>
                      {ord.status}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">₹{ord.grandTotal?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLIENT APPROVAL REQUESTS */}
      {activeTab === 'approvals' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Client Registration & Drug License Verification Queue
              </h2>
              <p className="text-xs text-slate-500">
                Review submitted business applications. Approved clients receive immediate clearance for wholesale catalog ordering.
              </p>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No client registration applications found.
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className={`p-6 rounded-2xl border transition ${app.status === 'pending' ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{app.businessName}</h3>
                        <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase ${app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : app.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Applicant: <strong>{app.applicantName}</strong> &bull; Phone: <strong>{app.phone}</strong> &bull; Email: <strong>{app.email}</strong>
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                        <p className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                          Drug License: {app.drugLicenseNumber}
                        </p>
                        <p className="text-slate-500 font-mono">
                          GSTIN: {app.gstin || 'Not Provided (Standard Non-GST)'}
                        </p>
                        <p className="text-slate-500 sm:col-span-2">
                          Address: {app.address}, {app.city}, {app.district} - {app.pincode} ({app.state})
                        </p>
                      </div>

                      {app.rejectionReason && (
                        <p className="text-xs text-rose-600 font-semibold pt-1">
                          Rejection Reason: {app.rejectionReason}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2 lg:pt-0">
                      {app.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => {
                              setReviewModal({ app, action: 'approve' });
                              setAdminNotes('Drug license credentials verified with DCA Erode zone.');
                            }}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve Client</span>
                          </button>

                          <button
                            onClick={() => {
                              setReviewModal({ app, action: 'reject' });
                              setRejectionReason('Form 20B wholesale license documentation expired or invalid.');
                            }}
                            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold">
                          Reviewed on {new Date(app.reviewedAt || app.updatedAt).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDERS QUEUE */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Wholesale Orders Management</h2>
              <p className="text-xs text-slate-500">Dispatch queue, status transitions & delivery assignments</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px] font-extrabold">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Business Client</th>
                  <th className="py-3 px-3">Destination City / Hub</th>
                  <th className="py-3 px-3 text-right">Items</th>
                  <th className="py-3 px-3 text-right">Order Value</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      <Link to={`/orders/${ord.orderId}`} className="hover:underline text-medical-600">
                        {ord.orderId}
                      </Link>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">
                      {ord.businessName}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {ord.deliveryAddress?.city}, {ord.deliveryAddress?.district} ({ord.deliveryAddress?.pincode})
                    </td>
                    <td className="py-3 px-3 text-right font-semibold">
                      {ord.items.length} items
                    </td>
                    <td className="py-3 px-3 text-right font-black font-mono text-slate-900 dark:text-white">
                      ₹{ord.grandTotal?.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase ${ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : ord.status === 'Dispatched' ? 'bg-medical-100 text-medical-800' : 'bg-amber-100 text-amber-800'}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setOrderModal(ord);
                          setNewOrderStatus(ord.status);
                        }}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-medical-600 hover:text-white text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition"
                      >
                        Update Status
                      </button>
                      <Link
                        to={`/invoices/${ord.orderId}`}
                        className="px-2.5 py-1 text-slate-500 hover:text-medical-600"
                        title="View Invoice"
                      >
                        <FileText className="w-4 h-4 inline" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MEDICINE INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Medicines Inventory & Stock Adjustments</h2>
              <p className="text-xs text-slate-500">Live warehouse batches, stock levels, and trade price controls</p>
            </div>
            <button
              onClick={() => {
                setEditingMedicineId(null);
                setMedicineForm({
                  name: '',
                  genericName: '',
                  manufacturer: '',
                  category: categories[0]?._id || '',
                  dosageForm: 'Tablet',
                  packSize: '10x10 Strip Box',
                  wholesalePrice: '',
                  mrp: '',
                  gstRate: 12,
                  stock: 200,
                  batchNumber: 'BN-' + Math.floor(100000 + Math.random() * 900000),
                  expiryDate: '2028-12-31',
                  hsnCode: '3004',
                  description: '',
                  image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
                });
                setIsMedicineModalOpen(true);
              }}
              className="px-4 py-2.5 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Formulation</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px] font-extrabold">
                  <th className="py-3 px-3">Medicine & Salt</th>
                  <th className="py-3 px-3">Manufacturer</th>
                  <th className="py-3 px-3 font-mono">Batch No</th>
                  <th className="py-3 px-3 text-right">Wholesale Rate</th>
                  <th className="py-3 px-3 text-right">MRP</th>
                  <th className="py-3 px-3 text-right">Available Stock</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {medicines.map((med) => {
                  const isLow = med.stock <= (med.lowStockThreshold || 20);
                  return (
                    <tr key={med._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900 dark:text-white">{med.name}</p>
                        <p className="text-[10px] text-slate-500 truncate max-w-xs">{med.genericName}</p>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                        {med.manufacturer}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-800 dark:text-slate-200">
                        {med.batchNumber}
                      </td>
                      <td className="py-3 px-3 text-right font-black font-mono text-slate-900 dark:text-white">
                        ₹{med.wholesalePrice?.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-400">
                        ₹{med.mrp?.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isLow ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'}`}>
                          {med.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setEditingMedicineId(med._id);
                            setMedicineForm({
                              name: med.name,
                              genericName: med.genericName,
                              manufacturer: med.manufacturer,
                              category: med.category?._id || med.category,
                              dosageForm: med.dosageForm || 'Tablet',
                              packSize: med.packSize,
                              wholesalePrice: med.wholesalePrice,
                              mrp: med.mrp,
                              gstRate: med.gstRate,
                              stock: med.stock,
                              batchNumber: med.batchNumber,
                              expiryDate: med.expiryDate ? med.expiryDate.split('T')[0] : '',
                              hsnCode: med.hsnCode || '3004',
                              description: med.description || '',
                              image: med.image || '',
                            });
                            setIsMedicineModalOpen(true);
                          }}
                          className="p-1.5 text-medical-600 hover:bg-medical-50 rounded-lg"
                          title="Edit Medicine"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SERVICE AREAS & PINCODES */}
      {activeTab === 'areas' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Proposed Service Regions & PIN Code Management</h2>
              <p className="text-xs text-slate-500">Enable or disable delivery routes across Erode, Karur, Namakkal, and Salem</p>
            </div>
            <button
              onClick={() => {
                setNewPincodeForm({
                  pincode: '',
                  areaName: '',
                  district: 'Erode',
                  deliveryArea: deliveryAreas[0]?._id || '',
                  estimatedDeliveryDays: 1,
                });
                setIsPincodeModalOpen(true);
              }}
              className="px-4 py-2 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Serviced Pincode</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {deliveryAreas.map((area) => (
              <div key={area._id} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{area.name}</h4>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <p className="text-xs text-slate-500">District: {area.district}</p>
                <p className="text-xs text-emerald-600 font-semibold">{area.estimatedDeliveryTime}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto pt-4 border-t border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Active Serviced PIN Codes</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px] font-extrabold">
                  <th className="py-2.5 px-3">PIN Code</th>
                  <th className="py-2.5 px-3">Area / Town</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">Servicing Hub</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pincodes.map((p) => (
                  <tr key={p._id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">{p.pincode}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{p.areaName}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{p.district}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{p.deliveryAreaName || 'Central Hub'}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        Active ✓
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Registered Accounts & Client Directory</h2>
              <p className="text-xs text-slate-500">All authenticated system users, accounts statuses & business profiles</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px] font-extrabold">
                  <th className="py-3 px-3">Name / Pharmacist</th>
                  <th className="py-3 px-3">Medical Establishment</th>
                  <th className="py-3 px-3">Contact Email & Phone</th>
                  <th className="py-3 px-3">Drug License</th>
                  <th className="py-3 px-3 text-center">Role</th>
                  <th className="py-3 px-3 text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                      {u.businessDetails?.shopName || 'Agency Central'}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      <p>{u.email}</p>
                      <p className="font-mono text-[10px]">{u.phone}</p>
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      {u.businessDetails?.drugLicenseNumber || 'N/A'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : u.role === 'staff' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase ${u.accountStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : u.accountStatus === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                        {u.accountStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {reviewModal.action === 'approve' ? 'Approve Client Business Account' : 'Reject Business Application'}
            </h3>
            <p className="text-xs text-slate-500">
              Target Entity: <strong>{reviewModal.app.businessName}</strong> ({reviewModal.app.applicantName})
            </p>

            <form onSubmit={handleReviewApplication} className="space-y-4 text-xs">
              {reviewModal.action === 'reject' ? (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rejection Reason (Visible to client) *
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl"
                  ></textarea>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Internal Compliance Note
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded-xl ${reviewModal.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                >
                  Confirm {reviewModal.action === 'approve' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Status Update Modal */}
      {orderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Update Order Status: {orderModal.orderId}
            </h3>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status Transition</label>
                <select
                  value={newOrderStatus}
                  onChange={(e) => setNewOrderStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl font-bold"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing (Warehouse Pack)</option>
                  <option value="Dispatched">Dispatched (Van Circuit)</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Operational Timeline Note</label>
                <input
                  type="text"
                  placeholder="e.g. Dispatched with morning delivery circuit via Van TN-33-AX-8921"
                  value={orderStatusNote}
                  onChange={(e) => setOrderStatusNote(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderModal(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Medicine Modal */}
      {isMedicineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 my-8">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {editingMedicineId ? 'Edit Formulation Details' : 'Add New Medicine Formulation'}
            </h3>

            <form onSubmit={handleSaveMedicine} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Augmentin 625 Duo"
                    value={medicineForm.name}
                    onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Active Chemical Salt *</label>
                  <input
                    type="text"
                    required
                    placeholder="Amoxicillin + Clavulanic Acid"
                    value={medicineForm.genericName}
                    onChange={(e) => setMedicineForm({ ...medicineForm, genericName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Manufacturer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sun Pharma, Cipla, GSK"
                    value={medicineForm.manufacturer}
                    onChange={(e) => setMedicineForm({ ...medicineForm, manufacturer: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Category *</label>
                  <select
                    value={medicineForm.category}
                    onChange={(e) => setMedicineForm({ ...medicineForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Dosage Form</label>
                  <select
                    value={medicineForm.dosageForm}
                    onChange={(e) => setMedicineForm({ ...medicineForm, dosageForm: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                  >
                    {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment / Gel', 'Drops', 'Inhaler', 'IV Infusion'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Pack Size *</label>
                  <input
                    type="text"
                    required
                    placeholder="10x10 Strip Box (100 Tabs)"
                    value={medicineForm.packSize}
                    onChange={(e) => setMedicineForm({ ...medicineForm, packSize: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Wholesale Net Rate (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={medicineForm.wholesalePrice}
                    onChange={(e) => setMedicineForm({ ...medicineForm, wholesalePrice: parseFloat(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={medicineForm.mrp}
                    onChange={(e) => setMedicineForm({ ...medicineForm, mrp: parseFloat(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Available Stock (Units) *</label>
                  <input
                    type="number"
                    required
                    value={medicineForm.stock}
                    onChange={(e) => setMedicineForm({ ...medicineForm, stock: parseInt(e.target.value, 10) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Batch Number *</label>
                  <input
                    type="text"
                    required
                    value={medicineForm.batchNumber}
                    onChange={(e) => setMedicineForm({ ...medicineForm, batchNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Description / Indications</label>
                <textarea
                  rows="2"
                  value={medicineForm.description}
                  onChange={(e) => setMedicineForm({ ...medicineForm, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMedicineModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add PIN Code Modal */}
      {isPincodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Add New Serviced PIN Code</h3>
            <form onSubmit={handleAddPincode} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">6-Digit PIN Code *</label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  placeholder="638001"
                  value={newPincodeForm.pincode}
                  onChange={(e) => setNewPincodeForm({ ...newPincodeForm, pincode: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Area / Locality Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surampatti / Medical Market"
                  value={newPincodeForm.areaName}
                  onChange={(e) => setNewPincodeForm({ ...newPincodeForm, areaName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Assigned Distribution Region *</label>
                <select
                  value={newPincodeForm.deliveryArea}
                  onChange={(e) => setNewPincodeForm({ ...newPincodeForm, deliveryArea: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl"
                >
                  {deliveryAreas.map((a) => (
                    <option key={a._id} value={a._id}>{a.name} ({a.district})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPincodeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl"
                >
                  Save PIN Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
