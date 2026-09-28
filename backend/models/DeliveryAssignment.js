const mongoose = require('mongoose');

const deliveryAssignmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    staffMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    staffName: {
      type: String,
      required: true,
    },
    staffPhone: {
      type: String,
      required: true,
    },
    vehicleNumber: {
      type: String,
      default: 'TN-33-AX-8921 (Agency Delivery Van)',
    },
    status: {
      type: String,
      enum: ['Assigned', 'Out for Delivery', 'Delivered', 'Returned / Failed'],
      default: 'Assigned',
    },
    dispatchDate: {
      type: Date,
      default: Date.now,
    },
    deliveredDate: {
      type: Date,
    },
    routeArea: {
      type: String,
      default: 'Erode Central Delivery Circuit',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DeliveryAssignment', deliveryAssignmentSchema);
