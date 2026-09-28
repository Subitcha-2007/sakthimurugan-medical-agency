const express = require('express');
const router = express.Router();
const {
  checkPincodeAvailability,
  getAllPincodes,
  createPincode,
  updatePincode,
  togglePincode,
} = require('../controllers/pincode.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/check/:pincode', checkPincodeAvailability);
router.get('/', getAllPincodes);
router.post('/', protect, authorizeRoles('admin'), createPincode);
router.put('/:id', protect, authorizeRoles('admin'), updatePincode);
router.patch('/:id/toggle', protect, authorizeRoles('admin'), togglePincode);

module.exports = router;
