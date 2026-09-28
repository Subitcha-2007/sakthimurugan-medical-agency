const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sakthimurugan_super_secure_jwt_secret_key_2026');
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ success: false, message: 'The user belonging to this token no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is invalid or has expired' });
  }
};

// Authorize roles (e.g. ['admin'], ['admin', 'staff'])
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this route`,
      });
    }
    next();
  };
};

// Require approved client status for wholesale shopping/ordering
const requireApprovedClient = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'staff') {
    return next(); // Admins and staff have clearance
  }

  if (req.user.role === 'client') {
    if (req.user.accountStatus === 'pending') {
      return res.status(403).json({
        success: false,
        accountStatus: 'pending',
        message: 'Your business account is awaiting admin approval. You will be able to access wholesale ordering once approved.',
      });
    }
    if (req.user.accountStatus === 'rejected') {
      return res.status(403).json({
        success: false,
        accountStatus: 'rejected',
        message: `Your business account application was not approved. Reason: ${req.user.rejectionReason || 'Verification requirements unmet'}.`,
      });
    }
    if (req.user.accountStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        accountStatus: req.user.accountStatus,
        message: 'Access restricted to approved business clients.',
      });
    }
  }

  next();
};

module.exports = {
  protect,
  authorizeRoles,
  requireApprovedClient,
};
