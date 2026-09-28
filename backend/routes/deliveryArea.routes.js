const express = require('express');
const router = express.Router();
const {
  getDeliveryAreas,
  createDeliveryArea,
  updateDeliveryArea,
  toggleDeliveryArea,
} = require('../controllers/deliveryArea.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/', getDeliveryAreas);
router.post('/', protect, authorizeRoles('admin'), createDeliveryArea);
router.put('/:id', protect, authorizeRoles('admin'), updateDeliveryArea);
router.patch('/:id/toggle', protect, authorizeRoles('admin'), toggleDeliveryArea);

module.exports = router;
