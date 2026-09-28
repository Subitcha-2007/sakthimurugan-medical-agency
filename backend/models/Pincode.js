const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      unique: true,
      trim: true,
      index: true,
    },
    areaName: {
      type: String,
      required: [true, 'Locality / Area Name is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    state: {
      type: String,
      default: 'Tamil Nadu',
      trim: true,
    },
    deliveryArea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryArea',
      required: true,
    },
    deliveryAreaName: {
      type: String,
    },
    estimatedDeliveryDays: {
      type: Number,
      default: 1, // 1 = Same day / 24 hours
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: 'Standard Wholesale Delivery Route Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pincode', pincodeSchema);
