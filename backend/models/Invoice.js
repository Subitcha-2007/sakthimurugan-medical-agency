const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerDetails: {
      companyName: { type: String, default: 'SAKTHIMURUGAN MEDICAL AGENCY' },
      address: { type: String, default: '50, 1st Floor, Kamaraj Street, Erode, Tamil Nadu - 638001' },
      phone: { type: String, default: '9994446994, 9865730150' },
      email: { type: String, default: 'orders@sakthimuruganmedicals.com' },
      drugLicenseNumber: { type: String, default: 'TN/ERD/20B/10492 & 21B/10493' },
      gstin: { type: String, default: '33AABCS1234F1Z8' },
      pan: { type: String, default: 'AABCS1234F' },
      fssaiLicense: { type: String, default: '12419008000451' },
    },
    buyerDetails: {
      shopName: { type: String, required: true },
      contactPerson: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, default: 'Tamil Nadu' },
      pincode: { type: String, required: true },
      drugLicenseNumber: { type: String },
      gstin: { type: String },
    },
    items: [
      {
        medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
        name: { type: String, required: true },
        genericName: { type: String },
        manufacturer: { type: String, required: true },
        batchNumber: { type: String, required: true },
        hsnCode: { type: String, default: '3004' },
        packSize: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        mrp: { type: Number },
        gstRate: { type: Number, required: true },
        subtotal: { type: Number, required: true },
        gstAmount: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    cgst: {
      type: Number,
      default: 0,
    },
    sgst: {
      type: Number,
      default: 0,
    },
    igst: {
      type: Number,
      default: 0,
    },
    gstTotal: {
      type: Number,
      required: true,
    },
    roundOff: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      default: 'Direct B2B Bank Transfer (NEFT/RTGS)',
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    termsAndConditions: {
      type: String,
      default: '1. Goods once sold will be taken back only if returned within 7 days in original sealed pack. 2. Subject to Erode Jurisdiction only. 3. Medicines must be stored according to manufacturer temperature instructions.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
