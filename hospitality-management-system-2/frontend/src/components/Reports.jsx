import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingSpinner from './UI/LoadingSpinner';
import {
  FaChartBar,
  FaCalendarAlt,
  FaDollarSign,
  FaChartLine,
  FaDownload,
  FaFilter
} from 'react-icons/fa';

function Reports({ restaurantId }) {
  const [reports, setReports] = useState(null);
  const [weeklyReports, setWeeklyReports] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    return weekStart.toISOString().split('T')[0];
  });

  useEffect(() => {
    fetchReports();
  }, [restaurantId, selectedDate, selectedWeekStart]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchDailyReports(),
        fetchWeeklyReports(),
        fetchPerformance()
      ]);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyReports = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reports/daily/${restaurantId}/${selectedDate}`);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching daily reports:', error);
    }
  };

  const fetchWeeklyReports = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reports/weekly/${restaurantId}/${selectedWeekStart}`);
      setWeeklyReports(response.data);
    } catch (error) {
      console.error('Error fetching weekly reports:', error);
    }
  };

  const fetchPerformance = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reports/performance/${restaurantId}`);
      setPerformance(response.data);
    } catch (error) {
      console.error('Error fetching performance:', error);
    }
  };

  const exportReport = () => {
    const reportData = {
      daily: reports,
      weekly: weeklyReports,
      performance: performance,
      generatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `restaurant_report_${restaurantId}_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return <LoadingSpinner size={60} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <FaChartBar className="mr-3 text-blue-600" />
              Reports & Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Detailed insights into your restaurant performance
            </p>
          </div>
          <button
            onClick={exportReport}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center"
          >
            <FaDownload className="mr-2" />
            Export Report
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaFilter className="mr-2 text-gray-600" />
          Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Select Week Start</label>
            <input
              type="date"
              value={selectedWeekStart}
              onChange={(e) => setSelectedWeekStart(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </motion.div>

      {/* Performance Overview */}
      {performance && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaChartLine className="mr-3 text-green-600" />
            Performance Overview (Last 30 Days)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">${performance.totalRevenue}</p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-blue-600">{performance.totalOrders}</p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Average Order Value</h3>
              <p className="text-3xl font-bold text-purple-600">${Math.round(performance.averageOrderValue * 100) / 100}</p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Growth Rate</h3>
              <p className={`text-3xl font-bold ${performance.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {performance.growthRate >= 0 ? '+' : ''}{performance.growthRate}%
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Daily Reports */}
      {reports && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaCalendarAlt className="mr-3 text-blue-600" />
            Daily Report - {selectedDate}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Bookings</h3>
              <p className="text-3xl font-bold text-blue-600">{reports.bookings.total}</p>
              <div className="text-sm text-gray-600 mt-2">
                <p>Approved: {reports.bookings.approved}</p>
                <p>Pending: {reports.bookings.pending}</p>
                <p>Rejected: {reports.bookings.rejected}</p>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Orders</h3>
              <p className="text-3xl font-bold text-green-600">{reports.orders.total}</p>
              <div className="text-sm text-gray-600 mt-2">
                <p>Pending: {reports.orders.pending}</p>
                <p>Preparing: {reports.orders.preparing}</p>
                <p>Delivered: {reports.orders.delivered}</p>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Revenue</h3>
              <p className="text-3xl font-bold text-purple-600">${reports.revenue}</p>
              <p className="text-sm text-gray-600 mt-2">Total earnings</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Weekly Reports */}
      {weeklyReports && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaChartBar className="mr-3 text-orange-600" />
            Weekly Report - {selectedWeekStart} to {weeklyReports.endDate}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Daily Revenue</h3>
              <div className="space-y-2">
                {Object.entries(weeklyReports.dailyRevenue).map(([date, revenue]) => (
                  <div key={date} className="flex justify-between">
                    <span>{date}</span>
                    <span className="font-semibold">${revenue}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Daily Orders</h3>
              <div className="space-y-2">
                {Object.entries(weeklyReports.dailyOrders).map(([date, orders]) => (
                  <div key={date} className="flex justify-between">
                    <span>{date}</span>
                    <span className="font-semibold">{orders}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Total Weekly Revenue</h3>
                <p className="text-3xl font-bold text-green-600">${weeklyReports.totalRevenue}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Total Weekly Orders</h3>
                <p className="text-3xl font-bold text-blue-600">{weeklyReports.totalOrders}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Reports;
