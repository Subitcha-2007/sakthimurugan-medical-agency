const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Medicine = require('../models/Medicine');
const Pincode = require('../models/Pincode');
const DeliveryArea = require('../models/DeliveryArea');
const Invoice = require('../models/Invoice');
const DeliveryAssignment = require('../models/DeliveryAssignment');

// Helper to generate Unique Order ID (e.g. SMA-2026-0928-1042)
const generateOrderId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SMA-${dateStr}-${randomSuffix}`;
};

// Helper to generate Invoice Number (e.g. INV-SMA-26-0891)
const generateInvoiceNumber = () => {
  const yr = new Date().getFullYear().toString().slice(-2);
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `INV-SMA-${yr}-${randomSuffix}`;
};

// @desc    Create new wholesale order from cart / checkout
// @route   POST /api/orders
// @access  Private (Approved Client)
exports.createOrder = async (req, res, next) => {
  try {
    const { deliveryAddress, paymentMethod, orderNotes } = req.body;

    if (!deliveryAddress || !deliveryAddress.pincode || !deliveryAddress.addressLine) {
      return res.status(400).json({ success: false, message: 'Complete delivery address and pincode are required' });
    }

    // Verify delivery area & pincode serviceability in MongoDB
    const pincodeDoc = await Pincode.findOne({ pincode: deliveryAddress.pincode.trim(), isActive: true }).populate('deliveryArea');
    if (!pincodeDoc || !pincodeDoc.deliveryArea || !pincodeDoc.deliveryArea.isActive) {
      return res.status(400).json({
        success: false,
        message: `Delivery is currently not available for pincode ${deliveryAddress.pincode}. Please verify that your delivery location is within our active service regions (Erode, Karur, Namakkal, Salem).`,
      });
    }

    // Fetch user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.medicine');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty. Please add medicines before checkout.' });
    }

    // Verify inventory stock for all items
    const orderItems = [];
    let subtotal = 0;
    let gstTotal = 0;

    for (const item of cart.items) {
      const medicine = await Medicine.findById(item.medicine._id);

      if (!medicine || !medicine.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.medicine.name} is no longer available. Please update your cart.`,
        });
      }

      if (medicine.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${medicine.name}. Warehouse has only ${medicine.stock} units available.`,
        });
      }

      const itemSubtotal = +(item.quantity * medicine.wholesalePrice).toFixed(2);
      const itemGst = +(itemSubtotal * (medicine.gstRate / 100)).toFixed(2);
      const itemTotal = +(itemSubtotal + itemGst).toFixed(2);

      subtotal += itemSubtotal;
      gstTotal += itemGst;

      orderItems.push({
        medicine: medicine._id,
        name: medicine.name,
        genericName: medicine.genericName,
        manufacturer: medicine.manufacturer,
        batchNumber: medicine.batchNumber || 'BN-' + Math.floor(100000 + Math.random() * 900000),
        packSize: medicine.packSize,
        hsnCode: medicine.hsnCode || '3004',
        quantity: item.quantity,
        unitPrice: medicine.wholesalePrice,
        mrp: medicine.mrp,
        gstRate: medicine.gstRate,
        gstAmount: itemGst,
        subtotal: itemSubtotal,
        total: itemTotal,
      });
    }

    subtotal = +subtotal.toFixed(2);
    gstTotal = +gstTotal.toFixed(2);
    const grandTotal = +(subtotal + gstTotal).toFixed(2);

    // Intra-state Tamil Nadu GST (CGST 50% + SGST 50%)
    const cgst = +(gstTotal / 2).toFixed(2);
    const sgst = +(gstTotal / 2).toFixed(2);

    const orderId = generateOrderId();
    const invoiceNumber = generateInvoiceNumber();

    // Create Order
    const order = await Order.create({
      orderId,
      user: req.user._id,
      businessName: req.user.businessDetails?.shopName || req.user.name,
      drugLicenseNumber: req.user.businessDetails?.drugLicenseNumber || '',
      gstin: req.user.businessDetails?.gstin || '',
      items: orderItems,
      subtotal,
      cgst,
      sgst,
      igst: 0,
      gstTotal,
      grandTotal,
      deliveryAddress: {
        addressLine: deliveryAddress.addressLine,
        landmark: deliveryAddress.landmark || '',
        city: deliveryAddress.city || 'Erode',
        district: deliveryAddress.district || pincodeDoc.district,
        state: deliveryAddress.state || 'Tamil Nadu',
        pincode: deliveryAddress.pincode,
        phone: deliveryAddress.phone || req.user.phone,
      },
      deliveryArea: pincodeDoc.deliveryArea._id,
      deliveryAreaName: pincodeDoc.deliveryArea.name,
      paymentMethod: paymentMethod || 'Direct B2B Bank Transfer (NEFT/RTGS)',
      paymentStatus: paymentMethod?.includes('Credit') ? 'Credit Approved' : 'Pending',
      invoiceNumber,
      orderNotes: orderNotes || '',
      status: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: 'Order placed by client and submitted to warehouse queue',
          updatedBy: req.user._id,
        },
      ],
    });

    // Create B2B GST Tax Invoice record
    await Invoice.create({
      invoiceNumber,
      order: order._id,
      orderId: order.orderId,
      user: req.user._id,
      sellerDetails: {
        companyName: 'SAKTHIMURUGAN MEDICAL AGENCY',
        address: '50, 1st Floor, Kamaraj Street, Erode, Tamil Nadu - 638001',
        phone: '9994446994, 9865730150',
        email: 'orders@sakthimuruganmedicals.com',
        drugLicenseNumber: 'TN/ERD/20B/10492 & 21B/10493',
        gstin: '33AABCS1234F1Z8',
      },
      buyerDetails: {
        shopName: req.user.businessDetails?.shopName || req.user.name,
        contactPerson: req.user.name,
        phone: deliveryAddress.phone || req.user.phone,
        email: req.user.email,
        addressLine: deliveryAddress.addressLine,
        city: deliveryAddress.city || 'Erode',
        district: deliveryAddress.district || pincodeDoc.district,
        state: deliveryAddress.state || 'Tamil Nadu',
        pincode: deliveryAddress.pincode,
        drugLicenseNumber: req.user.businessDetails?.drugLicenseNumber || '',
        gstin: req.user.businessDetails?.gstin || '',
      },
      items: orderItems,
      subtotal,
      cgst,
      sgst,
      igst: 0,
      gstTotal,
      grandTotal,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
    });

    // Deduct stock from inventory
    for (const item of cart.items) {
      await Medicine.findByIdAndUpdate(item.medicine._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    cart.subtotal = 0;
    cart.gstTotal = 0;
    cart.grandTotal = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: `Order ${order.orderId} placed successfully!`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's order history
// @route   GET /api/orders/my-orders
// @access  Private (Client)
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by orderId or MongoDB _id
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    } else {
      query = { orderId: id };
    }

    const order = await Order.findOne(query)
      .populate('user', 'name email phone businessDetails')
      .populate('deliveryArea', 'name district state hubAddress contactPhone')
      .populate('statusHistory.updatedBy', 'name role');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure clients can only view their own orders
    if (req.user.role === 'client' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin / Staff)
// @route   GET /api/orders
// @access  Private (Admin / Staff)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { 'deliveryAddress.city': { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      count: orders.length,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status with timeline tracking
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin / Staff)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // If cancelling, restore stock
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        await Medicine.findByIdAndUpdate(item.medicine, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order updated to ${status} by agency operations`,
      updatedBy: req.user._id,
    });

    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign delivery personnel and vehicle to order
// @route   POST /api/orders/:id/assign-delivery
// @access  Private (Admin / Staff)
exports.assignDelivery = async (req, res, next) => {
  try {
    const { staffId, staffName, staffPhone, vehicleNumber, expectedDeliveryDate, deliveryNotes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.deliveryAssignment = {
      staffMember: staffId || req.user._id,
      staffName: staffName || req.user.name,
      staffPhone: staffPhone || req.user.phone,
      vehicleNumber: vehicleNumber || 'TN-33-AX-8921 (Agency Delivery Van)',
      dispatchDate: new Date(),
      expectedDeliveryDate: expectedDeliveryDate || new Date(Date.now() + 24 * 60 * 60 * 1000),
      deliveryNotes: deliveryNotes || '',
    };

    if (order.status === 'Processing' || order.status === 'Confirmed' || order.status === 'Pending') {
      order.status = 'Dispatched';
      order.statusHistory.push({
        status: 'Dispatched',
        timestamp: new Date(),
        note: `Dispatched with ${order.deliveryAssignment.vehicleNumber}. Handled by ${order.deliveryAssignment.staffName}`,
        updatedBy: req.user._id,
      });
    }

    await order.save();

    // Create or update delivery assignment document
    await DeliveryAssignment.findOneAndUpdate(
      { order: order._id },
      {
        order: order._id,
        orderId: order.orderId,
        staffMember: staffId || req.user._id,
        staffName: order.deliveryAssignment.staffName,
        staffPhone: order.deliveryAssignment.staffPhone,
        vehicleNumber: order.deliveryAssignment.vehicleNumber,
        status: 'Out for Delivery',
        dispatchDate: new Date(),
        notes: deliveryNotes || '',
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Delivery assigned and order dispatched',
      order,
    });
  } catch (error) {
    next(error);
  }
};
