const express = require('express');
const router = express.Router();
const {
  getAllApplications,
  getApplicationById,
  reviewApplication,
} = require('../controllers/businessApplication.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/', protect, authorizeRoles('admin', 'staff'), getAllApplications);
router.get('/:id', protect, authorizeRoles('admin', 'staff'), getApplicationById);
router.put('/:id/review', protect, authorizeRoles('admin'), reviewApplication);

module.exports = router;
