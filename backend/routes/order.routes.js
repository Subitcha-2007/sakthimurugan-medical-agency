const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  assignDelivery,
} = require('../controllers/order.controller');
const { protect, authorizeRoles, requireApprovedClient } = require('../middleware/auth.middleware');

router.post('/', protect, requireApprovedClient, createOrder);
router.get('/my-orders', protect, requireApprovedClient, getMyOrders);
router.get('/', protect, authorizeRoles('admin', 'staff'), getAllOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, authorizeRoles('admin', 'staff'), updateOrderStatus);
router.post('/:id/assign-delivery', protect, authorizeRoles('admin', 'staff'), assignDelivery);

module.exports = router;
