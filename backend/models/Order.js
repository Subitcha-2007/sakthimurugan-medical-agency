const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true,
  },
  name: { type: String, required: true },
  genericName: { type: String },
  manufacturer: { type: String, required: true },
  batchNumber: { type: String, required: true },
  packSize: { type: String, required: true },
  hsnCode: { type: String, default: '3004' },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  mrp: { type: Number },
  gstRate: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    default: '',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    drugLicenseNumber: {
      type: String,
      default: '',
    },
    gstin: {
      type: String,
      default: '',
    },
    items: [orderItemSchema],
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
    grandTotal: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      addressLine: { type: String, required: true },
      landmark: { type: String },
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, default: 'Tamil Nadu' },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    deliveryArea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryArea',
    },
    deliveryAreaName: {
      type: String,
      default: 'Erode Central Hub',
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    statusHistory: [statusHistorySchema],
    paymentMethod: {
      type: String,
      enum: ['Direct B2B Bank Transfer (NEFT/RTGS)', '30-Day Credit (Wholesale Approved)', 'Cash on Delivery (COD/Cheque)'],
      default: 'Direct B2B Bank Transfer (NEFT/RTGS)',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Partial', 'Credit Approved'],
      default: 'Pending',
    },
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    deliveryAssignment: {
      staffMember: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      staffName: { type: String },
      staffPhone: { type: String },
      vehicleNumber: { type: String },
      dispatchDate: { type: Date },
      expectedDeliveryDate: { type: Date },
      deliveryNotes: { type: String },
    },
    orderNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
