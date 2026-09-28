const DeliveryArea = require('../models/DeliveryArea');
const Pincode = require('../models/Pincode');

// @desc    Get all delivery areas with their serviced pincodes count
// @route   GET /api/delivery-areas
// @access  Public
exports.getDeliveryAreas = async (req, res, next) => {
  try {
    const areas = await DeliveryArea.find().sort({ isActive: -1, name: 1 });

    const areasWithCounts = await Promise.all(
      areas.map(async (area) => {
        const count = await Pincode.countDocuments({ deliveryArea: area._id, isActive: true });
        const pincodes = await Pincode.find({ deliveryArea: area._id, isActive: true }).select('pincode areaName');
        return {
          ...area.toObject(),
          activePincodesCount: count,
          servicedPincodes: pincodes,
        };
      })
    );

    res.json({
      success: true,
      count: areasWithCounts.length,
      areas: areasWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new delivery region
// @route   POST /api/delivery-areas
// @access  Private (Admin only)
exports.createDeliveryArea = async (req, res, next) => {
  try {
    const area = await DeliveryArea.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Proposed delivery area created successfully',
      area,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery region
// @route   PUT /api/delivery-areas/:id
// @access  Private (Admin only)
exports.updateDeliveryArea = async (req, res, next) => {
  try {
    const area = await DeliveryArea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!area) {
      return res.status(404).json({ success: false, message: 'Delivery area not found' });
    }

    res.json({
      success: true,
      message: 'Delivery area updated successfully',
      area,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle active status of delivery area
// @route   PATCH /api/delivery-areas/:id/toggle
// @access  Private (Admin only)
exports.toggleDeliveryArea = async (req, res, next) => {
  try {
    const area = await DeliveryArea.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ success: false, message: 'Delivery area not found' });
    }

    area.isActive = !area.isActive;
    await area.save();

    // Also toggle associated pincodes
    await Pincode.updateMany({ deliveryArea: area._id }, { isActive: area.isActive });

    res.json({
      success: true,
      message: `Delivery area ${area.name} has been ${area.isActive ? 'activated' : 'deactivated'}`,
      area,
    });
  } catch (error) {
    next(error);
  }
};
