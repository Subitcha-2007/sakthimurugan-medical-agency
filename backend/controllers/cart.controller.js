const Cart = require('../models/Cart');
const Medicine = require('../models/Medicine');

// Helper to recalculate cart totals with GST
const calculateCartTotals = (cart) => {
  let subtotal = 0;
  let gstTotal = 0;

  cart.items.forEach((item) => {
    item.subtotal = +(item.quantity * item.unitPrice).toFixed(2);
    item.gstAmount = +(item.subtotal * (item.gstRate / 100)).toFixed(2);
    item.total = +(item.subtotal + item.gstAmount).toFixed(2);

    subtotal += item.subtotal;
    gstTotal += item.gstAmount;
  });

  cart.subtotal = +subtotal.toFixed(2);
  cart.gstTotal = +gstTotal.toFixed(2);
  cart.grandTotal = +(subtotal + gstTotal).toFixed(2);
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private (Approved Client)
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.medicine',
      select: 'name genericName manufacturer packSize wholesalePrice stock gstRate image batchNumber expiryDate isActive',
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        subtotal: 0,
        gstTotal: 0,
        grandTotal: 0,
      });
    }

    // Filter out inactive or deleted items if any, and check stock availability
    let needsSave = false;
    cart.items = cart.items.filter((item) => {
      if (!item.medicine || !item.medicine.isActive) {
        needsSave = true;
        return false;
      }
      return true;
    });

    if (needsSave) {
      calculateCartTotals(cart);
      await cart.save();
    }

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart or increment quantity
// @route   POST /api/cart/items
// @access  Private (Approved Client)
exports.addToCart = async (req, res, next) => {
  try {
    const { medicineId, quantity = 1 } = req.body;

    const medicine = await Medicine.findById(medicineId);
    if (!medicine || !medicine.isActive) {
      return res.status(404).json({ success: false, message: 'Medicine product is unavailable or inactive' });
    }

    if (medicine.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${medicine.stock} units available)`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.medicine.toString() === medicineId.toString()
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (medicine.stock < newQty) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Total in cart (${newQty}) exceeds available warehouse stock (${medicine.stock})`,
        });
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].unitPrice = medicine.wholesalePrice;
      cart.items[existingIndex].gstRate = medicine.gstRate;
    } else {
      cart.items.push({
        medicine: medicine._id,
        quantity: Number(quantity),
        unitPrice: medicine.wholesalePrice,
        gstRate: medicine.gstRate,
        subtotal: 0,
        gstAmount: 0,
        total: 0,
      });
    }

    calculateCartTotals(cart);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.medicine',
      select: 'name genericName manufacturer packSize wholesalePrice stock gstRate image batchNumber expiryDate',
    });

    res.json({
      success: true,
      message: `${medicine.name} added to cart`,
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/items/:itemId
// @access  Private (Approved Client)
exports.updateCartItemQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    const medicine = await Medicine.findById(item.medicine);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine product no longer exists' });
    }

    if (medicine.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${medicine.stock} units currently available in inventory`,
      });
    }

    item.quantity = Number(quantity);
    item.unitPrice = medicine.wholesalePrice;
    item.gstRate = medicine.gstRate;

    calculateCartTotals(cart);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.medicine',
      select: 'name genericName manufacturer packSize wholesalePrice stock gstRate image batchNumber expiryDate',
    });

    res.json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private (Approved Client)
exports.removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    calculateCartTotals(cart);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.medicine',
      select: 'name genericName manufacturer packSize wholesalePrice stock gstRate image batchNumber expiryDate',
    });

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all items from cart
// @route   DELETE /api/cart
// @access  Private (Approved Client)
exports.clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.subtotal = 0;
      cart.gstTotal = 0;
      cart.grandTotal = 0;
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared',
      cart,
    });
  } catch (error) {
    next(error);
  }
};
