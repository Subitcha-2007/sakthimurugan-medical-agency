const User = require('../models/User');
const BusinessApplication = require('../models/BusinessApplication');
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const DeliveryArea = require('../models/DeliveryArea');
const Pincode = require('../models/Pincode');

// @desc    Get real-time Admin / Staff dashboard statistics and alerts directly from MongoDB
// @route   GET /api/admin/stats
// @access  Private (Admin / Staff)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalClients,
      pendingApprovals,
      approvedClients,
      rejectedClients,
      totalMedicines,
      lowStockMedicines,
      totalOrders,
      pendingOrders,
      processingOrders,
      dispatchedOrders,
      deliveredOrders,
      cancelledOrders,
      activeAreas,
      totalPincodes,
      recentOrders,
      pendingApplications,
      lowStockList,
    ] = await Promise.all([
      User.countDocuments({ role: 'client' }),
      BusinessApplication.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'client', accountStatus: 'approved' }),
      User.countDocuments({ role: 'client', accountStatus: 'rejected' }),
      Medicine.countDocuments({ isActive: true }),
      Medicine.countDocuments({ isActive: true, $expr: { $lte: ['$stock', '$lowStockThreshold'] } }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      Order.countDocuments({ status: 'Processing' }),
      Order.countDocuments({ status: 'Dispatched' }),
      Order.countDocuments({ status: 'Delivered' }),
      Order.countDocuments({ status: 'Cancelled' }),
      DeliveryArea.countDocuments({ isActive: true }),
      Pincode.countDocuments({ isActive: true }),
      Order.find().sort({ createdAt: -1 }).limit(6).populate('user', 'name email phone'),
      BusinessApplication.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(6),
      Medicine.find({ isActive: true, $expr: { $lte: ['$stock', '$lowStockThreshold'] } })
        .sort({ stock: 1 })
        .limit(6)
        .populate('category', 'name'),
    ]);

    // Calculate total wholesale revenue from delivered & processing orders
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$grandTotal' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    res.json({
      success: true,
      stats: {
        totalClients,
        pendingApprovals,
        approvedClients,
        rejectedClients,
        totalMedicines,
        lowStockCount: lowStockMedicines,
        totalOrders,
        pendingOrders,
        processingOrders,
        dispatchedOrders,
        deliveredOrders,
        cancelledOrders,
        activeDeliveryAreas: activeAreas,
        totalPincodes,
        totalRevenue: +totalRevenue.toFixed(2),
      },
      recentOrders,
      pendingApplications,
      lowStockList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list (with role and status management)
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    let query = {};

    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.accountStatus = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { 'businessDetails.shopName': { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-passwordHash').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or account status directly
// @route   PATCH /api/admin/users/:id
// @access  Private (Admin only)
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { role, accountStatus, rejectionReason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) user.role = role;
    if (accountStatus) {
      user.accountStatus = accountStatus;
      if (accountStatus === 'approved') {
        user.approvedAt = new Date();
        user.approvedBy = req.user._id;
        user.rejectionReason = '';
      } else if (accountStatus === 'rejected') {
        user.rejectionReason = rejectionReason || 'Criteria not met';
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'User status updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        businessDetails: user.businessDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};
