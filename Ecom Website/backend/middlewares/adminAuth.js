import User from '../models/User.js';

// Middleware to ensure admin-specific data isolation
export const adminDataFilter = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  // Add admin filter to request for data isolation
  req.adminFilter = {
    createdBy: req.user._id
  };

  next();
};

// Middleware to get admin-specific data
export const getAdminData = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Get admin-specific information
    const adminInfo = await User.findById(req.user._id).select('name adminId role');
    req.adminInfo = adminInfo;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving admin information'
    });
  }
};

// Middleware to validate admin ownership of resources
export const validateAdminOwnership = (resourceType = 'resource') => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // For resources that should be admin-specific, add admin filter
    if (!req.adminFilter) {
      req.adminFilter = {
        createdBy: req.user._id
      };
    }

    next();
  };
};
