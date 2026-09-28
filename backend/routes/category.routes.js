const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
} = require('../controllers/category.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/', getCategories);
router.get('/:idOrSlug', getCategory);
router.post('/', protect, authorizeRoles('admin'), createCategory);
router.put('/:id', protect, authorizeRoles('admin'), updateCategory);

module.exports = router;
