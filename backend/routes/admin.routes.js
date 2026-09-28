const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
} = require('../controllers/admin.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/stats', protect, authorizeRoles('admin', 'staff'), getDashboardStats);
router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.patch('/users/:id', protect, authorizeRoles('admin'), updateUserStatus);

module.exports = router;
