const mongoose = require('mongoose');

const deliveryAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Area name is required'],
      unique: true,
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District name is required'],
      trim: true,
    },
    state: {
      type: String,
      default: 'Tamil Nadu',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    hubAddress: {
      type: String,
      default: '',
    },
    contactPhone: {
      type: String,
      default: '9994446994',
    },
    estimatedDeliveryTime: {
      type: String,
      default: 'Same Day / Next Morning',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    pincodesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DeliveryArea', deliveryAreaSchema);
