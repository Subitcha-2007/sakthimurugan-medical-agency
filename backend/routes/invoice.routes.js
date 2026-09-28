const express = require('express');
const router = express.Router();
const { getInvoice, getAllInvoices } = require('../controllers/invoice.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getAllInvoices);
router.get('/:orderIdOrInvoiceNumber', protect, getInvoice);

module.exports = router;
