import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, ChevronLeft, Building2, Phone, Mail, ShieldCheck, Download, Loader2 } from 'lucide-react';
import api from '../api/axios';

const InvoicePage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/invoices/${id}`);
        if (res.data.success) {
          setInvoice(res.data.invoice);
        }
      } catch (err) {
        console.error('Error fetching invoice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-medical-600 mb-3" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Generating Tax Invoice from database...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white dark:bg-slate-800 rounded-3xl text-center space-y-4 shadow-lg">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Invoice Not Found</h2>
        <p className="text-xs text-slate-500">No GST tax invoice record exists for identifier {id}.</p>
        <Link to="/orders" className="px-5 py-2.5 bg-medical-600 text-white rounded-xl text-xs font-bold inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print flex items-center justify-between">
        <Link
          to={`/orders/${invoice.orderId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-medical-600"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Order Tracking</span>
        </Link>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Invoice Sheet */}
      <div className="invoice-card bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-200">
        
        {/* Header Title */}
        <div className="text-center pb-6 border-b-2 border-slate-900">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
            TAX INVOICE &bull; FORM 20B / 21B WHOLESALE MEDICINES
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            SAKTHIMURUGAN MEDICAL AGENCY
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-0.5">
            50, 1st Floor, Kamaraj Street, Erode, Tamil Nadu - 638001
          </p>
          <p className="text-xs text-slate-600">
            Phones: 9994446994, 9865730150 &bull; Email: orders@sakthimuruganmedicals.com
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold text-slate-800 mt-2 font-mono">
            <span>GSTIN: 33AABCS1234F1Z8</span>
            <span>&bull;</span>
            <span>DL No: TN/ERD/20B/10492 & 21B/10493</span>
            <span>&bull;</span>
            <span>FSSAI: 12419008000451</span>
          </div>
        </div>

        {/* Invoice & Buyer Information Grid */}
        <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
          
          {/* Buyer Details */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Billed & Shipped To:</span>
            <h3 className="text-sm font-extrabold text-slate-900">{invoice.buyerDetails?.shopName}</h3>
            <p className="text-slate-600">Attn: {invoice.buyerDetails?.contactPerson}</p>
            <p className="text-slate-600 leading-relaxed">
              {invoice.buyerDetails?.addressLine}, {invoice.buyerDetails?.city}, {invoice.buyerDetails?.district} - {invoice.buyerDetails?.pincode}
            </p>
            <p className="text-slate-600">Phone: {invoice.buyerDetails?.phone}</p>
            <p className="font-mono font-semibold text-slate-800">Drug License No: {invoice.buyerDetails?.drugLicenseNumber || 'TN/ERD/20B/88219'}</p>
            {invoice.buyerDetails?.gstin && (
              <p className="font-mono font-semibold text-slate-800">GSTIN: {invoice.buyerDetails?.gstin}</p>
            )}
          </div>

          {/* Invoice Specifics */}
          <div className="space-y-1.5 text-right font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Invoice No:</span>
              <span className="font-black text-sm text-slate-900">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Order ID:</span>
              <span className="font-bold text-slate-800">{invoice.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Invoice Date:</span>
              <span className="font-bold text-slate-800">{new Date(invoice.issuedDate || invoice.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Payment Terms:</span>
              <span className="font-bold text-slate-800">{invoice.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Payment Status:</span>
              <span className="font-bold text-emerald-700 uppercase">{invoice.paymentStatus}</span>
            </div>
          </div>

        </div>

        {/* Itemized Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 text-slate-900 font-extrabold uppercase text-[10px]">
                <th className="py-2 pr-2">#</th>
                <th className="py-2 pr-2">Product Description & Active Salt</th>
                <th className="py-2 px-2">Manufacturer</th>
                <th className="py-2 px-2 font-mono">Batch</th>
                <th className="py-2 px-2 text-center">Pack</th>
                <th className="py-2 px-2 text-right">Qty</th>
                <th className="py-2 px-2 text-right">Wholesale Rate</th>
                <th className="py-2 px-2 text-right">GST %</th>
                <th className="py-2 pl-2 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoice.items?.map((item, idx) => (
                <tr key={idx} className="py-2">
                  <td className="py-2.5 pr-2 font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-2.5 pr-2">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{item.genericName}</p>
                  </td>
                  <td className="py-2.5 px-2 text-slate-700">{item.manufacturer}</td>
                  <td className="py-2.5 px-2 font-mono text-[11px] text-slate-800">{item.batchNumber}</td>
                  <td className="py-2.5 px-2 text-center text-slate-600">{item.packSize}</td>
                  <td className="py-2.5 px-2 text-right font-bold text-slate-900">{item.quantity}</td>
                  <td className="py-2.5 px-2 text-right font-mono">₹{item.unitPrice?.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-right font-mono">{item.gstRate}%</td>
                  <td className="py-2.5 pl-2 text-right font-bold font-mono text-slate-900">₹{item.total?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* GST & Financial Calculation Summary */}
        <div className="grid grid-cols-2 gap-8 pt-4 border-t-2 border-slate-900 text-xs">
          
          {/* Bank Settlement Info */}
          <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-extrabold uppercase text-[10px] text-slate-500">Agency Bank Transfer Details (RTGS/NEFT):</h4>
            <div className="font-mono text-[11px] space-y-0.5 text-slate-800">
              <p><span className="text-slate-500 font-sans">Bank Name:</span> State Bank of India, Erode Main Branch</p>
              <p><span className="text-slate-500 font-sans">Account Name:</span> SAKTHIMURUGAN MEDICAL AGENCY</p>
              <p><span className="text-slate-500 font-sans">Current A/c No:</span> 3899201048821</p>
              <p><span className="text-slate-500 font-sans">IFSC Code:</span> SBIN0000837</p>
            </div>
          </div>

          {/* Totals Table */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-sans">Taxable Subtotal:</span>
              <span className="font-bold text-slate-900">₹{invoice.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-sans">CGST (Central Tax 50%):</span>
              <span className="font-bold text-slate-900">₹{(invoice.gstTotal / 2)?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-sans">SGST (State Tax 50%):</span>
              <span className="font-bold text-slate-900">₹{(invoice.gstTotal / 2)?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm">
              <span className="font-black font-sans text-slate-900">Invoice Total:</span>
              <span className="font-black text-base text-slate-900">₹{invoice.grandTotal?.toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* Terms & Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-200 text-[11px] text-slate-500">
          <div>
            <h5 className="font-bold text-slate-700 uppercase text-[10px] mb-1">Terms & Conditions:</h5>
            <ol className="list-decimal pl-4 space-y-0.5 leading-relaxed">
              <li>Supplies are made strictly under Form 20B/21B wholesale license conditions.</li>
              <li>Goods once sold cannot be returned unless intimation is received within 7 days.</li>
              <li>Subject to Erode Jurisdiction only.</li>
            </ol>
          </div>

          <div className="text-right space-y-10">
            <p className="font-bold text-slate-800">For SAKTHIMURUGAN MEDICAL AGENCY</p>
            <div className="pt-8">
              <p className="font-bold text-slate-900">Authorized Signatory / Pharmacist</p>
              <p className="text-[10px] text-slate-400">Form 20B/21B Licensed Distributor</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default InvoicePage;
