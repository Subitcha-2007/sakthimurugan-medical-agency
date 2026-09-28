const Pincode = require('../models/Pincode');
const DeliveryArea = require('../models/DeliveryArea');

// @desc    Check serviceability and delivery availability for a specific pincode
// @route   GET /api/pincodes/check/:pincode
// @access  Public
exports.checkPincodeAvailability = async (req, res, next) => {
  try {
    const { pincode } = req.params;

    if (!pincode || pincode.trim().length !== 6) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit Indian PIN code' });
    }

    const pincodeDoc = await Pincode.findOne({ pincode: pincode.trim() }).populate('deliveryArea');

    if (!pincodeDoc || !pincodeDoc.isActive || !pincodeDoc.deliveryArea || !pincodeDoc.deliveryArea.isActive) {
      return res.json({
        success: true,
        serviceable: false,
        pincode: pincode.trim(),
        message: `Pincode ${pincode.trim()} is currently outside our direct wholesale delivery network. We are actively expanding across Western Tamil Nadu!`,
      });
    }

    res.json({
      success: true,
      serviceable: true,
      pincode: pincodeDoc.pincode,
      areaName: pincodeDoc.areaName,
      district: pincodeDoc.district,
      state: pincodeDoc.state,
      deliveryArea: pincodeDoc.deliveryArea.name,
      estimatedDeliveryDays: pincodeDoc.estimatedDeliveryDays,
      estimatedDeliveryText: pincodeDoc.estimatedDeliveryDays === 1 ? 'Same-Day / Next-Morning Wholesale Delivery' : `${pincodeDoc.estimatedDeliveryDays} Days Express Delivery`,
      message: `Direct wholesale delivery available for ${pincodeDoc.areaName}, ${pincodeDoc.district}!`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pincodes with filtering & pagination
// @route   GET /api/pincodes
// @access  Public
exports.getAllPincodes = async (req, res, next) => {
  try {
    const { deliveryArea, district, search, isActive } = req.query;
    let query = {};

    if (deliveryArea && deliveryArea !== 'all') {
      query.deliveryArea = deliveryArea;
    }

    if (district && district !== 'all') {
      query.district = new RegExp(`^${district}$`, 'i');
    }

    if (isActive !== undefined && isActive !== 'all') {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { pincode: { $regex: search, $options: 'i' } },
        { areaName: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
      ];
    }

    const pincodes = await Pincode.find(query)
      .populate('deliveryArea', 'name district state isActive')
      .sort({ pincode: 1 });

    res.json({
      success: true,
      count: pincodes.length,
      pincodes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new pincode
// @route   POST /api/pincodes
// @access  Private (Admin only)
exports.createPincode = async (req, res, next) => {
  try {
    const { pincode, areaName, district, state, deliveryArea, estimatedDeliveryDays } = req.body;

    const area = await DeliveryArea.findById(deliveryArea);
    if (!area) {
      return res.status(400).json({ success: false, message: 'Invalid delivery area selected' });
    }

    const newPincode = await Pincode.create({
      pincode: pincode.trim(),
      areaName,
      district: district || area.district,
      state: state || area.state,
      deliveryArea: area._id,
      deliveryAreaName: area.name,
      estimatedDeliveryDays: estimatedDeliveryDays || 1,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: `Pincode ${newPincode.pincode} (${newPincode.areaName}) added successfully`,
      pincode: newPincode,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pincode
// @route   PUT /api/pincodes/:id
// @access  Private (Admin only)
exports.updatePincode = async (req, res, next) => {
  try {
    const updated = await Pincode.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('deliveryArea', 'name');

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Pincode not found' });
    }

    res.json({
      success: true,
      message: 'Pincode updated successfully',
      pincode: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle active status of pincode
// @route   PATCH /api/pincodes/:id/toggle
// @access  Private (Admin only)
exports.togglePincode = async (req, res, next) => {
  try {
    const pincode = await Pincode.findById(req.params.id);
    if (!pincode) {
      return res.status(404).json({ success: false, message: 'Pincode not found' });
    }

    pincode.isActive = !pincode.isActive;
    await pincode.save();

    res.json({
      success: true,
      message: `Pincode ${pincode.pincode} is now ${pincode.isActive ? 'Active' : 'Inactive'}`,
      pincode,
    });
  } catch (error) {
    next(error);
  }
};
