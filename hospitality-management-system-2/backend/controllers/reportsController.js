const express = require('express');
const TableBooking = require('../models/TableBooking');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Get daily reports for a restaurant
router.get('/daily/:restaurantId/:date', authMiddleware, async (req, res) => {
  try {
    const { restaurantId, date } = req.params;
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    // Get bookings for the day
    const bookings = await TableBooking.find({
      restaurantId,
      date: { $gte: startDate, $lt: endDate }
    }).populate('userId', 'name email');

    // Get orders for the day
    const orders = await Order.find({
      restaurantId,
      createdAt: { $gte: startDate, $lt: endDate }
    }).populate('userId', 'name email');

    // Calculate revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Booking statistics
    const bookingStats = {
      total: bookings.length,
      approved: bookings.filter(b => b.status === 'approved').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
      pending: bookings.filter(b => b.status === 'pending').length
    };

    // Order statistics
    const orderStats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      delivered: orders.filter(o => o.status === 'delivered').length
    };

    res.json({
      date,
      restaurantId,
      bookings: bookingStats,
      orders: orderStats,
      revenue: totalRevenue,
      bookingDetails: bookings,
      orderDetails: orders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get weekly reports for a restaurant
router.get('/weekly/:restaurantId/:startDate', authMiddleware, async (req, res) => {
  try {
    const { restaurantId, startDate } = req.params;
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const orders = await Order.find({
      restaurantId,
      createdAt: { $gte: start, $lt: end }
    });

    const dailyRevenue = {};
    const dailyOrders = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      dailyRevenue[dateStr] = 0;
      dailyOrders[dateStr] = 0;
    }

    orders.forEach(order => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (dailyRevenue[dateStr] !== undefined) {
        dailyRevenue[dateStr] += order.totalPrice;
        dailyOrders[dateStr] += 1;
      }
    });

    res.json({
      restaurantId,
      startDate,
      endDate: end.toISOString().split('T')[0],
      dailyRevenue,
      dailyOrders,
      totalRevenue: Object.values(dailyRevenue).reduce((sum, val) => sum + val, 0),
      totalOrders: Object.values(dailyOrders).reduce((sum, val) => sum + val, 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get restaurant performance metrics
router.get('/performance/:restaurantId', authMiddleware, async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await Order.find({
      restaurantId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Calculate growth rate (comparing last 15 days to previous 15 days)
    const last15Days = orders.filter(order =>
      order.createdAt >= new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    );
    const previous15Days = orders.filter(order =>
      order.createdAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) &&
      order.createdAt < new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    );

    const recentRevenue = last15Days.reduce((sum, order) => sum + order.totalPrice, 0);
    const previousRevenue = previous15Days.reduce((sum, order) => sum + order.totalPrice, 0);
    const growthRate = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    res.json({
      restaurantId,
      totalRevenue,
      totalOrders: orders.length,
      averageOrderValue,
      growthRate: Math.round(growthRate * 100) / 100,
      period: 'Last 30 days'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
