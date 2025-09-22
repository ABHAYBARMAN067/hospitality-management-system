import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  // Validate order items
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No order items provided'
    });
  }

  // Check if all products exist and have sufficient stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found: ${item.name}`
      });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for product: ${item.name}`
      });
    }
  }

  // Create order
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  });

  // Update product stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: -item.quantity } }
    );
  }

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order
  });
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user._id })
    .populate('orderItems.product', 'name images price')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ user: req.user._id });

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images price');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user owns the order or is admin
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this order'
    });
  }

  res.status(200).json({
    success: true,
    order
  });
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Update order status
  if (orderStatus) {
    order.orderStatus = orderStatus;

    // Set timestamps based on status
    if (orderStatus === 'shipped' && !order.shippedAt) {
      order.shippedAt = new Date();
    }

    if (orderStatus === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }
  }

  // Update payment status
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;

    if (paymentStatus === 'paid' && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
    }
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    order
  });
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = {};
  if (req.query.status) {
    filter.orderStatus = req.query.status;
  }

  if (req.query.paymentStatus) {
    filter.paymentStatus = req.query.paymentStatus;
  }

  if (req.query.search) {
    filter.orderNumber = { $regex: req.query.search, $options: 'i' };
  }

  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images price')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    orders
  });
});

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
export const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
  const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
  const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
  const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
  const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

  const totalRevenue = await Order.aggregate([
    { $match: { orderStatus: { $in: ['delivered', 'shipped'] } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);

  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        orderStatus: { $in: ['delivered', 'shipped'] },
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0
    }
  });
});
