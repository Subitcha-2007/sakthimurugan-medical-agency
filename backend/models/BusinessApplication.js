const mongoose = require('mongoose');

const businessApplicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    businessType: {
      type: String,
      required: [true, 'Business type is required'],
      enum: ['Pharmacy / Medical Shop', 'Hospital / Clinic', 'Wholesale Distributor', 'Nursing Home', 'Other'],
      default: 'Pharmacy / Medical Shop',
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      default: 'Tamil Nadu',
    },
    pincode: {
      type: String,
      required: true,
    },
    drugLicenseNumber: {
      type: String,
      required: [true, 'Drug License Number (Form 20B/21B) is required'],
      trim: true,
    },
    gstin: {
      type: String,
      trim: true,
    },
    panNumber: {
      type: String,
      trim: true,
    },
    documents: [
      {
        docType: { type: String, default: 'Drug License Copy' },
        docName: { type: String },
        docUrl: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BusinessApplication', businessApplicationSchema);
