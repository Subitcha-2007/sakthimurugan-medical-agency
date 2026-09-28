const Category = require('../models/Category');
const Medicine = require('../models/Medicine');

// @desc    Get all active categories with medicine counts
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });

    // Aggregate counts
    const categoryWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Medicine.countDocuments({ category: cat._id, isActive: true });
        return {
          ...cat.toObject(),
          medicineCount: count,
        };
      })
    );

    res.json({
      success: true,
      count: categoryWithCounts.length,
      categories: categoryWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by ID or slug
// @route   GET /api/categories/:idOrSlug
// @access  Public
exports.getCategory = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let category;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(idOrSlug);
    } else {
      category = await Category.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const count = await Medicine.countDocuments({ category: category._id, isActive: true });

    res.json({
      success: true,
      category: {
        ...category.toObject(),
        medicineCount: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin only)
exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, icon, image, displayOrder } = req.body;

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const category = await Category.create({
      name,
      slug: generatedSlug,
      description,
      icon: icon || 'Pill',
      image,
      displayOrder: displayOrder || 0,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};
