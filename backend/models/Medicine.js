const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
      index: true,
    },
    genericName: {
      type: String,
      required: [true, 'Generic chemical composition is required'],
      trim: true,
      index: true,
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer / Pharma company is required'],
      trim: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    dosageForm: {
      type: String,
      required: true,
      enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment / Gel', 'Drops', 'Inhaler', 'Powder / Sachet', 'IV Infusion'],
      default: 'Tablet',
    },
    packSize: {
      type: String,
      required: [true, 'Pack size (e.g. 10x10 Tablets, 100ml Bottle) is required'],
      trim: true,
    },
    wholesalePrice: {
      type: Number,
      required: [true, 'Wholesale net purchase price is required'],
      min: [0, 'Price cannot be negative'],
    },
    mrp: {
      type: Number,
      required: [true, 'Maximum Retail Price (MRP) is required'],
      min: [0, 'MRP cannot be negative'],
    },
    gstRate: {
      type: Number,
      required: true,
      enum: [0, 5, 12, 18, 28],
      default: 12,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    minOrderQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    lowStockThreshold: {
      type: Number,
      default: 20,
    },
    batchNumber: {
      type: String,
      required: true,
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    manufacturingDate: {
      type: Date,
    },
    hsnCode: {
      type: String,
      default: '3004',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    storageConditions: {
      type: String,
      default: 'Store in a cool & dry place below 25°C. Protect from direct light.',
    },
    requiresPrescription: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for fast multi-field searching
medicineSchema.index({ name: 'text', genericName: 'text', manufacturer: 'text' });

module.exports = mongoose.model('Medicine', medicineSchema);
