const express = require('express');
const router = express.Router();
const {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  updateStock,
  getInventoryAlerts,
} = require('../controllers/medicine.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/', getMedicines);
router.get('/alerts/inventory', protect, authorizeRoles('admin', 'staff'), getInventoryAlerts);
router.get('/:id', getMedicineById);
router.post('/', protect, authorizeRoles('admin', 'staff'), createMedicine);
router.put('/:id', protect, authorizeRoles('admin', 'staff'), updateMedicine);
router.patch('/:id/stock', protect, authorizeRoles('admin', 'staff'), updateStock);

module.exports = router;
