const BusinessApplication = require('../models/BusinessApplication');
const User = require('../models/User');

// @desc    Get all business applications (with optional status filter)
// @route   GET /api/business-applications
// @access  Private (Admin / Staff)
exports.getAllApplications = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { applicantName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { drugLicenseNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await BusinessApplication.find(query)
      .populate('applicant', 'name email phone accountStatus')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    const counts = {
      all: await BusinessApplication.countDocuments(),
      pending: await BusinessApplication.countDocuments({ status: 'pending' }),
      approved: await BusinessApplication.countDocuments({ status: 'approved' }),
      rejected: await BusinessApplication.countDocuments({ status: 'rejected' }),
    };

    res.json({
      success: true,
      counts,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application by ID
// @route   GET /api/business-applications/:id
// @access  Private (Admin / Staff)
exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await BusinessApplication.findById(req.params.id)
      .populate('applicant', 'name email phone accountStatus createdAt')
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Review client business application (Approve or Reject)
// @route   PUT /api/business-applications/:id/review
// @access  Private (Admin only)
exports.reviewApplication = async (req, res, next) => {
  try {
    const { action, rejectionReason, adminNotes } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: "Action must be either 'approve' or 'reject'" });
    }

    const application = await BusinessApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    application.status = newStatus;
    application.reviewedBy = req.user._id;
    application.reviewedAt = Date.now();
    application.adminNotes = adminNotes || '';

    if (action === 'reject') {
      application.rejectionReason = rejectionReason || 'Drug license / business verification criteria not fulfilled.';
    } else {
      application.rejectionReason = '';
    }

    await application.save();

    // Update corresponding user record in MongoDB
    const user = await User.findById(application.applicant);
    if (user) {
      user.accountStatus = newStatus;
      if (action === 'approve') {
        user.approvedAt = Date.now();
        user.approvedBy = req.user._id;
        user.rejectionReason = '';
        if (application.drugLicenseNumber) {
          user.businessDetails.drugLicenseNumber = application.drugLicenseNumber;
        }
        if (application.gstin) {
          user.businessDetails.gstin = application.gstin;
        }
      } else {
        user.rejectionReason = application.rejectionReason;
      }
      await user.save();
    }

    res.json({
      success: true,
      message: `Client business account application has been ${newStatus.toUpperCase()}`,
      application,
      userStatus: user ? user.accountStatus : null,
    });
  } catch (error) {
    next(error);
  }
};
