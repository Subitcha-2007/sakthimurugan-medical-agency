const Invoice = require('../models/Invoice');
const Order = require('../models/Order');

// @desc    Get invoice details by order ID or invoice number
// @route   GET /api/invoices/:orderIdOrInvoiceNumber
// @access  Private
exports.getInvoice = async (req, res, next) => {
  try {
    const { orderIdOrInvoiceNumber } = req.params;

    let invoice = await Invoice.findOne({
      $or: [
        { invoiceNumber: orderIdOrInvoiceNumber },
        { orderId: orderIdOrInvoiceNumber },
      ],
    }).populate('user', 'name email phone businessDetails');

    if (!invoice && orderIdOrInvoiceNumber.match(/^[0-9a-fA-F]{24}$/)) {
      invoice = await Invoice.findOne({
        $or: [{ _id: orderIdOrInvoiceNumber }, { order: orderIdOrInvoiceNumber }],
      }).populate('user', 'name email phone businessDetails');
    }

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Tax Invoice not found' });
    }

    // Restrict access for client to own invoices only
    if (req.user.role === 'client' && invoice.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this invoice' });
    }

    res.json({
      success: true,
      invoice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all invoices (Admin / Staff) or client's invoices
// @route   GET /api/invoices
// @access  Private
exports.getAllInvoices = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'client') {
      query.user = req.user._id;
    }

    const { search } = req.query;
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
        { 'buyerDetails.shopName': { $regex: search, $options: 'i' } },
      ];
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    next(error);
  }
};
