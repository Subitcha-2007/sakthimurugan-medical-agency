const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BusinessApplication = require('../models/BusinessApplication');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'sakthimurugan_super_secure_jwt_secret_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new client business user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      shopName,
      businessType,
      drugLicenseNumber,
      gstin,
      addressLine,
      city,
      district,
      state,
      pincode,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists' });
    }

    // Create user with default pending status and role client
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash: password,
      role: 'client',
      accountStatus: 'pending',
      businessDetails: {
        shopName: shopName || name,
        businessType: businessType || 'Pharmacy / Medical Shop',
        drugLicenseNumber: drugLicenseNumber || '',
        gstin: gstin || '',
        ownerName: name,
      },
      addresses: [
        {
          addressLine: addressLine || 'Shop Location',
          city: city || 'Erode',
          district: district || 'Erode',
          state: state || 'Tamil Nadu',
          pincode: pincode || '638001',
          isDefault: true,
        },
      ],
      themePreference: 'light',
    });

    // Automatically create a BusinessApplication entry for Admin review
    const application = await BusinessApplication.create({
      applicant: user._id,
      applicantName: name,
      businessName: shopName || name,
      businessType: businessType || 'Pharmacy / Medical Shop',
      phone,
      email: email.toLowerCase(),
      address: addressLine || 'Shop Location',
      city: city || 'Erode',
      district: district || 'Erode',
      state: state || 'Tamil Nadu',
      pincode: pincode || '638001',
      drugLicenseNumber: drugLicenseNumber || 'DL-PENDING-VERIFICATION',
      gstin: gstin || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Your registration request has been submitted successfully. Your account is currently awaiting admin approval.',
      accountStatus: 'pending',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        accountStatus: user.accountStatus,
        businessDetails: user.businessDetails,
        applicationId: application._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Role-based status checks:
    // If user is a client and not approved, return precise status message without generating wholesale clearance session
    if (user.role === 'client') {
      if (user.accountStatus === 'pending') {
        return res.status(403).json({
          success: false,
          accountStatus: 'pending',
          message: 'Your business account is awaiting admin approval. Please wait while our team verifies your drug license & business credentials.',
        });
      }
      if (user.accountStatus === 'rejected') {
        return res.status(403).json({
          success: false,
          accountStatus: 'rejected',
          message: `Your business account application was not approved. ${user.rejectionReason ? 'Reason: ' + user.rejectionReason : 'Please contact 9994446994 for assistance.'}`,
        });
      }
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        accountStatus: user.accountStatus,
        businessDetails: user.businessDetails,
        addresses: user.addresses,
        themePreference: user.themePreference || 'light',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        accountStatus: user.accountStatus,
        businessDetails: user.businessDetails,
        addresses: user.addresses,
        themePreference: user.themePreference || 'light',
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user theme preference
// @route   PUT /api/auth/theme
// @access  Private
exports.updateThemePreference = async (req, res, next) => {
  try {
    const { theme } = req.body;
    if (!['light', 'dark'].includes(theme)) {
      return res.status(400).json({ success: false, message: 'Invalid theme option' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, { themePreference: theme }, { new: true });

    res.json({
      success: true,
      themePreference: user.themePreference,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update business profile / address
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, shopName, businessType, drugLicenseNumber, gstin, addresses } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (shopName) user.businessDetails.shopName = shopName;
    if (businessType) user.businessDetails.businessType = businessType;
    if (drugLicenseNumber) user.businessDetails.drugLicenseNumber = drugLicenseNumber;
    if (gstin) user.businessDetails.gstin = gstin;
    if (addresses && Array.isArray(addresses)) user.addresses = addresses;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        accountStatus: user.accountStatus,
        businessDetails: user.businessDetails,
        addresses: user.addresses,
        themePreference: user.themePreference,
      },
    });
  } catch (error) {
    next(error);
  }
};
