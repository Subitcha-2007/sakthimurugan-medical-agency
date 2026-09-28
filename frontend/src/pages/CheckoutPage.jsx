import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Truck,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ChevronLeft,
  FileCheck2,
} from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, showToast } = useCart();
  const { user } = useAuth();

  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Erode');
  const [district, setDistrict] = useState('Erode');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('638001');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Direct B2B Bank Transfer (NEFT/RTGS)');
  const [orderNotes, setOrderNotes] = useState('');

  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [verifyingPincode, setVerifyingPincode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initialize fields from user profile
  useEffect(() => {
    if (user) {
      setPhone(user.phone || '');
      if (user.addresses && user.addresses.length > 0) {
        const addr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        setAddressLine(addr.addressLine || '');
        setLandmark(addr.landmark || '');
        setCity(addr.city || 'Erode');
        setDistrict(addr.district || 'Erode');
        setState(addr.state || 'Tamil Nadu');
        setPincode(addr.pincode || '638001');
      }
    }
  }, [user]);

  // Check pincode serviceability when pincode changes
  useEffect(() => {
    const verifyPincode = async () => {
      if (pincode && pincode.trim().length === 6) {
        try {
          setVerifyingPincode(true);
          const res = await api.get(`/pincodes/check/${pincode.trim()}`);
          if (res.data.success) {
            setPincodeStatus(res.data);
            if (res.data.district) {
              setDistrict(res.data.district);
            }
          }
        } catch (err) {
          setPincodeStatus({ serviceable: false, message: 'Invalid or unsupported delivery route.' });
        } finally {
          setVerifyingPincode(false);
        }
      } else {
        setPincodeStatus(null);
      }
    };

    const timer = setTimeout(() => {
      verifyPincode();
    }, 400);

    return () => clearTimeout(timer);
  }, [pincode]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!addressLine || !pincode || pincode.trim().length !== 6) {
      showToast('Please provide a complete delivery street address and 6-digit PIN code', 'error');
      return;
    }

    if (!pincodeStatus || !pincodeStatus.serviceable) {
      showToast('Cannot place order: Selected PIN code is outside our active regional delivery circuit.', 'error');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        deliveryAddress: {
          addressLine,
          landmark,
          city,
          district,
          state,
          pincode: pincode.trim(),
          phone: phone || user.phone,
        },
        paymentMethod,
        orderNotes,
      };

      const res = await api.post('/orders', payload);
      if (res.data.success) {
        await fetchCart();
        navigate(`/order-success/${res.data.order.orderId}`, { state: { order: res.data.order } });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place wholesale order. Please try again.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white dark:bg-slate-800 rounded-3xl text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Please add medicines before proceeding to checkout.</p>
        <Link to="/medicines" className="px-5 py-2.5 bg-medical-600 text-white rounded-xl text-xs font-bold inline-block">
          Browse Medicines
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <Link to="/cart" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-medical-600 mb-2">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          B2B Wholesale Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Review delivery logistics, verified drug licensing, and confirm trade dispatch.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Step 1: Business Identification */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="w-8 h-8 rounded-lg bg-medical-600 text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Verified Business Customer</h3>
                <p className="text-[11px] text-slate-500">Drug license & billing compliance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Medical Store / Entity:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{user?.businessDetails?.shopName || user?.name}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Drug License Number:</span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{user?.businessDetails?.drugLicenseNumber || 'TN/ERD/20B/APPROVED'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Client GSTIN:</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">{user?.businessDetails?.gstin || '33AAACM5542G1ZP'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Contact Person & Phone:</span>
                <span className="font-bold text-slate-900 dark:text-white">{user?.name} &bull; {phone || user?.phone}</span>
              </div>
            </div>
          </div>

          {/* Step 2 & 3: Delivery Address & Service Availability */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="w-8 h-8 rounded-lg bg-medical-600 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Delivery Location & Route Check</h3>
                <p className="text-[11px] text-slate-500">Scheduled wholesale van route validation</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Address Line (Shop / Hospital premises) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 142, Perundurai Main Road, Opp GH"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-medical-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="Near Old Bus Stand / Main Market"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-medical-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Direct Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-medical-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pincode *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength="6"
                      required
                      placeholder="638001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl font-bold tracking-wider text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-medical-500"
                    />
                    {verifyingPincode && (
                      <Loader2 className="w-4 h-4 animate-spin text-medical-600 absolute right-3 top-3" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Erode">Erode</option>
                    <option value="Karur">Karur</option>
                    <option value="Namakkal">Namakkal</option>
                    <option value="Salem">Salem</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    disabled
                    value={state}
                    className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 font-semibold"
                  />
                </div>
              </div>

              {/* Real-Time Pincode Service Availability Box */}
              {pincodeStatus && (
                <div className={`p-4 rounded-xl border ${pincodeStatus.serviceable ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300'}`}>
                  <div className="flex items-center gap-2 font-bold">
                    {pincodeStatus.serviceable ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Delivery Available & Serviced by {pincodeStatus.deliveryArea}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>Outside Active Delivery Network ({pincode})</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] mt-1">{pincodeStatus.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Step 4: Payment Terms & Notes */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="w-8 h-8 rounded-lg bg-medical-600 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Wholesale Payment Mode</h3>
                <p className="text-[11px] text-slate-500">Commercial settlement options</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { id: 'Direct B2B Bank Transfer (NEFT/RTGS)', title: 'Direct B2B Bank Transfer (NEFT / RTGS / IMPS)', desc: 'Bank account details provided on Tax Invoice pro-forma.' },
                { id: '30-Day Credit (Wholesale Approved)', title: '30-Day Revolving Credit Line (Wholesale Approved)', desc: 'Settlement via monthly ledger reconciliation.' },
                { id: 'Cash on Delivery (COD/Cheque)', title: 'Account Payee Cheque / Cash at Handover', desc: 'Handed over to agency logistics executive upon delivery.' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${paymentMethod === opt.id ? 'bg-medical-50 dark:bg-medical-950/40 border-medical-500 text-slate-900 dark:text-white' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.id}
                    checked={paymentMethod === opt.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-0.5 text-medical-600"
                  />
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white">{opt.title}</span>
                    <span className="text-[11px] text-slate-500">{opt.desc}</span>
                  </div>
                </label>
              ))}

              <div className="pt-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery / Batch Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Urgent morning dispatch requested for ICU stock replenishment..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none text-xs"
                ></textarea>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 sticky top-28">
          
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-700">
            Order Items ({cart.items.length})
          </h3>

          <div className="max-h-60 overflow-y-auto space-y-3 pr-1 text-xs">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                <div className="max-w-[70%]">
                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.medicine?.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{item.quantity} x ₹{item.unitPrice?.toFixed(2)} (+{item.gstRate}% GST)</p>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">₹{item.total?.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{cart.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>CGST (50% of GST):</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{(cart.gstTotal / 2)?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>SGST (50% of GST):</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{(cart.gstTotal / 2)?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Delivery Charges:</span>
              <span>FREE</span>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">Total Amount:</span>
              <span className="text-2xl font-black text-medical-600 dark:text-medical-400">
                ₹{cart.grandTotal?.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !pincodeStatus?.serviceable}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-[0.99]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Pro-forma & Allocating Stock...</span>
              </>
            ) : (
              <>
                <FileCheck2 className="w-5 h-5" />
                <span>Confirm & Place Wholesale Order</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-400">
            By placing this wholesale order, you confirm that your establishment holds a valid retail / hospital drug license.
          </p>

        </div>

      </form>

    </div>
  );
};

export default CheckoutPage;
