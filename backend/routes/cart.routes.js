const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} = require('../controllers/cart.controller');
const { protect, requireApprovedClient } = require('../middleware/auth.middleware');

router.get('/', protect, requireApprovedClient, getCart);
router.post('/items', protect, requireApprovedClient, addToCart);
router.put('/items/:itemId', protect, requireApprovedClient, updateCartItemQuantity);
router.delete('/items/:itemId', protect, requireApprovedClient, removeCartItem);
router.delete('/', protect, requireApprovedClient, clearCart);

module.exports = router;
