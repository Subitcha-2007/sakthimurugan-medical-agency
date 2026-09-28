const Medicine = require('../models/Medicine');
const Category = require('../models/Category');

// @desc    Get all medicines with search, category, filters, sorting & pagination
// @route   GET /api/medicines
// @access  Public (Catalog browsing)
exports.getMedicines = async (req, res, next) => {
  try {
    const {
      search,
      category,
      manufacturer,
      dosageForm,
      minPrice,
      maxPrice,
      inStockOnly,
      isFeatured,
      sortBy = 'name',
      order = 'asc',
      page = 1,
      limit = 12,
    } = req.query;

    let query = { isActive: true };

    // Search by name, generic name, or manufacturer
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { genericName: searchRegex },
        { manufacturer: searchRegex },
        { batchNumber: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) query.category = cat._id;
      }
    }

    // Manufacturer filter
    if (manufacturer && manufacturer !== 'all') {
      query.manufacturer = new RegExp(`^${manufacturer}$`, 'i');
    }

    // Dosage Form filter
    if (dosageForm && dosageForm !== 'all') {
      query.dosageForm = dosageForm;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.wholesalePrice = {};
      if (minPrice) query.wholesalePrice.$gte = Number(minPrice);
      if (maxPrice) query.wholesalePrice.$lte = Number(maxPrice);
    }

    // Stock availability filter
    if (inStockOnly === 'true' || inStockOnly === true) {
      query.stock = { $gt: 0 };
    }

    // Featured filter
    if (isFeatured === 'true' || isFeatured === true) {
      query.isFeatured = true;
    }

    // Sorting
    let sortOptions = {};
    if (sortBy === 'price-low') {
      sortOptions = { wholesalePrice: 1 };
    } else if (sortBy === 'price-high') {
      sortOptions = { wholesalePrice: -1 };
    } else if (sortBy === 'stock') {
      sortOptions = { stock: -1 };
    } else if (sortBy === 'popular' || sortBy === 'featured') {
      sortOptions = { isFeatured: -1, createdAt: -1 };
    } else if (sortBy === 'newest') {
      sortOptions = { createdAt: -1 };
    } else {
      sortOptions = { [sortBy]: order === 'desc' ? -1 : 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Medicine.countDocuments(query);
    const medicines = await Medicine.find(query)
      .populate('category', 'name slug icon')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get list of unique manufacturers for filter sidebar
    const manufacturers = await Medicine.distinct('manufacturer', { isActive: true });
    const dosageForms = await Medicine.distinct('dosageForm', { isActive: true });

    res.json({
      success: true,
      count: medicines.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      filterOptions: {
        manufacturers: manufacturers.sort(),
        dosageForms: dosageForms.sort(),
      },
      medicines,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single medicine details by ID
// @route   GET /api/medicines/:id
// @access  Public
exports.getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate('category', 'name slug icon');

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found in catalog' });
    }

    // Also get related medicines in same category
    const relatedMedicines = await Medicine.find({
      category: medicine.category._id,
      _id: { $ne: medicine._id },
      isActive: true,
    })
      .limit(4)
      .select('name genericName manufacturer wholesalePrice mrp stock packSize image');

    res.json({
      success: true,
      medicine,
      relatedMedicines,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new medicine product
// @route   POST /api/medicines
// @access  Private (Admin / Staff)
exports.createMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.create(req.body);
    const populated = await Medicine.findById(medicine._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Medicine successfully added to wholesale catalog',
      medicine: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update medicine details
// @route   PUT /api/medicines/:id
// @access  Private (Admin / Staff)
exports.updateMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    res.json({
      success: true,
      message: 'Medicine updated successfully',
      medicine,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update stock quantity directly
// @route   PATCH /api/medicines/:id/stock
// @access  Private (Admin / Staff)
exports.updateStock = async (req, res, next) => {
  try {
    const { stock, batchNumber, expiryDate } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({ success: false, message: 'Stock must be a non-negative number' });
    }

    let updateFields = { stock: Number(stock) };
    if (batchNumber) updateFields.batchNumber = batchNumber;
    if (expiryDate) updateFields.expiryDate = new Date(expiryDate);

    const medicine = await Medicine.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    }).populate('category', 'name slug');

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    res.json({
      success: true,
      message: `Stock for ${medicine.name} updated to ${medicine.stock} units`,
      medicine,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low stock and near-expiry alerts for inventory management
// @route   GET /api/medicines/alerts/inventory
// @access  Private (Admin / Staff)
exports.getInventoryAlerts = async (req, res, next) => {
  try {
    // Low stock medicines
    const lowStockMedicines = await Medicine.find({
      isActive: true,
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    })
      .populate('category', 'name')
      .sort({ stock: 1 });

    // Near expiry (within 120 days)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 120);

    const nearExpiryMedicines = await Medicine.find({
      isActive: true,
      expiryDate: { $lte: futureDate },
    })
      .populate('category', 'name')
      .sort({ expiryDate: 1 });

    res.json({
      success: true,
      lowStockCount: lowStockMedicines.length,
      nearExpiryCount: nearExpiryMedicines.length,
      lowStockMedicines,
      nearExpiryMedicines,
    });
  } catch (error) {
    next(error);
  }
};
