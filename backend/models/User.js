const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['client', 'staff', 'admin'],
      default: 'client',
    },
    accountStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    businessDetails: {
      shopName: { type: String, trim: true },
      businessType: { type: String, enum: ['Pharmacy / Medical Shop', 'Hospital / Clinic', 'Wholesale Distributor', 'Nursing Home', 'Other'], default: 'Pharmacy / Medical Shop' },
      drugLicenseNumber: { type: String, trim: true },
      gstin: { type: String, trim: true },
      ownerName: { type: String, trim: true },
      panNumber: { type: String, trim: true },
    },
    addresses: [
      {
        addressLine: { type: String, required: true },
        landmark: { type: String },
        city: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, default: 'Tamil Nadu' },
        pincode: { type: String, required: true },
        isDefault: { type: Boolean, default: true },
      },
    ],
    themePreference: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    approvedAt: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Hash password prior to saving if not already a bcrypt hash
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  if (this.passwordHash.startsWith('$2a$') || this.passwordHash.startsWith('$2b$')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
