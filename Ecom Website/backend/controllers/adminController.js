import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// @desc    Get dashboard overview
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardOverview = asyncHandler(async (req, res) => {
  // Admin-specific filter
  const adminFilter = req.adminFilter || {};

  // Get counts for admin-specific data
  const totalUsers = await User.countDocuments(adminFilter.createdBy ? { createdBy: adminFilter.createdBy } : {});
  const totalProducts = await Product.countDocuments({
    isActive: true,
    ...adminFilter
  });
  const totalOrders = await Order.countDocuments(adminFilter);
  const totalRevenue = await Order.aggregate([
    { $match: {
      orderStatus: { $in: ['delivered', 'shipped'] },
      ...adminFilter
    }},
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);

  // Get recent orders
  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get low stock products
  const lowStockProducts = await Product.find({
    isActive: true,
    stock: { $lte: 10 }
  })
    .select('name stock category')
    .sort({ stock: 1 })
    .limit(5);

  // Get monthly sales data for the last 12 months
  const monthlySales = await Order.aggregate([
    {
      $match: {
        orderStatus: { $in: ['delivered', 'shipped'] },
        createdAt: {
          $gte: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1)
        }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        total: { $sum: '$totalPrice' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  // Get top selling products
  const topProducts = await Order.aggregate([
    { $match: { orderStatus: { $in: ['delivered', 'shipped'] } } },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        totalSold: { $sum: '$orderItems.quantity' },
        totalRevenue: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        name: '$product.name',
        image: { $arrayElemAt: ['$product.images', 0] },
        totalSold: 1,
        totalRevenue: 1
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]);

  res.status(200).json({
    success: true,
    overview: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      lowStockProducts,
      monthlySales,
      topProducts
    }
  });
});

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
export const getSalesAnalytics = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query; // days
  const days = parseInt(period);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Daily sales for the period
  const dailySales = await Order.aggregate([
    {
      $match: {
        orderStatus: { $in: ['delivered', 'shipped'] },
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        total: { $sum: '$totalPrice' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);

  // Sales by category
  const salesByCategory = await Order.aggregate([
    { $match: { orderStatus: { $in: ['delivered', 'shipped'] } } },
    { $unwind: '$orderItems' },
    {
      $lookup: {
        from: 'products',
        localField: 'orderItems.product',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$product.category',
        total: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } },
        count: { $sum: '$orderItems.quantity' }
      }
    },
    { $sort: { total: -1 } }
  ]);

  // Payment method distribution
  const paymentMethods = await Order.aggregate([
    { $match: { orderStatus: { $in: ['delivered', 'shipped'] } } },
    {
      $group: {
        _id: '$paymentInfo.method',
        total: { $sum: '$totalPrice' },
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      dailySales,
      salesByCategory,
      paymentMethods,
      period: `${days} days`
    }
  });
});

// @desc    Get user activity report
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
export const getUserAnalytics = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query; // days
  const days = parseInt(period);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // New users over time
  const newUsers = await User.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);

  // Users by role
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  // Active vs blocked users
  const userStatus = await User.aggregate([
    {
      $group: {
        _id: '$isBlocked',
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      newUsers,
      usersByRole,
      userStatus,
      period: `${days} days`
    }
  });
});
